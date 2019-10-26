<template>
  <div id="splitScr">
    <div class="main-side">
      <div class="pg-header">
        <h1 class="ml-1 mb-0">Room #{{roomNumber}}</h1>
        <router-link to="choose" class="mb-2 ml-1">Выйти из комнаты</router-link>
      </div>
      <PlayGround></PlayGround>
    </div>
    <Chat></Chat>
  </div>
</template>

<script>
require("bootstrap/dist/css/bootstrap.css");

import Chat from "@/components/Chat.vue";
import PlayGround from "@/components/PlayGround.vue";

export default {
  name: "Main",
  components: {
    Chat,
    PlayGround
  },
  methods: {
    leaveRoom() {
      console.log("Ушёл из комнаты!");
      this.$socket.emit("leaveRoom");
      this.$store.state.messages = [];
      this.$store.state.isStart = true;
      this.$store.state.isOwner = false;
      this.$store.commit("SOCKET_doNextStep");
    }
  },
  // ################  НЕ УДАЛЯТЬ  ###############
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      console.log(vm.$store.state.roomId);
      if (vm.$store.state.roomId == -1) {
        next("/");
      } else {
        return true;
      }
    });
  },
  // ######################################################
  beforeRouteLeave(to, from, next) {
    // вызывается перед переходом от пути, соответствующего текущему компоненту;
    // имеет доступ к контексту экземпляра компонента `this`.
    // const answer = window.confirm(
    //   "Вы хотите уйти? У вас есть несохранённые изменения!"
    // );
    this.leaveRoom();

    // if (answer) {
    next();
    // } else {
    //   next(false);
    // }
  },
  computed: {
    roomNumber() {
      return this.$store.state.roomId;
    },
    connections() {
      return this.$store.state.connections;
    }
  }
};
</script>

<style>
#splitScr {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 4fr;
  width: 100vw;
  height: 100%;
}
.main-side {
  position: relative;
}
.pg-header {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #fff;
  box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);
}
.sidebox {
}
</style>
