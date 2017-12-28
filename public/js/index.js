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

socket.on('newLocationMessage',function (coords) {
   var li = jQuery('<li></li>');
   var a = jQuery('<a target="_blank">My current location</a>');

   li.text(`${coords.from}: `);
   a.attr('href',coords.url);
   li.append(a);
    jQuery('#messages').append(li);

});

var textMessage = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'user',
        text: textMessage.val()
    }, function () {
        textMessage.val('');
    });
});

var locationMessage = jQuery('#location-message');

locationMessage.on('click', function () {
    if(!navigator.geolocation) {
        return alert("geo location not supported by your browser.");
    }

    locationMessage.attr('disabled','disabled').text('Sharing location...');
    navigator.geolocation.getCurrentPosition(function (position) {

        locationMessage.removeAttr('disabled').text('Share location');
        socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationMessage.removeAttr('disabled').text('Share location');
       alert("Unable to fetch geo location!");
    });
});