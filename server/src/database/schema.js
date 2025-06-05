const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Initializing database connection...');
const dbPath = path.join(__dirname, '../../data/whispvault.db');
console.log('Database path:', dbPath);

// Create a new database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
  console.log('Connected to SQLite database');
});

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('Creating database tables...');
    db.serialize(() => {
      // Users table
      console.log('Creating users table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          uuid TEXT PRIMARY KEY,
          display_name TEXT NOT NULL,
          email TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        } else {
          console.log('Users table created successfully');
        }
      });

      // Chat sessions table
      console.log('Creating chat_sessions table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user1_uuid TEXT NOT NULL,
          user2_uuid TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user1_uuid) REFERENCES users(uuid),
          FOREIGN KEY (user2_uuid) REFERENCES users(uuid)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating chat_sessions table:', err);
          reject(err);
        } else {
          console.log('Chat sessions table created successfully');
        }
      });

      // Messages table
      console.log('Creating messages table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chat_session_id INTEGER NOT NULL,
          sender_uuid TEXT NOT NULL,
          encrypted_content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id),
          FOREIGN KEY (sender_uuid) REFERENCES users(uuid)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating messages table:', err);
          reject(err);
        } else {
          console.log('Messages table created successfully');
        }
      });

      // Notifications table
      console.log('Creating notifications table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          recipient_uuid TEXT NOT NULL,
          sender_uuid TEXT NOT NULL,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          metadata TEXT,
          FOREIGN KEY (recipient_uuid) REFERENCES users(uuid),
          FOREIGN KEY (sender_uuid) REFERENCES users(uuid)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating notifications table:', err);
          reject(err);
        } else {
          console.log('Notifications table created successfully');
        }
      });

      // Create indexes
      console.log('Creating indexes...');
      db.run('CREATE INDEX IF NOT EXISTS idx_messages_chat_session ON messages(chat_session_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_uuid)');
      db.run('CREATE INDEX IF NOT EXISTS idx_chat_sessions_users ON chat_sessions(user1_uuid, user2_uuid)');
      db.run('CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_uuid)');
      db.run('CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status)');
      console.log('Indexes created successfully');

      // Final callback
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error('Error enabling foreign keys:', err);
          reject(err);
        } else {
          console.log('Database initialization completed successfully');
          resolve();
        }
      });
    });
  });
};

// Helper function to run queries with promises
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Query error:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Helper function to run single queries with promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Run error:', err);
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  query,
  run
};