//    This socket is used to listen and send data to the server
var socket = io();

function scrollToBottom(){
    var element = $('#messages');
    var newMessage = element.children('li:last-child');
    var clientHeight = element.prop('clientHeight');
    var scrollTop = element.prop('scrollTop');
    var scrollHeight = element.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
    {
        element.scrollTop(scrollHeight);
    }
 }

socket.on('connect', function () {
    var params = $.deparam(window.location.search);
    console.log(params);
    socket.emit('join', params, function (err) {
        if(err)
        {
            alert(err);
            window.location.href = '/';
        }
        else
        {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from the server');
});

socket.on('updateUserList', function (users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
    console.log('usersList', users);
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
       scrollToBottom();
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
       scrollToBottom();
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