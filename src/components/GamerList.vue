<template>
  <div id="gamerlist">
    <ul class="list-group" v-if="!isStart">
      <li class="list-group-item d-flex justify-content-between align-items-center active">
        <h3>Игроки</h3>
      </li>
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(gamer, count) in gamers"
        :key="count"
        :class="{'list-group-item-primary': gamer.isattacker, 'list-group-item-warning': !gamer.isattacker}"
      >
        {{gamer.name}}
        <span
          class="badge badge-primary badge-pill"
          v-if="gamer.isattacker"
        >Сделал ход</span>
        <span class="badge badge-warning badge-pill" v-else="gamer.isattacker">Размышляет</span>
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
    gamers() {
      return this.$store.state.gamers;
    }
  }
};
</script>
<style>
#gamerlist {
  background-color: #fff;
  margin: auto auto;
  width: 96%;
  height: 97%;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
