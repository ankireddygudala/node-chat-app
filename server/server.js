const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const publicPath = path.join(process.cwd(),'../public');

var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server).listen(server);

app.use(express.static(publicPath));

app.get('/', function (req, res) {
   res.sendFile(path.join(process.cwd(),'../public/index.html'));
});

io.on('connection', function (socket){
   console.log('new user connected!');



   socket.on('createMessage', function (newMessage) {
      console.log('New Message :', newMessage);
       io.emit('newMessage', {
           from: newMessage.from,
           text: newMessage.text,
           createdAt: new Date().toDateString()
       });
   });

   socket.on('disconnect', function (){
      console.log('User disconnected!');
   });
});

server.listen(port, function (){
   console.log('Server listening on port ', port);
});
