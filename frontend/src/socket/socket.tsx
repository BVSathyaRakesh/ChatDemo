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
            auth: {token}
        });

        // Add error listener
        socket.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error.message);
        });

         await new Promise((resolve, reject)=> {
            socket?.on("connect",()=> {
                console.log("Socket connected:", socket?.id);
                resolve(true);
            })

            socket?.on("connect_error", (error) => {
                console.error("Socket connection failed:", error.message);
                reject(error);
            })
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


