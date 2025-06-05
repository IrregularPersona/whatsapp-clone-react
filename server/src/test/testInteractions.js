const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let authToken = null;

// Helper function to make authenticated requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test user login
async function loginUser(email, password) {
  try {
    const response = await api.post('/auth/login', {
      identifier: email,
      password
    });
    currentUser = response.data.user;
    console.log(`Logged in as: ${currentUser.displayName}`);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

// Test getting chat sessions
async function getChatSessions() {
  try {
    const response = await api.get(`/chats/sessions?uuid=${currentUser.uuid}`);
    console.log('\nChat Sessions:');
    response.data.forEach(session => {
      console.log(`- Chat with: ${session.user1_display_name === currentUser.displayName ? session.user2_display_name : session.user1_display_name}`);
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get chat sessions:', error.response?.data || error.message);
  }
}

// Test getting notifications
async function getNotifications() {
  try {
    const response = await api.get(`/notifications?uuid=${currentUser.uuid}`);
    console.log('\nNotifications:');
    response.data.forEach(notification => {
      console.log(`- ${notification.type} from ${notification.sender_display_name}`);
      console.log(`  Status: ${notification.status}`);
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get notifications:', error.response?.data || error.message);
  }
}

// Test getting messages from a chat
async function getChatMessages(chatSessionId) {
  try {
    const response = await api.get(`/chats/messages?chatSessionId=${chatSessionId}`);
    console.log('\nMessages:');
    response.data.forEach(message => {
      console.log(`- ${message.sender_display_name}: ${message.encrypted_content}`);
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get messages:', error.response?.data || error.message);
  }
}

// Test sending a message
async function sendMessage(chatSessionId, content) {
  try {
    const response = await api.post('/chats/messages', {
      chatSessionId,
      senderUuid: currentUser.uuid,
      encryptedContent: content
    });
    console.log('\nMessage sent successfully!');
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response?.data || error.message);
  }
}

// Run the tests
async function runTests() {
  // Login as Jane
  await loginUser('jane@example.com', 'password123');
  
  // Get chat sessions
  const sessions = await getChatSessions();
  
  // Get notifications
  const notifications = await getNotifications();
  
  // If there are chat sessions, get messages from the first one
  if (sessions && sessions.length > 0) {
    await getChatMessages(sessions[0].id);
    
    // Send a new message
    await sendMessage(sessions[0].id, 'This is a test message!');
    
    // Get messages again to see the new one
    await getChatMessages(sessions[0].id);
  }
}

// Run the tests
runTests(); 