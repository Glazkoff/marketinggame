<template>
  <div id="app">
    <Offline
      @detected-condition="amIOnline"
      online-class="online"
      offline-class="offline"
    >
      <template v-slot:[onlineSlot] :slot-name="onlineSlot">
        <div class="centered-content text-center">
          <img src="./assets/cloud-off.svg" alt="" height="96" width="96"/>
          <h1 class="text-light">Офлайн!</h1>
          <h3 class="text-light">
            Дождитесь, когда у вас снова будет доступ в интернет
          </h3>
        </div>
      </template>
    </Offline>
    <Toasts></Toasts>
    <div id="nav" :class="{ 'admin-show': adminNav, 'admin-hide': !adminNav }">
      <router-link to="/">Вход</router-link>
      |
      <router-link to="/choose">Создать игру</router-link>
      |
      <router-link to="/main">Главный экран</router-link>
      |
      <router-link to="/about">Об игре</router-link>
    </div>
    <div id="view" :class="{ 'full-screen': !adminNav }">
      <transition name="slide" mode="out-in" appear>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import Offline from "v-offline";
import jwt from "jsonwebtoken";

export default {
  data() {
    return {
      user: "",
      message: "",
      messages: [],
      onLine: null,
      onlineSlot: "online",
      offlineSlot: "offline"
    };
  },
  components: {
    Offline
  },
  sockets: {
    connect: function (connections) {
      this.$store.state.socketId = this.$socket.id;
      let token = this.$store.state.token;
      this.$socket.emit("authenticate", {token});
    },
    authenticated: function () {
      console.log("ПОДКЛЮЧЕНО!");
    },
    unauthorized: function (error) {
      console.error("НЕ АВТОРИЗОВАН!");
      if (
        error.data.type === "UnauthorizedError" ||
        error.data.code === "invalid_token"
      ) {
      }
    },
    setToast: function (toast) {
      switch (toast.type) {
        case "success":
          this.$toast.success(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "warning":
          this.$toast.warning(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "danger":
          this.$toast.error(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "info":
        default:
          this.$toast.info(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
      }
    },
    askIfInTheRoom() {
      if (this.$route.path === "/main" && this.$store.state.roomId !== -1) {
        this.$socket.emit("subscribeRoom", this.$store.state.roomId, true);
      }
    }
  },
  beforeCreate() {
    let decode = jwt.decode(this.$store.state.token);
    if (decode) {
      if (decode.admin) {
        this.$store.commit("SET_USER_ID", decode.id);
        this.$store.commit("changeAdminStatus");
      }
      let name = decode.name;
      this.$store.commit("SET_NAME", name);
      if (this.$store.state.gamerName) {
        this.$socket.emit("setName", this.$store.state.gamerName);
      }
      if (this.$store.state.roomId) {
        this.$socket.emit("setRoom", this.$store.state.roomId);
      }
      console.log("SEND RESRESH!");
      this.$socket.emit(
        "refreshSocketID",
        this.$store.state.socketId,
        this.$store.state.roomId
      );
    }
  },
  methods: {
    changeAdminNav() {
      this.$store.commit("changeAdminNav");
    },
    amIOnline(e) {
      this.onLine = e;
    },
  },
  computed: {
    adminNav() {
      return this.$store.state.adminNav;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    }
  },
  mounted() {
    const token = localStorage.getItem("user-token");
    if (token) {
      this.$http.defaults.headers.common["Authorization"] = token;
    }
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // Если ошибка авторизации на сервере, выкинуть пользователя
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
        throw err;
      });
    });
    history.pushState(null, null, location.href);
    window.onpopstate = function (event) {
      history.go(1);
    };
  }
};
</script>

<style>
@media screen and (max-width: 876px) {
  .full-screen {
    max-height: calc(100vh - 00px) !important;
  }
}

.centered-content {
  margin: auto;
}

.offline {
  background-color: #fc9842;
  background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
}

.online {
  display: none;
}

body {
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  height: 100vh;
}

#app {
  height: 100%;
  position: relative;
}

#nav {
  box-sizing: border-box;
  padding: 8px;
  height: 40px;

  width: 100%;
}

#view {
  height: calc(100vh - 40px);
}

.full-screen {
  height: calc(100vh - 00px);
  max-height: calc(100vh - 50px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}

.slide-leave-active {
  transform: translateX(-110%);
}

.slide-enter {
  transform: translateX(110%);
}

.rate-enter-active,
.rate-leave-active {
  transition: all 0.2s;
}

.slide-leave-active {
  transform: translateX(-110%);
}

.rate-enter {
  transform: translateX(110%);
}

.admin-btn {
  color: #fff;
  background-color: #007bff;
  border: none;
  position: fixed;
  top: 0;
  right: 0;
  height: 40px;
  box-sizing: border-box;
  padding: 5px 10px;
  font-size: 1.4rem;
  z-index: 1000;
}

.admin-btn[disabled] {
  background-color: #6bb3ff;
  visibility: hidden;
}

.admin-show {
  position: relative;
}

.admin-hide {
  position: static;
  position: fixed;
  top: -36px;
  left: 0;
}

.loader-wrap {
  width: 100%;
  display: flex;
}

.loader-wrap > * {
  margin: auto;
}

.toast-container {
  top: 2rem !important;
}

@media (max-width: 930px) {
  .toast-container {
    right: 1rem !important;
    width: calc(100vw - 2rem) !important;
    min-width: calc(100vw - 2rem) !important;
  }

  .toast {
    max-width: calc(100vw - 2rem) !important;
  }
}

/* @media screen and (max-height: 600px), (max-width: 1240px){
  body{
    overflow-y: auto;
  }
} */

.rate-container {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(255, 255, 255);
  border-right: 1px solid #6c757d;
}

.btn-rate {
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
}

.rate-raw {
  cursor: pointer;
}

.col-rate {
  flex-basis: auto;
}

.popup-screen {
  position: fixed;
  width: 100vw;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, .5);
  padding: 20% 20%;
}

.popup {
  background: rgb(255, 255, 255);
}

.popup img {
  cursor: pointer;
}

.cp {
  cursor: pointer;
}

.statics div {
  height: 6px;
}

</style>
