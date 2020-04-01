import Vue from 'vue'
import Vuex from 'vuex'
import router from '../src/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamerName: '',
    socketId: '',
    isAdmin: false,
    adminNav: false,
    isOwner: false,
    isStart: true,
    isFinish: false,
    stepDone: false,
    havePrevData: false,
    roomId: -1,
    prevRoomParams: {},
    roomParams: {},
    firstRoomParams: {
      first: true,
      preset: true,
      month: 3,
      money: 150000,
      organicCount: 7500,
      contextCount: 9500,
      socialsCount: 1500,
      smmCount: 1200,
      straightCount: 300,
      organicCoef: 0.1,
      contextCoef: 0.07,
      socialsCoef: 0.25,
      smmCoef: 0.05,
      straightCoef: 0.1,
      conversion: 0.3,
      averageCheck: 6500,
      realCostAttract: 2500,
      marginalCost: 800
    },
    connections: [],
    messages: [],
    gamers: [],
    winners: {},
    activeEffects: [],
    steps: [],
    gameEvent: null,
    completedSessions: []
  },
  getters: {},
  mutations: {
    resetData(state) {
      console.log('RESET!')
      state.connections = []
      state.messages = []
      state.gamers = []
      state.winners = {}
      state.activeEffects = []
      state.completedSessions = []
      state.gameEvent = null
      state.isOwner = false
      state.isStart = true
      state.isFinish = false
      state.stepDone = false
      state.roomId = -1
      state.steps = []
      state.havePrevData = false
      // state.roomParams = Object.assign(state.firstRoomParams)
      state.roomParams = {}
      state.prevRoomParams = {}
      for (var key in state.firstRoomParams) {
        state.roomParams[key] = state.firstRoomParams[key]
      }
    },
    changeAdminNav(state) {
      state.adminNav = !state.adminNav
    },
    changeAdminStatus(state) {
      state.isAdmin = !state.isAdmin
    },
    addSteps(state, data) {
      let monthArr = []
      for (var val of data) {
        console.log(val)
        monthArr.push(val)
      }
      state.steps.push(monthArr)
    },
    copyData(state, data) {
      state.roomParams = {}
      for (var key in data) {
        state.roomParams[key] = data[key]
      }
    },
    doAnimation(state, data) {
      state.roomParams.money++
      state.roomParams.money--
    },
    setName(state, name) {
      state.gamerName = name
    },
    setOwner(state) {
      state.isOwner = true
    },
    // setRoomId(state, number) {
    //   state.roomId = number
    // },
    setRoomParams(state, {
      month
    }) {
      console.log('MONTH STATE', month)
      state.roomParams.month = month
    },
    doStep(state) {
      state.stepDone = true
    },
    changeMoney(state, change) {
      if (state.roomParams.money !== undefined) {
        state.roomParams.money += change
      }
    },
    SOCKET_roomNotFound() {
      router.push('/choose')
    },
    SOCKET_doNextStep(state) {
      state.stepDone = false
      for (const gamer of state.gamers) {
        gamer.isattacker = false
      }
    },
    SOCKET_setRoomNumber(state, roomId) {
      state.roomId = roomId
    },
    SOCKET_addMessage(state, newMessage) {
      state.messages.push(newMessage)
      let messList = document.querySelector('#messageField')
      if (messList !== null) {
        messList.scrollTop = messList.scrollHeight
      }
    },
    SOCKET_setStartGame(state, roomParams) {
      for (var key in state.roomParams) {
        state.prevRoomParams[key] = state.roomParams[key]
      }
      console.log('~~~~~~~PREV~~~~~~')
      console.log(state.prevRoomParams)
      if (state.isStart) {
        state.firstRoomParams.month = roomParams.month + 0
      }
      state.isStart = false
      // if (state.roomParams.month == undefined) {
      state.roomParams = roomParams
      console.log('Тут')
      console.log(state.roomParams)
      let clients = (state.roomParams.organicCount * state.roomParams.organicCoef + state.roomParams.contextCount * state.roomParams.contextCoef + state.roomParams.socialsCount * state.roomParams.socialsCoef + state.roomParams.smmCount * state.roomParams.smmCoef + state.roomParams.straightCount * state.roomParams.straightCoef) * state.roomParams.conversion
      state.roomParams.clients = Math.ceil(clients)
      console.log('Клиенты: ' + clients)
      let commCircul = clients * state.roomParams.averageCheck
      state.roomParams.commCircul = commCircul
      console.log('commCircul: ' + commCircul)
      let expenses = Math.ceil(clients * state.roomParams.realCostAttract)
      state.roomParams.expenses = expenses
      console.log('expenses: ' + expenses)
      let result = commCircul - expenses
      console.log('result: ' + result)
      let resultPerClient = result / clients
      state.roomParams.moneyPerClient = Math.ceil(resultPerClient)
      // }
      state.roomParams = roomParams
    },
    SOCKET_setGamers(state, obj) {
      state.gamers = [...obj.gamers]
      state.prevRoomParams = {}
    },
    SOCKET_changeGamerStatus(state, id) {
      for (const gamer of state.gamers) {
        if (gamer.id === id) {
          gamer.isattacker = true
          break
        }
      }
    },
    SOCKET_finish(state, winnersObj) {
      state.isFinish = true
      state.winners = Object.assign(winnersObj)
    },
    SOCKET_setGameEvent(state, eventObj) {
      state.gameEvent = {}
      state.gameEvent = Object.assign(eventObj)
    },
    SOCKET_calcAllParams(state) {
      let clients = (state.roomParams.organicCount * state.roomParams.organicCoef + state.roomParams.contextCount * state.roomParams.contextCoef + state.roomParams.socialsCount * state.roomParams.socialsCoef + state.roomParams.smmCount * state.roomParams.smmCoef + state.roomParams.straightCount * state.roomParams.straightCoef) * state.roomParams.conversion
      state.roomParams.clients = clients
      console.log('Клиенты: ' + clients)
      let commCircul = clients * state.roomParams.averageCheck
      state.roomParams.commCircul = commCircul
      console.log('commCircul: ' + commCircul)
      let expenses = clients * state.roomParams.realCostAttract
      state.roomParams.expenses = expenses
      console.log('expenses: ' + expenses)
      let result = commCircul - expenses
      console.log('result: ' + result)
      let resultPerClient = result / clients
      state.roomParams.moneyPerClient = resultPerClient
      // state.roomParams.money += result;
    },
    SOCKET_setEffects(state, effects) {
      console.log('/////////////////////////')
      console.log('/////////////////////////')
      effects.forEach(el => {
        if (el.step === el.duration) {
          state.completedSessions.push(el.id)
        }
      })
      console.log(state.completedSessions)
      console.log('/////////////////////////')
      console.log('/////////////////////////')
      state.activeEffects = [...effects]
    }
  },
  actions: {
    SOCKET_gameEvent(state, eventObj) {
      console.log(eventObj)
      state.commit('SOCKET_setGameEvent', eventObj)
      setTimeout(() => {
        state.commit('SOCKET_setGameEvent', {})
      }, 7000)
    }
    // SOCKET_setStartGame (state, roomParams) {
    //   console.log('AAAAAACTIONS');

    // }
  }
})
