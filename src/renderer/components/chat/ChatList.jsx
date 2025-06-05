import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/chats/sessions?uuid=${user.uuid}`);
      const data = await response.json();

      if (response.ok) {
        setChats(data);
      } else {
        setError(data.error || 'Failed to load chats');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {chats.length === 0 ? (
          <div className="text-gray-500 text-center">No chats yet</div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="font-medium">
                  {chat.user1_display_name === JSON.parse(localStorage.getItem('user')).displayName
                    ? chat.user2_display_name
                    : chat.user1_display_name}
                </div>
                <div className="text-sm text-gray-500">
                  Last message: {new Date(chat.last_message_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList; 