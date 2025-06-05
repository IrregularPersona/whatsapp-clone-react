import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthContainer = ({ onLogin }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center mb-8">
                    <div className="inline-flex rounded-lg border border-input bg-background p-1">
                        <button
                            onClick={() => setAuthMode('login')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                authMode === 'login'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setAuthMode('register')}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                authMode === 'register'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            Register
                        </button>
                    </div>
                </div>
                {authMode === 'login' ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default AuthContainer; 