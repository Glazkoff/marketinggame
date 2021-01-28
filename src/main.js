import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import VueSocketIO from "vue-socket.io";
import VueNumber from "vue-number-animation";
import Vuelidate from "vuelidate";
import axios from "axios";
import VueBootstrapToasts from "vue-bootstrap-toasts";

Vue.config.productionTip = false;

Vue.use(VueBootstrapToasts);

Vue.use(Vuelidate);

Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV !== "production",
    connection: '/',
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    },
    options: {
      query: {
        token: `${localStorage.getItem("user-token")}`
      }
    }
  })
);

Vue.use(VueNumber);

Vue.prototype.$http = axios;
const token = localStorage.getItem("user-token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}
axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response !== undefined) {
      if (error.response.status === 401) {
        console.log("Неавторизован ...");
        localStorage.removeItem("user-token");
        router.push("login");
      }
    }
    return Promise.reject(error.response);
  }
);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
