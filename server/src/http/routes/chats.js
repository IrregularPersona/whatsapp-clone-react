const express = require('express');
const router = express.Router();
const db = require('../../database/service');

// Verify user and check chat status
router.get('/verify/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUser } = req.query;

    if (!userId || !currentUser) {
      return res.status(400).json({
        error: 'Both user IDs are required'
      });
    }

    // Verify both users exist
    const [currentUserData, targetUserData] = await Promise.all([
      db.getUserByUuid(currentUser),
      db.getUserByUuid(userId)
    ]);

    if (!currentUserData || !targetUserData) {
      return res.status(404).json({
        error: 'One or both users not found'
      });
    }

    // Check if chat session exists
    const existingSession = await db.getChatSession(currentUser, userId);

    if (existingSession) {
      // If chat exists, return session data
      const messages = await db.getMessages(existingSession.id, 50, 0);
      return res.json({
        status: 'existing',
        session: existingSession,
        messages,
        otherUser: {
          uuid: targetUserData.uuid,
          displayName: targetUserData.display_name
        }
      });
    }

    // Create chat request notification
    await db.createNotification(
      userId,
      currentUser,
      'chat_request',
      { displayName: currentUserData.display_name }
    );

    // If no chat exists, return user info for chat request
    return res.json({
      status: 'new',
      otherUser: {
        uuid: targetUserData.uuid,
        displayName: targetUserData.display_name
      }
    });
  } catch (error) {
    console.error('Error verifying chat:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Initialize new chat
router.post('/initiate', async (req, res) => {
  try {
    const { currentUser, targetUser } = req.body;

    if (!currentUser || !targetUser) {
      return res.status(400).json({
        error: 'Both user IDs are required'
      });
    }

    // Verify both users exist
    const [currentUserData, targetUserData] = await Promise.all([
      db.getUserByUuid(currentUser),
      db.getUserByUuid(targetUser)
    ]);

    if (!currentUserData || !targetUserData) {
      return res.status(404).json({
        error: 'One or both users not found'
      });
    }

    // Create new chat session
    await db.createChatSession(currentUser, targetUser);
    const session = await db.getChatSession(currentUser, targetUser);

    // Update notification status to accepted
    const notifications = await db.getNotifications(targetUser, 'pending');
    const chatRequest = notifications.find(n => 
      n.sender_uuid === currentUser && 
      n.type === 'chat_request'
    );
    
    if (chatRequest) {
      await db.updateNotificationStatus(chatRequest.id, 'accepted');
    }

    res.status(201).json({
      status: 'created',
      session,
      otherUser: {
        uuid: targetUserData.uuid,
        displayName: targetUserData.display_name
      }
    });
  } catch (error) {
    console.error('Error initiating chat:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get all chat sessions for a user
router.get('/sessions', async (req, res) => {
  try {
    const { uuid } = req.query;

    if (!uuid) {
      return res.status(400).json({
        error: 'User UUID is required'
      });
    }

    const sessions = await db.getChatSessionsForUser(uuid);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get messages for a chat session
router.get('/messages', async (req, res) => {
  try {
    const { chatSessionId, limit, offset } = req.query;

    if (!chatSessionId) {
      return res.status(400).json({
        error: 'Chat session ID is required'
      });
    }

    const messages = await db.getMessages(
      chatSessionId,
      parseInt(limit) || 50,
      parseInt(offset) || 0
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Send a message
router.post('/messages', async (req, res) => {
  try {
    const { chatSessionId, senderUuid, encryptedContent } = req.body;

    if (!chatSessionId || !senderUuid || !encryptedContent) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Create message
    const result = await db.createMessage(chatSessionId, senderUuid, encryptedContent);
    
    // Update chat session activity
    await db.updateChatSessionActivity(chatSessionId);

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: result.lastID
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router; 