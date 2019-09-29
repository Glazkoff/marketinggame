import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gamerName: '',
    isOwner: false
  },
  getters: {

  },
  mutations: {
    setName(state, name) {
      state.gamerName = name;
    },
    setOwner(state) {
      state.isOwner = true;
    }
  },
  actions: {

  }
})
