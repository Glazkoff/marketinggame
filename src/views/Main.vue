<template>
  <div id="splitScr">
    <div class>
      <h1 class="ml-1 mb-0">Room #{{roomNumber}}</h1>
      <router-link to="choose" class="mb-2 ml-1">Выйти из комнаты</router-link>
    </div>
    <Chat></Chat>
  </div>
</template>

<script>
require("bootstrap/dist/css/bootstrap.css");

import Chat from "@/components/Chat.vue";
export default {
  name: "Main",
  components: {
    Chat
  },
  methods: {
    leaveRoom() {
      console.log("Ушёл из комнаты!");
      this.$socket.emit("leaveRoom");
      this.$store.state.messages = [];
    }
  },
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
</style>
