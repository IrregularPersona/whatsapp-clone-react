import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import ChatWindow from './chat/ChatWindow';
import ChatList from './chat/ChatList';
import AuthContainer from './auth/AuthContainer';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'chats':
        return (
          <div className="flex flex-1">
            <ChatList onSelectChat={handleChatSelect} />
            <ChatWindow selectedChat={selectedChat} />
          </div>
        );
      case 'profile':
        return <div className="flex-1 p-4">Profile View</div>;
      case 'settings':
        return <div className="flex-1 p-4">Settings View</div>;
      default:
        return (
          <div className="flex flex-1">
            <ChatList onSelectChat={handleChatSelect} />
            <ChatWindow selectedChat={selectedChat} />
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <AuthContainer onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onTabChange={setActiveView} />
      {renderContent()}
    </div>
  );
};

export default App; 