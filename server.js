const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const {generateMessage,generateLocationMessage} = require('./server/utils/generateMessage');
const validator = require('./server/utils/validation');
const {Users} = require('./server/utils/Users');
const publicPath = path.join(process.cwd(),'/public');

var port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server).listen(server);
var users = new Users();

app.use(express.static(publicPath));


io.on('connection', function (socket){

    socket.on('join', function (params, callback){

        if (!validator.isRealString(params.name) || !validator.isRealString(params.room)){
            callback('Name and Room name are required!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);


        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('admin', 'Welcome to chat room'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined!`));
        callback();
    });

   socket.on('createMessage', function (newMessage, callback) {
       var user = users.getUser(socket.id);
       if(user){
           io.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
       }
       callback();
   });

   socket.on('createLocationMessage', function (coords) {
       var user = users.getUser(socket.id);
       if(user){
           io.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));

       }
   });
   socket.on('disconnect', function (){

     var user = users.removeUser(socket.id);

     if(user) {
         io.to(user.room).emit('updateUserList', users.getUserList(user.room));
         io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left!`));
     }
   });
});

server.listen(port, function (){
   console.log('Server listening on port ', port);
});
