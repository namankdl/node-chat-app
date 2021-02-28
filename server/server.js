const { dirname } = require('path');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 8090;
var app = express();

//Normal Server
var server = http.createServer(app);

//Server with socketIO.
var io = socketIO(server);

//Register a event listner
io.on('connection', (socket)=> {
      console.log('new user connected');

      socket.on('disconnect', () => {
          console.log('client disconnected');
      });
});

app.use(express.static(publicPath)); 

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
