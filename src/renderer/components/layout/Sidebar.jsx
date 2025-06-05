import React, { useState } from 'react';
import { MessageSquare, User, Settings } from 'lucide-react';

const Sidebar = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('chats');

  const tabs = [
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className="flex h-screen w-16 flex-col items-center border-r bg-card">
      {/* App Logo/Title */}
      <div className="flex h-16 w-full items-center justify-center border-b">
        <h1 className="text-xl font-bold text-primary">WV</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-1 flex-col items-center space-y-4 py-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              title={tab.label}
            >
              <Icon className="h-6 w-6" />
              {/* Tooltip */}
              <span className="absolute left-14 z-50 hidden rounded-md bg-black px-2 py-1 text-xs text-white group-hover:block">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* User Profile Button */}
      <div className="border-t p-4">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
          title="Your Profile"
        >
          <User className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;