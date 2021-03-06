//    This socket is used to listen and send data to the server
var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {
       var formattedTime = moment(message.createdAt).format('h:mm a');
       var template = $('#message-template').html();
       var html = Mustache.render(template,{
           text:message.text,
           from:message.from,
           createdAt:formattedTime,
       });
       $('#messages').append(html);
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
       var template = $('#location-message-template').html();
       var html = Mustache.render(template,{
           url:message.url,
           from:message.from,
           createdAt:formattedTime,
       });
       $('#messages').append(html);
});


$('#message-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: $('[name = message]').val(),
    }, function() {
        $('[name=message]',).val('');
    });
});

var locationButton = $('#send-location');
locationButton.on('click',function (){
    //console.log('hello');
    if (!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending location....');

    navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    });
    console.log('hello',position);

    },function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch the location');
    });
});