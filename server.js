const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const {generateMessage, generateLocationMessage} = require('./server/utils/generateMessage');
const {isRealString} = require('./server/utils/validation');

const publicPath = path.join(process.cwd(),'/public');

var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server).listen(server);

app.use(express.static(publicPath));


io.on('connection', function (socket){
   console.log('new user connected!');

    socket.emit('newMessage', generateMessage('admin', 'Welcome to chat room'));
    socket.broadcast.emit('newMessage', generateMessage('admin', 'new user connected!'));

    socket.on('join', function (params, callback){
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and Room name are required!');
        }
        callback();
    });

   socket.on('createMessage', function (newMessage, callback) {
      console.log('New Message :', newMessage);
       io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
       callback();
   });

   socket.on('createLocationMessage', function (coords) {

      io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
   });
   socket.on('disconnect', function (){
      console.log('User disconnected!');
   });
});

server.listen(port, function (){
   console.log('Server listening on port ', port);
});
