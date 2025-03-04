import io from 'socket.io-client';

class SocketService {
    socket;
    
    connect() {
        this.socket = io('http://localhost:5000', {
            withCredentials: true,
            extraHeadears: {
                // add extra headers here if req
                'testing': 'abcd'
            }
        });

        this.socket.on('connect', () => {
            console.log('Socket Connected');
        })

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        })
    }

    disconnect() {
        if (this.socket)
        {
            this.socket.disconnect();
        }
    }

    onGlobalMessage(callback)
    {
        this.socket.on('receive_message', callback);
    }

    sendGlobalMessage(message)
    {
        this.socket.emit('send_message', message);
    }
}

export default new SocketService();