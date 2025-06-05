const db = require('../database/service');
const { query } = require('../database/schema');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

// Mock users
const mockUsers = [
  {
    uuid: uuidv4(),
    displayName: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    uuid: uuidv4(),
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  },
  {
    uuid: uuidv4(),
    displayName: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123'
  }
];

// Mock messages
const mockMessages = [
  'Hey, how are you?',
  'I\'m good, thanks! How about you?',
  'Doing great! Want to catch up later?',
  'Sure, that sounds good!',
  'What time works for you?',
  'How about 3 PM?',
  'Perfect, see you then!'
];

// Create mock data
async function createMockData() {
  try {
    console.log('Creating mock users...');
    for (const user of mockUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await db.createUser(user.uuid, user.displayName, user.email, passwordHash);
      console.log(`Created user: ${user.displayName}`);
    }

    console.log('\nCreating chat sessions...');
    // Create chat between John and Jane
    const johnJaneSession = await db.createChatSession(mockUsers[0].uuid, mockUsers[1].uuid);
    console.log('Created chat session between John and Jane');

    // Create chat between John and Alice
    const johnAliceSession = await db.createChatSession(mockUsers[0].uuid, mockUsers[2].uuid);
    console.log('Created chat session between John and Alice');

    console.log('\nAdding messages to John-Jane chat...');
    // Add messages to John-Jane chat
    for (let i = 0; i < mockMessages.length; i++) {
      const senderUuid = i % 2 === 0 ? mockUsers[0].uuid : mockUsers[1].uuid;
      await db.createMessage(johnJaneSession.lastID, senderUuid, mockMessages[i]);
      console.log(`Added message: ${mockMessages[i]}`);
    }

    console.log('\nCreating notifications...');
    // Create a pending chat request from Alice to Jane
    await db.createNotification(
      mockUsers[1].uuid, // Jane
      mockUsers[2].uuid, // Alice
      'chat_request',
      { displayName: mockUsers[2].displayName }
    );
    console.log('Created chat request notification from Alice to Jane');

    // Verify data was created
    console.log('\nVerifying created data...');
    
    // Verify users
    const users = await query('SELECT * FROM users');
    console.log('\nUsers in database:', users.length);
    users.forEach(user => {
      console.log(`- ${user.display_name} (${user.email})`);
    });
    
    // Verify chat sessions
    const sessions = await query('SELECT * FROM chat_sessions');
    console.log('\nChat sessions in database:', sessions.length);
    sessions.forEach(session => {
      console.log(`- Session ${session.id}: ${session.user1_uuid} <-> ${session.user2_uuid}`);
    });
    
    // Verify messages
    const messages = await query('SELECT * FROM messages');
    console.log('\nMessages in database:', messages.length);
    messages.forEach(message => {
      console.log(`- Message ${message.id}: ${message.encrypted_content}`);
    });
    
    // Verify notifications
    const notifications = await query('SELECT * FROM notifications');
    console.log('\nNotifications in database:', notifications.length);
    notifications.forEach(notification => {
      console.log(`- Notification ${notification.id}: ${notification.type} (${notification.status})`);
    });

    console.log('\nMock data creation completed!');
    console.log('\nTest Users:');
    mockUsers.forEach(user => {
      console.log(`- ${user.displayName} (${user.email})`);
      console.log(`  UUID: ${user.uuid}`);
      console.log(`  Password: ${user.password}`);
    });

  } catch (error) {
    console.error('Error creating mock data:', error);
  }
}

// Run the script
createMockData(); 