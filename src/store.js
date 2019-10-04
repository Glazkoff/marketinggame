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
    connections: []
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
    }

  },
  actions: {

  }
})
