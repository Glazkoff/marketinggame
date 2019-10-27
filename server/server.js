const express = require('express');
const app = express();
// server.listen(process.env.PORT || 3000);
const server = app
  .use((req, res) => res.sendFile(INDEX))
  .listen(process.env.PORT || 3001, () => {
    console.log('server running on port 3001');
  });

const io = require('socket.io')(server);
let connections = [];
let connectedNames = [];
// let rooms = [];
let roomsState = [];
let roomNumb = 10;
let cards = [{
    id: 1,
    title: 'Нанять SMM-менеджера',
    text: 'Описание карточки, описание карточки',
    change: 'money',
    params: 100
  },
  {
    id: 2,
    title: 'Заказать SEO-оптимизацию',
    text: 'Описание карточки, описание карточки',
    change: 'money',
    params: 200
  },
  {
    id: 3,
    title: 'Улучшение юзабилити',
    text: 'Описание карточки, описание карточки',
    change: 'money',
    params: -300
  },
  {
    id: 4,
    title: 'Реклама в соцсетях',
    text: 'Описание карточки, описание карточки',
    change: 'money',
    params: -400
  },
  {
    id: 5,
    title: 'PR-компания компании',
    text: 'Описание карточки, описание карточки',
    change: 'money',
    params: 500
  }
];
io.on('connection', function (socket) {
  connections.push(socket.id);
  console.log('Подключения:');
  console.log(connections);

  socket.on('setName', name => {
    socket.name = name;
    let oldNote = connectedNames.find(element => element.id === socket.id);
    if (oldNote === undefined) {
      let person = {
        name,
        id: socket.id,
        roomId: -1
      };
      connectedNames.push(person);
    } else {
      oldNote.name = name;
      console.log(name + ' изменено!');
    }
    console.log(connectedNames);
  });
  socket.on('newMessage', message => {
    socket.broadcast.to(socket.roomId).emit('addMessage', {
      name: socket.name,
      text: `${message}`
    });
  });
  socket.on('setRoom', roomId => {
    // СДЕЛАТЬ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ КОМНАТЫ
    let oldNote = connectedNames.find(element => element.id === socket.id);
    if (oldNote !== undefined) {
      oldNote.roomId = roomId;
      socket.join(roomId, () => {
        console.log(`Подключено к комнате #${roomId}`);
        console.log('Подключенные имена:');
        console.log(connectedNames);
        socket.roomId = roomId;
        socket.emit('setRoomNumber', roomId);
        socket.to(roomId).broadcast.emit('addMessage', {
          name: 'Admin',
          text: `Игрок ${oldNote.name} подключён к комнате ${roomId}!`
        });
        socket.emit('addMessage', {
          name: 'Admin',
          text: `Игрок ${oldNote.name} подключён к комнате ${roomId}!`
        });
      });
    }
  });

  socket.on('createRoom', () => {
    let oldNote = connectedNames.find(element => element.id === socket.id);
    if (oldNote !== undefined) {
      oldNote.roomId = roomNumb;
      console.log('Подключенные имена:');
      console.log(connectedNames);
      socket.roomId = roomNumb;
      socket.join(roomNumb, () => {
        // console.log(oldNote.roomId);
        console.log(`Создана комната #${roomNumb}`);
        socket.emit('setRoomNumber', roomNumb);
        roomNumb++;
      });
      // СОЗДАТЬ ОБЩИЙ СТЕЙТ КОМНАТЫ
    }
  });

  socket.on('startGame', obj => {
    let roomState = {};

    roomState.roomId = socket.roomId;
    roomState.roomState = obj;
    let gamerNames = [];
    if (io.sockets.adapter.rooms[socket.roomId] !== undefined) {
      console.log('Комнаты:');
      console.log(io.sockets.adapter.rooms[socket.roomId].sockets);
      let gamerIds = Object.keys(
        io.sockets.adapter.rooms[socket.roomId].sockets
      );
      let gamers = [];
      let attackers = 0;
      for (const id of gamerIds) {
        gamerNames.push({
          name: connectedNames.find(el => el.id === id).name,
          id,
          isattacker: false
        })
        attackers++;
        console.log(id + '---');
        let gamerObj = {
          id,
          data: Object.assign({}, obj)
        };
        gamers.push(gamerObj);
      }
      roomState.constAttackers = attackers;
      roomState.attackers = attackers;
      roomState.gamers = gamers;
      roomsState.push(roomState);
    }

    console.log('Стейт комнат: ');
    console.log(roomsState);
    let gamerNamesObj = {
      gamers: gamerNames
    };
    io.sockets.to(socket.roomId).emit('setGamers', gamerNamesObj);
    socket.to(socket.roomId).broadcast.emit('setStartGame', obj);
  });

  // socket.on('typing', function () {
  //   socket.to(socket.roomId).broadcast.emit('addMessage');
  // });

  socket.on('doStep', function (cardId) {
    console.log('Сделан шаг "' + cards.find(el => el.id === cardId).title + '" игроком ' + socket.name)
    let card = cards.find(el => el.id === cardId);
    let room = roomsState.find(el => el.roomId === socket.roomId)
    let gamer = room.gamers.find(el => el.id === socket.id)
    gamer.data[card.change] = card.params + gamer.data[card.change]
    io.sockets.to(socket.roomId).emit('changeGamerStatus', socket.id)
    room.attackers--
    let gamers = roomsState.find(el => el.roomId === socket.roomId).gamers
    console.log('Игроки без хода: ' + room.attackers)
    if (room.attackers === 0) {
      setTimeout(() => {
        for (const gamer of gamers) {
          io.sockets.to(gamer.id).emit('setStartGame', gamer.data);
        }
        socket.emit('doNextStep')
        io.sockets.to(socket.roomId).emit('doNextStep')
        room.attackers = room.constAttackers
        room.roomState.month--
        if (room.roomState.month === 0) {

          io.sockets.to(room.roomId).emit('addMessage', {
            name: 'Admin',
            text: `Финито ля комедиа!`
          });
        }
      }, 2000);
    }
  })
  socket.on('leaveRoom', function () {
    console.log(`${socket.name} уходит с комнаты!`);
    let oldNote = connectedNames.find(element => element.id === socket.id);
    if (oldNote !== undefined) {
      oldNote.roomId = -1;
      socket.emit('setRoomNumber', -1);
    }
    console.log('Подключенные имена:');
    console.log(connectedNames);
  });
  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket.id), 1);
    let oldNote = connectedNames.findIndex(element => element.id === socket.id);
    if (oldNote !== -1) {
      // console.log();
      if (connectedNames[oldNote].roomId !== -1) {
        io.sockets.to(socket.roomId).emit('addMessage', {
          name: 'Admin',
          text: `Игрок ${connectedNames[oldNote].name} вышел из игры!`
        });
      }
    }
    connectedNames.splice(oldNote, 1);
    console.log('Подключения:');
    console.log(connections);
    console.log('Подключенные имена:');
    console.log(connectedNames);
  });
});
