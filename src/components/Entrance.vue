<template>
  <div class="card container col-4 mt-5 p-4">
    <h1 class="mb-4">Войдите в игру</h1>
    <form action @submit.prevent>
      <div class="form-group">
        <label for="name" class>Ваше имя</label>
        <br />
        <input
          type="text"
          name="name"
          id="name"
          class="form-control form-control-lg"
          placeholder="Имя"
          v-model="name"
        />
        <small
          id
          class="form-text text-muted"
        >Имя необходимо, чтобы другие игроки могли идентифицировать в чате и игре</small>
      </div>
      <button
        class="btn btn-lg btn-primary btn-block"
        @click="changePop()"
        :disabled="isClicked"
      >Войти</button>
    </form>
  </div>
</template>

<script>
import Router from "vue-router";

export default {
  name: "Entrance",
  props: {
    msg: String
  },
  data() {
    return {
      isClicked: false,
      name: ""
    };
  },
  methods: {
    changePop() {
      this.isClicked = true;
      console.log(this.name);
      this.$router.push("choose");
    }
  }
};
</script>

<style scoped>
</style>
