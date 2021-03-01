const { dirname } = require('path');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8090;
var app = express();

//Middle Ware
app.use(express.static(publicPath));

//Normal Server
var server = http.createServer(app);

//Server with socketIO.
var io = socketIO(server);

//Register a event listner
io.on('connection', (socket) => {
    console.log('new user connected');
    
    //user send an event to the server
    socket.on('createMessage', (message) => {
        console.log('createMesssage', message);

        //when a user send any data it can be broadcast to everyone.
        io.emit('newMessage',{
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
