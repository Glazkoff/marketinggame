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
          :class="{'is-invalid': errorClass}"
          placeholder="Имя"
          v-model.trim="name"
          @blur="clickForm()"
        />
        <div v-if="errorClass" class="invalid-feedback">Обязательно введите имя!</div>
        <small
          class="form-text text-muted"
        >Имя необходимо, чтобы другие игроки могли идентифицировать в чате и игре</small>
      </div>
      <button
        class="btn btn-lg btn-primary btn-block"
        @click="changePop()"
        :disabled="disabled"
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
      formClicked: false,
      name: ""
    };
  },
  mounted() {
    this.name = this.$store.state.ownerName;
    this.formClicked = true;
  },
  computed: {
    ownerName() {
      return this.$store.state.ownerName;
    },
    errorClass() {
      let bool = this.name == "" && this.formClicked;
      return bool;
    },
    disabled() {
      if (!this.formClicked) {
        return true;
      } else return this.name == "" && this.formClicked;
    }
  },
  methods: {
    changePop() {
      console.log(this.name);
      this.$store.commit("setName", this.name);
      this.$router.push("choose");
    },
    clickForm() {
      this.formClicked = true;
    }
  }
};
</script>

<style scoped>
</style>
