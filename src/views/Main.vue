<template>
  <div id="splitScr">
    <h1>Main</h1>
    <Chat></Chat>
  </div>
</template>

<script>
// import bootstrap from "bootstrap";
require("bootstrap/dist/css/bootstrap.css");
// require('bootstrap');
// @ is an alias to /src
// import Entrance from "@/components/Entrance.vue";
import Chat from "@/components/Chat.vue";
export default {
  name: "Main",
  components: {
    Chat
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
