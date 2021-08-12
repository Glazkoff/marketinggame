<template>
  <div id="socket-status" @click="update()">
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
    update() {
      this.isConnected = this.$socket.connected;
    }
  }
};
</script>

<style scoped>
#socket-status {
  position: fixed;
  right: 1rem;
  top: 0.5rem;
  z-index: 9999;
}
</style>
