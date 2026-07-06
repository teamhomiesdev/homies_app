import { io, Socket } from 'socket.io-client';

// Change this to your actual server endpoint
const SOCKET_URL = 'https://api.homies.support'; 

class SocketService {
  public socket: Socket | null = null;

  // Initialize socket connection and pass the auth token if needed
  public connect(token?: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'], // Highly recommended for React Native performance
      auth: {
        token: token, 
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to socket server:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from socket server:', reason);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;