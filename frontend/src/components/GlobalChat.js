import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGlobalMessages, sendGlobalMessage } from '../services/api';
import SocketService from '../services/socket';
import { useNavigate } from 'react-router-dom';

function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  let navigate = useNavigate();

  useEffect(() => {
    SocketService.connect();

    if(user === null) navigate('/login');

    const fetchMessages = async () => {
      try {
        const response = await getGlobalMessages();
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchMessages();

    SocketService.onGlobalMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendGlobalMessage(newMessage);
      
      SocketService.sendGlobalMessage({
        username: user.username,
        message: newMessage
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div>
      <h2>Global Chat</h2>
      <div style={{height: '400px', overflowY: 'scroll', border: '1px solid #ccc'}}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username || msg.sender_username}:</strong> {msg.message || msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input 
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default GlobalChat;
