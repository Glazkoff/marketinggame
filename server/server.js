const express = require('express');
const app = express();
const server = app.listen(3001, function () {
  console.log('server running on port 3001');
})

const io = require('socket.io')(server);
let connections = []
io.on('connection', function (socket) {
  connections.push(socket.id)
  console.log(connections)
  socket.broadcast.emit('connectList', connections)
  socket.on('setName', (name) => {
    socket.name = name
    console.log(socket.name);
  })
  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket.id), 1)
    console.log(connections)
  })
})
