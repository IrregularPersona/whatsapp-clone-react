import io from 'socket.io-client';

class SocketService {
    socket;
    
    connect() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found for socket connection');
            return;
        }

        this.socket = io('http://localhost:5000', {
            withCredentials: true,
            query: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('Socket Connected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                // Server initiated disconnect, try to reconnect
                this.socket.connect();
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onGlobalMessage(callback) {
        if (this.socket) {
            this.socket.on('receive_message', callback);
        }
    }

    sendGlobalMessage(message) {
        if (this.socket && this.socket.connected) {
            this.socket.emit('send_message', message);
        } else {
            console.error('Socket not connected. Cannot send message.');
        }
    }
}

export default new SocketService();