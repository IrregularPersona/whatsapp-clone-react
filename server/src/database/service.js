const { db, query, run } = require('./schema');

class DatabaseService {
  // User operations
  async createUser(uuid, displayName, email, passwordHash) {
    const sql = `
      INSERT INTO users (uuid, display_name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;
    return run(sql, [uuid, displayName, email, passwordHash]);
  }

  async getUserByUuid(uuid) {
    const sql = 'SELECT * FROM users WHERE uuid = ?';
    const users = await query(sql, [uuid]);
    return users[0];
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0];
  }

  async updateLastLogin(uuid) {
    const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE uuid = ?';
    return run(sql, [uuid]);
  }

  // Chat session operations
  async createChatSession(user1Uuid, user2Uuid) {
    const sql = `
      INSERT INTO chat_sessions (user1_uuid, user2_uuid)
      VALUES (?, ?)
    `;
    return run(sql, [user1Uuid, user2Uuid]);
  }

  async getChatSession(user1Uuid, user2Uuid) {
    const sql = `
      SELECT * FROM chat_sessions 
      WHERE (user1_uuid = ? AND user2_uuid = ?)
         OR (user1_uuid = ? AND user2_uuid = ?)
    `;
    const sessions = await query(sql, [user1Uuid, user2Uuid, user2Uuid, user1Uuid]);
    return sessions[0];
  }

  async getChatSessionsForUser(uuid) {
    const sql = `
      SELECT cs.*, 
             u1.display_name as user1_display_name,
             u2.display_name as user2_display_name
      FROM chat_sessions cs
      JOIN users u1 ON cs.user1_uuid = u1.uuid
      JOIN users u2 ON cs.user2_uuid = u2.uuid
      WHERE cs.user1_uuid = ? OR cs.user2_uuid = ?
      ORDER BY cs.last_activity DESC
    `;
    return query(sql, [uuid, uuid]);
  }

  // Message operations
  async createMessage(chatSessionId, senderUuid, encryptedContent) {
    const sql = `
      INSERT INTO messages (chat_session_id, sender_uuid, encrypted_content)
      VALUES (?, ?, ?)
    `;
    return run(sql, [chatSessionId, senderUuid, encryptedContent]);
  }

  async getMessages(chatSessionId, limit = 50, offset = 0) {
    const sql = `
      SELECT m.*, u.display_name as sender_display_name
      FROM messages m
      JOIN users u ON m.sender_uuid = u.uuid
      WHERE m.chat_session_id = ?
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return query(sql, [chatSessionId, limit, offset]);
  }

  async updateChatSessionActivity(chatSessionId) {
    const sql = 'UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?';
    return run(sql, [chatSessionId]);
  }

  // Notification operations
  async createNotification(recipientUuid, senderUuid, type, metadata = null) {
    const sql = `
      INSERT INTO notifications (recipient_uuid, sender_uuid, type, metadata)
      VALUES (?, ?, ?, ?)
    `;
    return run(sql, [recipientUuid, senderUuid, type, metadata ? JSON.stringify(metadata) : null]);
  }

  async getNotifications(recipientUuid, status = null) {
    let sql = `
      SELECT n.*, u.display_name as sender_display_name
      FROM notifications n
      JOIN users u ON n.sender_uuid = u.uuid
      WHERE n.recipient_uuid = ?
    `;
    const params = [recipientUuid];

    if (status) {
      sql += ' AND n.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY n.created_at DESC';
    return query(sql, params);
  }

  async updateNotificationStatus(notificationId, status) {
    const sql = `
      UPDATE notifications 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    return run(sql, [status, notificationId]);
  }

  async getPendingNotificationCount(recipientUuid) {
    const sql = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE recipient_uuid = ? AND status = 'pending'
    `;
    const result = await query(sql, [recipientUuid]);
    return result[0].count;
  }
}

module.exports = new DatabaseService(); 