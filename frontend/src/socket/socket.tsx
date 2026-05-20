import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {io, Socket} from 'socket.io-client';

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {

    const token = await AsyncStorage.getItem('@auth_token')

    console.log('🔑 Token retrieved from storage:', token ? 'Token found ✅' : 'No token ❌');

    if(!token){
        throw new Error("no token found. User must login first");
    }

    if(!socket){
        console.log('🌐 Connecting to socket server:', API_URL);

        socket = io(API_URL, {
            auth: {token},
            transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
        });

        // Add error listener
        socket.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error.message);
            // Check if it's an auth error
            if (error.message.includes('Authentication error')) {
                console.log('💡 Hint: Token might be expired or invalid. Try logging in again.');
            }
        });

         await new Promise((resolve, reject)=> {
            socket?.on("connect",()=> {
                console.log("✅ Socket connected successfully:", socket?.id);
                resolve(true);
            })

            socket?.on("connect_error", (error) => {
                console.error("❌ Socket connection failed:", error.message);
                reject(new Error(error.message));
            })

            // Add timeout
            setTimeout(() => {
                reject(new Error('Socket connection timeout'));
            }, 10000);
         })

    }

    return socket;

}

export function getSocket(): Socket | null {
    return socket
}

export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect()
        socket = null;
    }
}


