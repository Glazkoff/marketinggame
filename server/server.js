const express = require('express');
const app = express();
const server = app.listen(3001, function () {
  console.log('server running on port 3001');
})

const io = require('socket.io')(server);
let connections = []
let connectedNames = []
let rooms = []
let roomsState = []
let roomNumb = 10;

io.on('connection', function (socket) {
  connections.push(socket.id)
  console.log('Подключения:')
  console.log(connections)

  socket.on('setName', (name) => {
    socket.name = name
    let oldNote = connectedNames.find(element => element.id === socket.id)
    if (oldNote === undefined) {
      let person = {
        name,
        id: socket.id,
        roomId: -1
      }
      connectedNames.push(person)
    } else {
      oldNote.name = name
      console.log(name + ' изменено!')
    }
    console.log(connectedNames)
  })

  socket.on('setRoom', (roomId) => {
    // СДЕЛАТЬ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ КОМНАТЫ
    let oldNote = connectedNames.find(element => element.id === socket.id)
    if (oldNote !== undefined) {
      oldNote.roomId = roomId
      socket.join(roomId, () => {
        console.log(`Подключено к комнате #${roomId}`)
        socket.emit('setRoomNumber', roomId)
        socket.broadcast.emit('newMessage', {
          author: 'admin',
          text: `Игрок ${oldNote.name} подключён к комнате ${roomId}!`
        })
      })
    }
  })

  socket.on('createRoom', () => {
    let oldNote = connectedNames.find(element => element.id === socket.id)
    if (oldNote !== undefined) {
      oldNote.roomId = roomNumb
      console.log('Подключенные имена:')
      console.log(connectedNames)
      socket.join(roomNumb, () => {
        // console.log(oldNote.roomId);
        console.log(`Создана комната #${roomNumb}`)
        socket.emit('setRoomNumber', roomNumb)
        roomNumb++
      })
      // СОЗДАТЬ ОБЩИЙ СТЕЙТ КОМНАТЫ
    }
  })

  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket.id), 1)
    let old = connectedNames.findIndex(element => element.id === socket.id)
    console.log(old);
    if (connectedNames[old].roomId !== -1) {
      socket.broadcast.emit('newMessage', {
        author: 'admin',
        text: `Игрок ${connectedNames[old].name} вышел с сервера!`
      })
    }
    connectedNames.splice(old, 1)
    console.log('Подключения:')
    console.log(connections)
    console.log('Подключенные имена:')
    console.log(connectedNames)
  })
})
