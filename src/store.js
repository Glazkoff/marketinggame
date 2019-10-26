import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamerName: '',
    isOwner: false,
    isStart: true,
    stepDone: false,
    roomId: -1,
    roomParams: {
      month: 3,
      money: 100000
    },
    connections: [],
    messages: []
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
    }

  },
  actions: {

  }
})
