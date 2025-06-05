import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import ChatList from './components/chat/ChatList';
import ChatWindow from './components/chat/ChatWindow';

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router basename="/">
      <div className="h-screen flex">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="flex w-full">
                  <div className="w-80 border-r">
                    <ChatList />
                  </div>
                  <div className="flex-1">
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Select a chat to start messaging
                    </div>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <PrivateRoute>
                <div className="flex w-full">
                  <div className="w-80 border-r">
                    <ChatList />
                  </div>
                  <div className="flex-1">
                    <ChatWindow />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 