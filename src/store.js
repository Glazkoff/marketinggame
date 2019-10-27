import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamerName: '',
    socketId: '',
    isOwner: false,
    isStart: true,
    isFinish: false,
    stepDone: false,
    roomId: -1,
    roomParams: {
      month: 3,
      money: 100000
    },
    connections: [],
    messages: [],
    gamers: [],
    winners: {}
  },
  getters: {

  },
  mutations: {
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
      state.roomParams = {
        month
      }
    },
    doStep(state) {
      state.stepDone = true
    },
    SOCKET_doNextStep(state) {
      state.stepDone = false
      for (const gamer of state.gamers) {
        gamer.isattacker = false;
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
      state.isStart = false
      state.roomParams = roomParams
    },
    SOCKET_setGamers(state, obj) {
      state.gamers = [...obj.gamers]
    },
    SOCKET_changeGamerStatus(state, id) {
      for (const gamer of state.gamers) {
        if (gamer.id == id) {
          gamer.isattacker = true;
          break;
        }
      }
    },
    SOCKET_finish(state, winnersObj) {
      state.isFinish = true;
      state.winners = Object.assign(winnersObj);
    }
  },
  actions: {

  }
})
