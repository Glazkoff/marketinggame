import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ownerName: ''
  },
  getters: {

  },
  mutations: {
    setName(state, name) {
      state.ownerName = name;
    }
  },
  actions: {

  }
})
