const express=require('express');
const app=express();
const http=require('http');
const cors=require('cors');
app.use(cors());
const {addUser,removeUser,getUser,getUsersInRoom} = require('./users.js');
const {Server} = require('socket.io');
const router=require('./router');
app.use(router);
const server=http.createServer(app);
const io=new Server(server, {
     cors: {
        origin: 'https://discuss-chat-app-5t8z.vercel.app/',
        methods: ['GET','POST'],
          credentials: true
    },
});
// io.on('connection',(socket)=> {
//     socket.on('join' ,({name,room},callback)=> {
//         const {error,user}=addUser({id: socket.id, name , room});
//         if(error) return callback(error);
//         // socket.emit('message',{user: 'admin',text: `${user.name},welcome to the room ${user.room}`});
//         socket.emit('message' ,
//          {user: 'admin',text: `${user.name},welcome to the room ${user.room}`
//         });
//         //broadset sends message to everyone besides that specific user
//         socket.broadcast.to(user.room).emit('message',{user: 'admin',text:`${user.name},has joined!`});
//         socket.join(user.room);
//         io.to(user.room).emit('roomData',{room: user.room,users:getUsersInRoom(user.room)})
//         callback();
//     });
//     socket.on('sendMessage',(message,callback)=> {
//         const user=getUser(socket.id);
//   io.to(user.room).emit('message',{user: user.name,text: message});

//   callback();
//     });
//     socket.on('disconnect', () => {
//         const user = removeUser(socket.id);
    
//         if(user) {
//           io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
//           io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
//         }
//       })
//     });
// const PORT=process.env.PORT || 5000;
// server.listen(PORT,()=>console.log(`Server has started on ${PORT}`));
io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  
      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
  
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
      const user = removeUser(socket.id);
  
      if(user) {
        io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
    })
  });
  
  server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

