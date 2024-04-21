import { io } from 'socket.io-client';
import { environment } from '../../environments/environment.prod';

export class SocketioService {
    socket;
    constructor() { 
      this.socket = null;
    }
  
    setupSocketConnection() {
      this.socket = io(environment.websocketUrl, { 
        reconnectionDelayMax: 1000,
        transports: ['websocket'] 
      }) // .connect();
      
      this.socket.on('connect', () => {
        console.log("Socket connected!", this.socket.id); // true
      })
    }


    sendEvents(event, data) {
       console.log("Sending from client:", event, data);
       this.socket.emit(event, data);
    }

    receivedEvents(event) {
        console.log("Received:", event);
        if(this.socket) {
            this.socket.on(event, function(data) {
              console.log("Atique Received Event:", data);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
  }