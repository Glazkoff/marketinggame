const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
let port = process.env.PORT || 3001

// server.listen(process.env.PORT || 3000);
const server = app
  .use('/', serveStatic(path.join(__dirname, '../dist')))
  .listen(port, () => {
    console.log(`server running on port ${port}`)
  })
  app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
  
// app.use('/', serveStatic(path.join(__dirname, '/dist')))
const io = require('socket.io')(server)
let connections = []
let connectedNames = []
// let rooms = [];
let roomsState = []
let roomNumb = 10
let events = [{
  id: 1,
  title: 'Выход на рынок нового конкурента',
  description: 'Снижение всех видов трафика на 30%',
  dataChange: [{
    param: 'organicCount',
    operation: '*',
    change: 0.7,
    when: 0
  },
  {
    param: 'socialsCount',
    operation: '*',
    change: 0.7,
    when: 0
  },
  {
    param: 'smmCount',
    operation: '*',
    change: 0.7,
    when: 0
  },
  {
    param: 'straightCount',
    operation: '*',
    change: 0.7,
    when: 0
  }
  ]
},
{
  id: 2,
  title: 'Изменение алгоритма поисковой машины',
  description: 'Падение трафика из органической выдачи в первый месяц после изменения на 50% восстановление трафика к 3-му месяцу на уровень первого месяца',
  dataChange: [{
    param: 'organicCount',
    operation: '*',
    change: 0.5,
    when: 0
  },
  {
    param: 'organicCount',
    operation: '*',
    change: 2,
    when: 2
  }
  ]
},
{
  id: 3,
  title: 'Изменение подрядчика по контекстной рекламе',
  description: 'Увеличение реальной стоимости привлечения клиента на 5%, увеличение конверсии от контекстной рекламы на 30%',
  dataChange: [{
    param: 'realCostAttract',
    operation: '*',
    change: 1.05,
    when: 0
  },
  {
    param: 'contextCoef',
    operation: '*',
    change: 1.3,
    when: 0
  }
  ]
},
{
  id: 4,
  title: 'Ввод в эксплуатацию нового офисного здания рядом',
  description: 'Увеличение трафика от канала прямого захода в первый месяц после этого в 3 раза и после этого во второй месяц увеличение конверсии в клиента на 5%',
  dataChange: [{
    param: 'straightCount',
    operation: '*',
    change: 3,
    when: 1
  },
  {
    param: 'conversion',
    operation: '*',
    change: 1.05,
    when: 2
  }
  ]
},
{
  id: 5,
  title: 'Появление серии негативных публикаций о компании и руководителе компании',
  description: 'Снижение конверсии трафика в звонки на 50%',
  dataChange: [{
    param: 'conversion',
    operation: '*',
    change: 0.5,
    when: 0
  }]
}
]
let cards = [{
  id: 1,
  title: 'Нанять SMM-менеджера',
  text: 'Описание карточки, описание карточки',
  // change: "money",
  // params: 100,
  cost: 55000,
  duration: 3,
  dataChange: [{
    param: 'smmCount',
    operation: '*',
    change: 1.1,
    when: 2,
    from: 'Нанять SMM-менеджера 2',
    id: 1
  },
  {
    param: 'smmCount',
    operation: '*',
    change: 1.8,
    when: 3,
    from: 'Нанять SMM-менеджера 3',
    id: 1
  },
  {
    param: 'socialsCoef',
    operation: '*',
    change: 1.5,
    when: 3,
    from: 'Нанять SMM-менеджера 3',
    id: 1
  },
  {
    param: 'money',
    operation: '-',
    change: 80000,
    when: 1,
    from: 'Нанять SMM-менеджера 1',
    id: 1
  },
  {
    param: 'money',
    operation: '-',
    change: 80000,
    when: 2,
    from: 'Нанять SMM-менеджера 2',
    id: 1
  },
  {
    param: 'money',
    operation: '-',
    change: 80000,
    when: 3,
    from: 'Нанять SMM-менеджера 3',
    id: 1
  }
  ]
},
{
  id: 2,
  title: 'Заказать SEO-оптимизацию',
  text: 'Описание карточки, описание карточки',
  // change: "money",
  // params: 200,
  cost: 50000,
  duration: 3,
  dataChange: [{
    param: 'organicCount',
    operation: '*',
    change: 2,
    when: 3,
    from: 'Заказать SEO-оптимизацию 3',
    id: 2
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.5,
    when: 1,
    from: 'Заказать SEO-оптимизацию 1',
    id: 2
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 0.3,
    when: 3,
    from: 'Заказать SEO-оптимизацию 3',
    id: 2
  }
  ]
},
{
  id: 3,
  title: 'Улучшение юзабилити',
  text: 'Описание карточки, описание карточки',
  cost: 20000,
  // change: "money",
  // params: -300,
  duration: 3,
  dataChange: [{
    param: 'organicCoef',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'contextCoef',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'socialsCoef',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'smmCoef',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'straightCoef',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'averageCheck',
    operation: '*',
    change: 1.5,
    when: 3,
    from: 'Улучшение юзабилити 3',
    id: 3
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 0.8,
    when: 1,
    from: 'Улучшение юзабилити 1',
    id: 3
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 0.8,
    when: 2,
    from: 'Улучшение юзабилити 2',
    id: 3
  }
  ]
},
{
  id: 4,
  title: 'Реклама в соцсетях',
  text: 'Описание карточки, описание карточки',
  cost: 25000,
  // change: "money",
  // params: -400,
  duration: 3,
  dataChange: [{
    param: 'socialsCount',
    operation: '+',
    change: 4500,
    when: 1,
    from: 'Реклама в соцсетях 1',
    id: 4
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.1,
    when: 1,
    from: 'Реклама в соцсетях 1',
    id: 4
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.1,
    when: 2,
    from: 'Реклама в соцсетях 2',
    id: 4
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.1,
    when: 3,
    from: 'Реклама в соцсетях 3',
    id: 4
  }
  ]
},
{
  id: 5,
  title: 'PR-компания компании',
  text: 'Описание карточки, описание карточки',
  // change: "money",
  // params: 500,
  cost: 30000,
  duration: 3,
  dataChange: [{
    param: 'realCostAttract',
    operation: '*',
    change: 1.3,
    when: 1,
    from: 'PR-компания компании 1',
    id: 5
  },
  {
    param: 'averageCheck',
    operation: '*',
    change: 1.1,
    when: 2,
    from: 'PR-компания компании 2',
    id: 5
  },
  {
    param: 'averageCheck',
    operation: '*',
    change: 1.2,
    when: 3,
    from: 'PR-компания компании 3',
    id: 5
  }
  ]
},
{
  id: 6,
  title: 'Контекстная рекламная компания',
  text: 'Описание карточки, описание карточки',
  // change: "money",
  // params: 500,
  cost: 35000,
  duration: 3,
  dataChange: [{
    param: 'contextCount',
    operation: '+',
    change: 6000,
    when: 1,
    from: 'Контекстная рекламная компания 1',
    id: 6
  },
  {
    param: 'contextCount',
    operation: '*',
    change: 1.1,
    when: 2,
    from: 'Контекстная рекламная компания 2',
    id: 6
  },
  {
    param: 'contextCount',
    operation: '*',
    change: 1.2,
    when: 3,
    from: 'Контекстная рекламная компания 3',
    id: 6
  },
  {
    param: 'contextCoef',
    operation: '*',
    change: 1.5,
    when: 1,
    from: 'Контекстная рекламная компания 1',
    id: 6
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.3,
    when: 1,
    from: 'Контекстная рекламная компания 1',
    id: 6
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.3,
    when: 2,
    from: 'Контекстная рекламная компания 2',
    id: 6
  },
  {
    param: 'realCostAttract',
    operation: '*',
    change: 1.3,
    when: 3,
    from: 'Контекстная рекламная компания 3',
    id: 6
  }
  ]
},
{
  id: 7,
  title: 'Размещение информации о компании в справочниках',
  text: 'Описание карточки, описание карточки',
  // change: "money",
  // params: 500,
  cost: 20000,
  duration: 3,
  dataChange: [{
    param: 'straightCount',
    operation: '*',
    change: 1.2,
    when: 1,
    from: 'Размещение информации о компании в справочниках 1',
    id: 7
  },
  {
    param: 'straightCount',
    operation: '*',
    change: 1.2,
    when: 2,
    from: 'Размещение информации о компании в справочниках 2',
    id: 7
  },
  {
    param: 'straightCount',
    operation: '*',
    change: 1.2,
    when: 3,
    from: 'Размещение информации о компании в справочниках 3',
    id: 7
  },
  {
    param: 'money',
    operation: '-',
    change: 40000,
    when: 1,
    from: 'Размещение информации о компании в справочниках 1',
    id: 7
  }
  ]
}
]
io.on('connection', function (socket) {
  connections.push(socket.id)
  console.log('Подключения:')
  console.log(connections)

  socket.on('setName', name => {
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
  socket.on('newMessage', message => {
    socket.broadcast.to(socket.roomId).emit('addMessage', {
      name: socket.name,
      text: `${message}`
    })
  })
  socket.on('setRoom', roomId => {
    // СДЕЛАТЬ ПРОВЕРКУ НА СУЩЕСТВОВАНИЕ КОМНАТЫ
    let oldNote = connectedNames.find(element => element.id === socket.id)
    if (oldNote !== undefined) {
      oldNote.roomId = roomId
      socket.join(roomId, () => {
        console.log(`Подключено к комнате #${roomId}`)
        console.log('Подключенные имена:')
        console.log(connectedNames)
        socket.roomId = roomId
        socket.emit('setRoomNumber', roomId)
        io.sockets.to(roomId).emit('addMessage', {
          name: 'Admin',
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
      socket.roomId = roomNumb
      socket.join(roomNumb, () => {
        // console.log(oldNote.roomId);
        console.log(`Создана комната #${roomNumb}`)
        socket.emit('setRoomNumber', roomNumb)
        roomNumb++
      })
    }
  })

  socket.on('startGame', obj => {
    console.log('Приём')
    console.log(Object.assign(obj))
    let roomState = {}
    roomState.roomId = socket.roomId
    roomState.roomState = obj
    let gamerNames = []
    if (io.sockets.adapter.rooms[socket.roomId] !== undefined) {
      console.log('Комнаты:')
      console.log(io.sockets.adapter.rooms[socket.roomId].sockets)
      let gamerIds = Object.keys(
        io.sockets.adapter.rooms[socket.roomId].sockets
      )
      let gamers = []
      let attackers = 0
      for (const id of gamerIds) {
        let findName;
        let nameFromConnected = connectedNames.find(el => el.id === id)
        if (nameFromConnected !== undefined) {
          findName = nameFromConnected.name
          gamerNames.push({
            name: findName,
            id,
            isattacker: false
          })
        }
        
        attackers++
        console.log(id + '---')

        let gamerObj = {
          id,
          data: Object.assign({}, obj),
          changes: [],
          effects: []
        }
        console.log('!!!!')
        console.log(gamerObj.data)

        gamers.push(gamerObj)
      }
      roomState.constAttackers = attackers
      roomState.attackers = attackers
      roomState.gamers = gamers
      roomState.budgetPerMonth = obj.money
      roomsState.push(roomState)
    }

    console.log('Стейт комнат: ')
    console.log(roomsState)
    let gamerNamesObj = {
      gamers: gamerNames
    }
    // obj.message = "smth";
    io.sockets.to(socket.roomId).emit('setGamers', gamerNamesObj)
    socket.to(socket.roomId).broadcast.emit('setStartGame', obj)
    // for (const id of gamerIds) {

    // socket.to(socket.roomId).broadcast.emit("calcAllParams");

    // }
  })

  // socket.on('typing', function () {
  //   socket.to(socket.roomId).broadcast.emit('addMessage');
  // });

  socket.on('doStep', function (cardArr) {
    // если room.gamers!==undefined
    // Поиск комнаты
    let room = roomsState.find(el => el.roomId === socket.roomId)
    // Поиск игрока
    let gamer
    if (room !== undefined) {
      gamer = room.gamers.find(el => el.id === socket.id)
    }
    let card
    // Начало обработки пришедшего массива с ID карточек
    if (cardArr.length !== 0) {
      for (const effect of gamer.effects) {
        // Если в пришедшем массиве нет уже существующего эффекта
        if (effect.step === effect.duration) {
          let effectIndex = gamer.effects.findIndex(elem => elem.id === effect.id)
          gamer.effects.splice(effectIndex, 1)
          console.log('Действие эффекта закончилось')
        } else {
          let cardArrIndex = cardArr.findIndex(elem => elem === effect.id)
          if (cardArrIndex === -1) {
            let effectIndex = gamer.effects.findIndex(elem => elem.id === effect.id)
            gamer.effects.splice(effectIndex, 1)
          }
        }
      }
      for (const cardId of cardArr) {
        console.log('------------------------------------')
        console.log(
          'Сделан шаг "' +
        cards.find(el => el.id === cardId).title +
        '" игроком ' +
        socket.name
        )
        card = cards.find(el => el.id === cardId)
        // ИЗМЕНЕНИЕ КАРТОЧКИ
        console.log('Массив карточек')
        gamer.data.money -= card.cost

        // Если эффекта ещё нет (карточка выбрасывается первый раз)
        let effectIndex = gamer.effects.findIndex(elem => elem.id === cardId)
        if ((cardId !== 3) && (cardId !== 7)) {
          if (effectIndex === -1) {
            // Занести свойства ещё не выброшенной серии
            for (const changes of card.dataChange) {
              gamer.changes.push(changes)
            }
            let effectObj = {
              id: cardId,
              name: card.title,
              step: 1,
              duration: card.duration
            }
            gamer.effects.push(effectObj)
          } else {
          // Если эффект существует в массиве
            gamer.effects[effectIndex].step++
          }
        } else {
          if (effectIndex === -1) {
            // Занести свойства одноразовых карточек
            for (const changes of card.dataChange) {
              gamer.changes.push(changes)
            }
          }
        }

        console.log('-------------------------------------')
        // ------------------------
        let clients =
        (gamer.data.organicCount * gamer.data.organicCoef +
          gamer.data.contextCount * gamer.data.contextCoef +
          gamer.data.socialsCount * gamer.data.socialsCoef +
          gamer.data.smmCount * gamer.data.smmCoef +
          gamer.data.straightCount * gamer.data.straightCoef) *
        gamer.data.conversion
        gamer.data.clients = Math.ceil(clients)
        console.log('Клиенты:')
        console.log(clients)
        let averageCheck = gamer.data.averageCheck

        let realCostAttract = gamer.data.realCostAttract
        // let marginalCost = gamer.data.marginalCost

        let commCircul = clients * averageCheck
        gamer.data.commCircul = commCircul
        let expenses = clients * realCostAttract
        gamer.data.expenses = expenses
        let result = commCircul - expenses
        // gamer.data.money = gamer.data.money + Math.ceil(result);
        gamer.data.money += room.budgetPerMonth
        console.log('Обновлён параметр money со знаком + на ' + Math.ceil(result))
        let resultPerClient = result / clients
        gamer.data.moneyPerClient = Math.ceil(resultPerClient)
      } // Конец цикла обработки пришедших карт
    } else {
      // FIX: Просто добавить деньги
      // gamer.data.money += room.budgetPerMonth
    }
    let iter = 0
    

    for (const changing of gamer.changes) {
      let indexEffArr = gamer.effects.findIndex(elem => elem.id === changing.id)
      console.log('Для ID изменения ' + changing.id + ' индекс в м.эфф. равен ' + indexEffArr)
      if ((indexEffArr === -1)) {
        for (let index = 0; index < gamer.changes.length; index++) {
          if (gamer.changes[index].id === changing.id) {
            console.log('УДАЛЯЕТСЯ параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change + ' (' + changing.from + ')')
            console.log('----!----')
            console.log(gamer.changes[index])
            console.log('---- ----')
            gamer.changes.splice(index, 1)
          }
        }
      }
      if ((changing.when === 1)) {
        if ((gamer.effects.findIndex(elem => elem.id === changing.id) !== -1) || (changing.id === 3) || (changing.id === 7)) {
          switch (changing.operation) {
            case '+':
              gamer.data[changing.param] += changing.change
              break
            case '-':
              gamer.data[changing.param] -= changing.change
              break
            case '*':
              gamer.data[changing.param] *= changing.change
              break
            default:
              console.log('Что-то не так с операцией карточки по ID ' + card.id)
              break
          }
          console.log('Обновлён параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change + ' (' + changing.from + ')')
        } else {
          console.log('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
          for (let index = 0; index < gamer.changes.length; index++) {
            if (gamer.changes[index].id === changing.id) {
              console.log('УДАЛЁН параметр ' + changing.param + ' со знаком ' + changing.operation + ' на ' + changing.change)
              gamer.changes.splice(index, 1)
            }
          }
        }
        gamer.changes.splice(iter, 1)
      } else {
        iter++
      }
    }
    console.log('ИЗМЕНЕНИЯ ИГРОКА')
    console.log(gamer.changes)
    // Конец обработки пришедшего массива

    let gamers = roomsState.find(el => el.roomId === socket.roomId).gamers
    console.log('~~~~~gamers~~~~~~')
    console.log(gamers)
    io.sockets.to(socket.roomId).emit('changeGamerStatus', socket.id)
    room.attackers--
    console.log('Игроки без хода: ' + room.attackers)
    if (room.attackers === 0) {
      console.log('Обновление данных для ВСЕХ')
      setTimeout(() => {
        for (const gamer of gamers) {
          io.sockets.to(gamer.id).emit('setStartGame', gamer.data)
        }
        socket.emit('doNextStep')
        io.sockets.to(socket.roomId).emit('doNextStep')
        room.attackers = room.constAttackers
        //! !!!!!!!

        //! !!!
      }, 2000)
    }
    // СЮДА

    for (const changing of gamer.changes) {
      if (changing.when !== 1) {
        changing.when--
      }
    }
    
    room.roomState.month--
    console.log('Месяц:')
    console.log(gamer.data.month)
    gamer.data.month = gamer.data.month - 1
    if (room.roomState.month === 0) {
      for (const gamer of gamers) {
        io.sockets.to(gamer.id).emit('setStartGame', gamer.data)
      }
      let gamersRate = []
      for (const gamer of gamers) {
        let position = {
          id: gamer.id,
          money: gamer.data.money
        }
        gamersRate.push(position)
      }
      gamersRate.sort((a, b) => {
        if (a.money > b.money) {
          return -1
        } else if (a.money < b.money) {
          return 1
        }
        return 0
      })
      console.log('Рейтинг игроков:')
      console.log(gamersRate)
      let winners = {}
      for (let index = 1; index < 4; index++) {
        let a = gamersRate.shift()
        if (typeof a !== 'undefined') {
          winners[index] = Object.assign(a)
          winners[index].name = connectedNames.find(
            el => el.id === a.id
          ).name
        } else winners[index] = a
        // console.log(gamersRate.shift());
        // console.log(winners[index]);
        // let gamer = Object.assign(winners[index])
        // winners[index].name = connectedNames.find(el => el.id === gamer.id).name
      }
      console.log(winners)
      io.sockets.to(room.roomId).emit('addMessage', {
        name: 'Admin',
        text: `Финито ля комедиа!`
      })

      io.sockets.to(room.roomId).emit('finish', winners)
    } else {
      if (Math.floor(Math.random() * 10) % 2 === 0) {
        let randomEvent = events[Math.floor(Math.random() * events.length)]
        console.log('Событие')
        console.log(randomEvent)
        for (const eventChange of randomEvent.dataChange) {
          if (eventChange.when === 0) {
            for (const gamer of gamers) {
              switch (eventChange.operation) {
                case '+':
                  gamer.data[eventChange.param] += eventChange.change
                  break
                case '-':
                  gamer.data[eventChange.param] -= eventChange.change
                  break
                case '*':
                  gamer.data[eventChange.param] *= eventChange.change
                  break
                default:
                  console.log('Что-то не так с событием ' + card.id)
                  break
              }
            }
            console.log('Событием изменен параметр ' + eventChange.param + ' со знаком ' + eventChange.operation + ' на ' + eventChange.change)
          } else {
            for (const gamer of gamers) {
              gamer.changes.push(eventChange)
            }
          }
        }
        socket.emit('gameEvent')
        io.sockets.to(room.roomId).emit('gameEvent', randomEvent)
      }
    }
    console.log('---ДАННЫЕ ИГРОКА---')
    console.log(gamer.data)
    for (const gamer of gamers) {
      io.sockets.to(gamer.id).emit('setEffects', gamer.effects)
    }
  })
  socket.on('leaveRoom', function () {
    console.log(`${socket.name} уходит с комнаты!`)
    let oldNote = connectedNames.find(element => element.id === socket.id)
    if (oldNote !== undefined) {
      oldNote.roomId = -1
      socket.emit('setRoomNumber', -1)
    }
    console.log('Подключенные имена:')
    console.log(connectedNames)
  })
  socket.on('disconnect', function () {
    connections.splice(connections.indexOf(socket.id), 1)
    let oldNote = connectedNames.findIndex(element => element.id === socket.id)
    if (oldNote !== -1) {
      // console.log();
      if (connectedNames[oldNote].roomId !== -1) {
        io.sockets.to(socket.roomId).emit('addMessage', {
          name: 'Admin',
          text: `Игрок ${connectedNames[oldNote].name} вышел из игры!`
        })
      }
    }
    connectedNames.splice(oldNote, 1)
    console.log('Подключения:')
    console.log(connections)
    console.log('Подключенные имена:')
    console.log(connectedNames)
  })
})
