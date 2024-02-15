const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);

app.get('/', (req, res)=>{
    res.send(
        "app running and server started"
    );
});

let roomIdGlobal, imgUrlGloba

io.on('connection', (socket) => {
    socket.on('userJoined', (data) => {
      const { roomId, userId, userName, host, presenter } = data;
      roomIdGlobal = roomId;
      socket.join(roomId);
      socket.emit('userIsJoined', { success: true });
      socket.broadcast.to(roomIdGlobal).emit('whiteBoardresponse', {
        imgUrl: imgUrlGloba,
      });
    });
  
    socket.on('whiteBoardData', (data) => {
      imgUrlGloba = data;
      console.log(data)
      socket.broadcast.to(roomIdGlobal).emit('whiteBoardresponse', {
        imgUrl: data,
      });
    });
  
    // Add error handling if needed
    socket.on('error', (error) => {
      console.error(`Socket error: ${error.message}`);
    });
  });
  


const port = process.env.PORT || 5000;

server.listen(port, ()=>
   console.log('server listening')
   )
