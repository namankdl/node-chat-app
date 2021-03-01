 //    This socket is used to listen and send data to the server
 var socket = io();

 socket.on('connect', function() {
     console.log('Connected to server');
     
     socket.emit('createMessage',{
         from:'Naman',
         text: 'yes thats work fine',
         createdAt: 123123,

     });
 });

 socket.on('disconnect', function() {
     console.log('Disconnected from the server');
 });

 socket.on('newMessage', function(message) {
     console.log('New Email',message);
 });