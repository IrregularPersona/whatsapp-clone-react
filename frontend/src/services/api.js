import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ${token}';
    }

    return config;
});

export const loginUser = (username, password) => {
    return api.post('/auth/login', {username, password});
};

export const registerUser = (username, password) => {
    return api.post('/auth/register', {username, password});
};

export const getGlobalMessages = () => {
    return api.get('/messages/global');
};

export const sendGlobalMessage = (text, message) => {
    return api.post('/messages/global', { text, message });
};
