//    This socket is used to listen and send data to the server
var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {
    console.log('New Message', message);

    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current Location</a>');

    li.text(`${message.from}:`);
    a.attr('href', message.url);
    li.append(a);

    $('#messages').append(li);
});


$('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: $('[name = message]').val()
    }, function() {

    });
});

var locationButton = $('#send-location');
locationButton.on('click',function (){
    if (!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    });
    console.log('hello',position);

    },function() {
        alert('Unable to fetch the location');
    });
});