<template>
  <div id="app">
    <Offline
      @detected-condition="amIOnline"
      online-class="online"
      offline-class="offline"
    >
      <template v-slot:[onlineSlot] :slot-name="onlineSlot">
        <div class="centered-content text-center">
          <img src="./assets/cloud-off.svg" alt="" height="96" width="96" />
          <h1 class="text-light">Офлайн!</h1>
          <h3 class="text-light">
            Дождитесь, когда у вас снова будет доступ в интернет
          </h3>
        </div>
      </template>
      <!-- <template v-slot:[offlineSlot] :slot-name="offlineSlot">
        <div class="container-fluid">
          <div class="row">
            <h1>Офлайн!</h1>
          </div>
        </div>
        ( Online: {{ onLine }} )
      </template> -->
    </Offline>
    <SocketStatus></SocketStatus>
    <Toasts></Toasts>
    <!-- <button
      class="admin-btn"
      @click="changeAdminNav"
      title="Доступ администратора"
      :disabled="!isAdmin"
    >
      <span v-if="!adminNav">↓</span>
      <span v-else>↑</span>
    </button> -->
    <div id="nav" :class="{ 'admin-show': adminNav, 'admin-hide': !adminNav }">
      <router-link to="/">Вход</router-link>|
      <router-link to="/choose">Создать игру</router-link>|
      <router-link to="/main">Главный экран</router-link>|
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
import SocketStatus from "./components/SocketStatus.vue";
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
    SocketStatus,
    Offline
  },
  sockets: {
    connect: function(connections) {
      this.$store.state.socketId = this.$socket.id;
      console.log(this.$socket.id);
      console.log("Socket connected");
      let token = this.$store.state.token;
      this.$socket.emit("authenticate", { token });
    },
    authenticated: function() {
      console.log("ПОДКЛЮЧЕНО!");
    },
    unauthorized: function(error) {
      console.error("НЕ АВТОРИЗОВАН!");
      if (
        error.data.type === "UnauthorizedError" ||
        error.data.code === "invalid_token"
      ) {
        // TODO: Пушить роутер на страницу авторизации, если другой путь
        console.error("Плохой токен");
        // this.$router.push("Home");
      }
    },
    error: function(err) {
      console.log("SOCKET IO ERROR: ", err);
    },
    success: function(data) {
      console.log("SOCKET IO SUCCESS: ", data);
    },
    setToast: function(toast) {
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
      // this.$socket.emit("setName", name);
      this.$store.commit("SET_NAME", name);
      // console.log("setStateFromLS");
      // this.$store.commit("setStateFromLS");
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
    }
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
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.response) {
          console.log(err.response);
        }
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // Если ошибка авторизации на сервере, выкинуть пользователя
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
        throw err;
      });
    });
  }
};
</script>
<style>
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
  overflow-y: hidden;
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
  height: calc(100vh - 00px) !important;
  max-height: calc(100vh - 00px) !important;
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
</style>
