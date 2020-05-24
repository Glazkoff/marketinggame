<template>
  <div id="app">
    <button
      class="admin-btn"
      @click="changeAdminNav"
      title="Доступ администратора"
      :disabled="!isAdmin"
    >
      <span v-if="!adminNav">↓</span>
      <span v-else>↑</span>
    </button>
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
export default {
  data() {
    return {
      user: "",
      message: "",
      messages: []
    };
  },
  sockets: {
    connect: function(connections) {
      this.$store.state.socketId = this.$socket.id;
      console.log(this.$socket.id);
      console.log("Socket connected");
    }
  },
  beforeCreate() {
    console.log("setStateFromLS");
    this.$store.commit("setStateFromLS");
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
  },
  methods: {
    changeAdminNav() {
      this.$store.commit("changeAdminNav");
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
  /* position: absolute; */
  position: fixed;
  /* bottom: -30px; */
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
</style>
