<template>
  <div id="splitScr">
    <h1>Room #{{roomNumber}}</h1>
    <ul>
      <li v-for="(conn, count) in connections" v-bind:key="count">conn</li>
    </ul>
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
