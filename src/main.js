import Vue from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'

import iocli from 'socket.io-client'
let socket = iocli();
// import VueSocketIO from 'vue-socket.io'

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'http://localhost:5001',
//   vuex: {
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   },
//   options: {
//     path: "/my-app/"
//   } //Optional options
// }))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
