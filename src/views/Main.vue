<template>
  <div id="splitScr">
    <div class="main-side" :style="{display: isFinish ? 'flex' : 'unset'}">
      <div class="pg-header">
        <h3 class="ml-1 mb-0">Комната #{{roomNumber}}</h3>
        <router-link to="choose" class="mb-2 ml-1">Выйти из комнаты</router-link>
      </div>
      <transition name="fade" mode="out-in">
        <PlayGround v-if="!isFinish"></PlayGround>
        <Finish v-else></Finish>
      </transition>
    </div>
    <Chat></Chat>
  </div>
</template>

<script>
require("bootstrap/dist/css/bootstrap.css");

import Chat from "@/components/Chat.vue";
import PlayGround from "@/components/PlayGround.vue";
import Finish from "@/components/Finish.vue";

export default {
  name: "Main",
  data() {
    return {};
  },
  components: {
    Chat,
    PlayGround,
    Finish
  },
  methods: {
    leaveRoom() {
      console.log("Ушёл из комнаты!");
      this.$socket.emit("leaveRoom");
      this.$store.state.messages = [];
      this.$store.state.isStart = true;
      this.$store.state.isOwner = false;
      this.$store.state.isFinish = false;
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
    },
    isFinish() {
      return this.$store.state.isFinish;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter-active {
  /* transition-delay: 0.4s; */
}
.fade-enter-to {
  transform: scale(1);
  opacity: 0.9;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter {
  opacity: 0;
  transform: scale(0.9);
}
#splitScr {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 4fr;
  width: 100vw;
  height: 100%;
}
.main-side {
  position: relative;
  max-height: calc(100vh - 40px);
}
.pg-header {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #fff;
  box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);
}
/* .sidebox {
} */
</style>
