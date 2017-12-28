var socket = io();
socket.on('connect', function() {
    console.log('Connected to server');

});
socket.on('disconnect', function(){

    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (msg) {
    console.log(msg);
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'user',
        text: jQuery('[name=message]').val()
    }, function () {
        
    });
});