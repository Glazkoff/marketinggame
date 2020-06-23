<template>
  <div id="socket-status" @click="log()">
    <span
      class="badge "
      :class="{ 'badge-success': isConnected, 'badge-danger': !isConnected }"
      ><span v-if="isConnected">Подключено</span
      ><span v-else>Отключено</span></span
    >
  </div>
</template>

<script>
export default {
  name: "SocketStatus",
  data() {
    return {
      isConnected: this.$socket.connected || false
    };
  },
  computed: {
    // isConnected: function(old, ne) {
    //   console.log(this.$socket.connected, old, ne);
    //   return this.$socket.connected;
    // },
    isDisconnected() {
      return this.$socket.disconnected;
    }
  },
  mounted() {
    let there = this;
    setInterval(function() {
      if (there.$socket.connected === true) {
        there.isConnected = true;
      } else {
        there.isConnected = false;
      }
    }, 500);
  },
  methods: {
    log() {
      console.log(this.$socket);
      this.isConnected = this.$socket.connected;
    }
  }
};
</script>

<style scoped>
#socket-status {
  position: fixed;
  right: 0.5rem;
  top: 0;
  z-index: 9999;
}
</style>
