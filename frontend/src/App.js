import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import GlobalChat from './components/GlobalChat';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/chat" element={<GlobalChat />}/>
            {/* <Route path="/" element={<Navigate to="/login" replace />}/> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;