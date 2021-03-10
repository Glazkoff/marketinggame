<template>
  <div id="effectslist">
    <li
      v-if="!isStart"
      class="list-group-item d-flex justify-content-between align-items-center active bg-info w-100"
      id="effects-head"
    >
      <h6>Длительные события</h6>
    </li>
    <ul class="list-group effects-body" v-if="!isStart">
      <li
        class="list-group-item d-flex justify-content-between align-items-center"
        v-for="(effect, count) in effects"
        :key="count"
        :class="{
          'list-group-item-info': count % 2 == 1,
          'list-group-item-secondary text-body': count % 2 == 0
        }"
      >
        {{ effect.name }}
        <span
          class="badge  badge-pill"
          :class="{
            'badge-info': count % 2 == 1,
            'badge-secondary': count % 2 == 0
          }"
        >Шаг: {{ effect.step }} из {{ effect.duration }}</span
        >
        <!-- <span
          class="badge badge-primary badge-pill"
          v-if="gamer.isattacker"
        >Сделал ход</span>
        <span class="badge badge-warning badge-pill" v-else="gamer.isattacker">Размышляет</span>-->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Effects",
  data() {
    return {};
  },
  computed: {
    isStart() {
      return this.$store.state.isStart;
    },
    effects() {
      return this.$store.state.activeEffects;
    }
  }
};
</script>

<style>
#effectslist {
  background-color: #fff;
  margin: auto;
  width: 96%;
  height: 97%;
  max-height: 97%;
  min-height: 97%;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
  position: relative;
}

#effects-head {
  position: absolute;
  top: 0;
  left: 0;
  height: 64px;
  z-index: 1000;
}

.list-group .list-group-item:first-child {
  border-radius: 0 !important;
}

.effects-body {
  overflow-y: auto;
  margin-top: 64px;
  height: calc(100% - 64px);
}

.effects-body::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #f5f5f5;
}

.effects-body::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

.effects-body::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

.effects-body::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.effects-body::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
</style>
