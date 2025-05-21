import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGlobalMessages, sendGlobalMessage } from '../services/api';
import SocketService from '../services/socket';
import { useNavigate } from 'react-router-dom';

function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    SocketService.connect();

    // if (!user) {
    //   navigate('/login');
    //   return;
    // }

    const fetchMessages = async () => {
      try {
        const response = await getGlobalMessages();
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchMessages();

    SocketService.onGlobalMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    return () => {
      SocketService.disconnect();
    };
  }, [user, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendGlobalMessage(newMessage);
      
      SocketService.sendGlobalMessage({
        username: user.username,
        message: newMessage,
        timestamp: new Date().toISOString()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '800px',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          color: '#000000'
        }}>Global Chat</h2>
        
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {messages.map((msg, index) => (
            <div 
              key={index}
              style={{
                padding: '0.75rem',
                backgroundColor: msg.username === user?.username ? '#DCF8C6' : 'white',
                borderRadius: '8px',
                maxWidth: '80%',
                alignSelf: msg.username === user?.username ? 'flex-end' : 'flex-start',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ 
                fontWeight: 'bold', 
                color: '#128C7E',
                marginBottom: '0.25rem',
                fontSize: '0.9rem'
              }}>
                {msg.username || msg.sender_username}
              </div>
              <div style={{ wordBreak: 'break-word' }}>
                {msg.message || msg.text}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#666',
                textAlign: 'right',
                marginTop: '0.25rem'
              }}>
                {new Date(msg.timestamp || msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} style={{
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#128C7E',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#075E54'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#128C7E'}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default GlobalChat;
