<template>
  <div id="gamerlist">
    <ul class="list-group" v-if="!isStart">
      <li
        class="list-group-item d-flex justify-content-between align-items-center active"
      >
        <h3>Игроки</h3>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(gamer, count) in gamers"
        :key="count"
        :class="{
          'list-group-item-primary': gamer.isattacker && !gamer.isdisconnected,
          'list-group-item-warning': !gamer.isattacker && !gamer.isdisconnected,
          'list-group-item-danger': gamer.isdisconnected
        }"
      >
        <button v-if="isOwner" @click="kickUser(gamer)">&#x2715;</button>
        {{ gamer.name }}
        <span
          class="badge badge-primary badge-pill"
          v-if="gamer.isattacker && !gamer.isdisconnected"
          >Сделал ход</span
        >
        <span
          class="badge badge-warning badge-pill"
          v-else-if="!gamer.isattacker && !gamer.isdisconnected"
          >Размышляет</span
        >
        <span
          class="badge badge-danger badge-pill"
          v-else-if="gamer.isdisconnected"
          >Отключён</span
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "gamerlist",
  data() {
    return {};
  },
  computed: {
    isStart() {
      return this.$store.state.isStart;
    },
    isOwner() {
      return this.$store.state.isOwner;
    },
    gamers() {
      return this.$store.state.gamers;
    },
    roomId() {
      return this.$store.state.roomId;
    }
  },
  methods: {
    kickUser(gamer) {
      console.log("KICK!", this.roomId, gamer);
      let obj = {
        roomId: this.roomId,
        gamerId: gamer.id
      };
      this.$socket.emit("kickUser", obj);
    }
  },
  mounted() {
    // this.$store.commit("notNotOwner");
  }
};
</script>
<style>
#gamerlist {
  background-color: #fff;
  margin: auto auto;
  width: 96%;
  height: 97%;
  max-height: 52vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
#gamerlist::-webkit-scrollbar {
  width: 8px;
  height: 16px;
  background-color: #f5f5f5;
}

#gamerlist::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

#gamerlist::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

#gamerlist::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

#gamerlist::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
.list-group-item button {
  display: block;
  background-color: transparent;
  border: none;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 0;
  margin: 0;
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  transform-origin: 0.9rem 0.9rem 0.9rem;
  transform: scale(0.8);
  outline: none;
  user-select: none;
  position: relative;
}
.list-group-item button::before {
  outline: none;
  display: none;
  content: "Удалить игрока";
  position: fixed;
  left: 0px;
  top: 0;
  border: 1px solid #dc3545;
  transform: rotate(-90deg);
  transform-origin: 0px 0px;
  font-size: 0.8rem;
  z-index: 1000;
  width: 12vw;
  min-width: 10em;
  line-height: 0.9rem;
  background-color: #fff;
  border-radius: 4px;
  padding: 0.4rem 0.5rem;
  box-sizing: border-box;
  opacity: 0;
  text-align: left;
  transition-delay: 1.4s;
  transition: 0.2s ease-in-out;
}
.list-group-item button:hover::before {
  opacity: 1;
  display: block;
}
.list-group-item button:hover {
  transform: rotate(90deg) scale(1.2);
}
</style>
