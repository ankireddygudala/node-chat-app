var socket = io();
socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage', {
       from: 'Anki Reddy',
       text: 'Hey, How are u?'
    });
});
socket.on('disconnect', function(){

    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (msg) {
    console.log(msg);
});