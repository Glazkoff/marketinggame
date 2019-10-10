import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamerName: '',
    isOwner: false,
    roomId: -1,
    roomParams: {
      month: 3
    },
    connections: [],
    messages: [{
      id: 1,
      avatar: 'http://',
      name: 'Никита',
      text: 'Привет, ребят! Жесть, здесь так много текста!'
    }]
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
    SOCKET_setRoomNumber(state, roomId) {
      state.roomId = roomId
    },
    SOCKET_addMessage(state, newMessage) {
      state.messages.push(newMessage)
    }

  },
  actions: {

  }
})
