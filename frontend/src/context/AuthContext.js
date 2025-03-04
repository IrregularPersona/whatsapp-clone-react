import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => 
{
    const [user, setUser] = useState(null);
    
    useEffect(() => 
    {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData)
        {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (username, password) => 
    {
        try {
            const response  = await loginUser(username, password);
            const { access_token, user_id, username, loggedUsername } = response.data;

            const userData = { user_id, username: loggedUsername };

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);

            return userData;
        } catch (error) {
            console.log('Login Failed', error);
            throw error;
        }
    };

    const register = async (username, password) =>
    {
        try {
            const response = await registerUser(username, password);
            return response.data;
        } catch (error) {
            console.error('Registration Error', error);
            throw error;
        }
    };

    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
      <AuthContext.Provider value={{user, login, register, logout}}>
        {children}
      </AuthContext.Provider>  
    );
};


export const useAuth = () => useContext(AuthContext);