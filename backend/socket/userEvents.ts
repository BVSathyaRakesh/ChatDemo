import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../modals/User";
import { generateToken } from "../utils/jwt";
import { formatUserResponse } from "../utils/userResponse";


export function registerUserEvents(io: SocketIOServer, socket: Socket){
  socket.on("testSocket",(data) => {

    socket.emit("testSocket", {msg: "It's working!!!"});
  });

  socket.on("Update Profile", async (data: {name?: string, avatar?: string})=>{
       const userId = socket.data.userId;
       if (!userId) {
          return socket.emit('update profile', {
            success: false, msg:"unauthorized"
          })
       }
       try {
              // Prepare update data, filtering out local file URIs
              const updateData: any = {};
              if (data.name !== undefined) {
                updateData.name = data.name;
              }
              // Only save avatar if it's a valid HTTP URL (not local file path)
              if (data.avatar && (data.avatar.startsWith('http://') || data.avatar.startsWith('https://'))) {
                updateData.avatar = data.avatar;
              }

              const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                {returnDocument: 'after'} //will return the user with updated values
              );

              if (!updatedUser) {
                return socket.emit('update profile', {
                  success: false, msg:"unauthorized"
                })
              }

              // Generate token
              const newToken = generateToken(updatedUser._id.toString());
              socket.emit("updateProfile", {
                success: true,
                data: {
                  user: formatUserResponse(updatedUser),
                  token: newToken
                },
                msg: "Profile updated successfully"
              });

       }catch(error){
            console.log('Error updating profile', error);
            socket.emit('update profile',{
              success: false, msg: "Error updating Profile"
            })
       }
  })
}