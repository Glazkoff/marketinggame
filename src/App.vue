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
import io from "socket.io-client";

export default {
  data() {
    return {
      user: "",
      message: "",
      messages: []
      // adminNav: false
      // socket: io("localhost:3001")
    };
  },
  sockets: {
    connect: function(connections) {
      console.log("Socket connected");
    }
    // connectList: function(connections) {
    //   console.log(connections);
    //   this.connections = connections;
    //   this.$store.commit("setConnections", connections);
    // },
    // newMessage: function(mess) {
    //   console.log(`${mess.text}`);
    // }
  },
  computed: {},
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
