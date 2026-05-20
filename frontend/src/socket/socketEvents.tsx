import { getSocket } from "./socket";


export const updateProfile = (payload: any, off: boolean = false) => {

    const socket = getSocket();
    if (!socket) {
        console.log('socket is not connected');
        return;
    }

    if (off) {
        socket.off("updateProfile", payload); //payload as the callback
    }else if(typeof payload == 'function'){
        socket.on('updateProfile', payload)   //payload as callback  for this event
    } else {
        socket.emit("Update Profile", payload)  // sending payload as data
    }

};

