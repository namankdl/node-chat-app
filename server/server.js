const { dirname } = require('path');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8090;
var app = express();

//Middle Ware
app.use(express.static(publicPath));

//Normal Server
var server = http.createServer(app);

//Server with socketIO.
var io = socketIO(server);

var users = new Users();

//Register a event listner
io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('room and room name are required');
            //console.log('hey');
        }

        socket.join(params.room);
        users.addUser(socket.id,params.name,params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        //socket.emit from Admin text Welcome to the chat app.
        socket.emit('newMessage',
            generateMessage('Admin', 'Welcome to the Chat App',));

        // socket.broadcast.emit from Admin next new user joined
        socket.broadcast.to(params.room).emit('newMessage',
            generateMessage('Admin', `${params.name} has joined`));

        callback();
    });


    //user send an event to the client
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text))
        {
             //when a user send any data it can be broadcast to everyone.
             io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));

        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        console.log(coords.latitude);
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user)
        {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
