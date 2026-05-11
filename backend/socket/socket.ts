import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import   {Server as SocketIOServer, Socket} from 'socket.io';
import { registerUserEvents } from './userEvents.js';
import User from '../modals/User.js';

dotenv.config();

export function initializeSocket(server:any): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: '*',
        }
    });

    console.log('✅ Socket.IO server initialized');

    io.use(async (socket: Socket, next) =>{
        console.log('🔐 Socket authentication attempt...');
        const token = socket.handshake.auth.token
        if (!token) {
            console.error('❌ Authentication failed: no token provided');
            return next(new Error("Authentication error: no token provided"))
        }

        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

            // Fetch user from database
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                console.error('❌ Authentication failed: user not found');
                return next(new Error("Authentication error: user not found"));
            }

            // Attach user data to socket
            socket.data.userId = user._id.toString();
            socket.data.email = user.email;
            socket.data.name = user.name;
            socket.data.avatar = user.avatar;

            console.log('✅ Socket authenticated for user:', user.name, '(', user.email, ')');
            next();
        } catch (err: any) {
            console.error('❌ Authentication failed:', err.message);
            return next(new Error("Authentication error: " + err.message));
        }
    })

    //when socket connects, register events
    io.on('connection', async (socket: Socket) =>{
        const userId = socket.data.userId;
        console.log(`user connected ${userId}, username:${socket.data.name}`);

        //register events
        registerUserEvents(io, socket);


        socket.on('disconnect', ()=> {
            //user logs out
            console.log(`user disconnected: ${userId}`);
        })
    })

    return io;
}