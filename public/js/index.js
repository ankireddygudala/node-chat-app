var socket = io();
function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight =  messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight  >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}


socket.on('connect', function() {
    console.log('Connected to server');

});
socket.on('disconnect', function(){

    console.log('Disconnected from the server!');
});

socket.on('newMessage', function (msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');

    var template = jQuery('#message_template').html();
    var html = Mustache.render(template,{
        text:msg.text,
        from:msg.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();


    // var li = jQuery('<li></li>');
    // li.text(`${msg.from}  ${formattedTime}: ${msg.text}`);
    //
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function (coords) {
    var formattedTime = moment(coords.createdAt).format('h:mm a');

    var template = jQuery('#location_message_template').html();
    var html = Mustache.render(template, {
       url: coords.url,
       from: coords.from,
       createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
   // var li = jQuery('<li></li>');
   // var a = jQuery('<a target="_blank">My current location</a>');
   //
   // li.text(`${coords.from} ${formattedTime}: `);
   // a.attr('href',coords.url);
   // li.append(a);
   //  jQuery('#messages').append(li);

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

var locationMessage = jQuery('#send-location');

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