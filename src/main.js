import Vue from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import VueNumber from 'vue-number-animation'
Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://marketing-game.herokuapp.com/',
  // connection: 'http://localhost:3001',
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.use(VueNumber)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
