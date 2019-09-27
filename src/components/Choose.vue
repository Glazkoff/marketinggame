<template>
  <div class="card container col-4 mt-5 p-4">
    <h1 class="mb-1">Привет, {{ownerName}}!</h1>
    <router-link to="/">Сменить имя</router-link>

    <p>Выбери, как ты начнёшь игру</p>
    <div class="btn-group btn-group-toggle mb-3">
      <label
        class="btn btn-lg"
        :class="{'btn-outline-info': this.toggle!='create', 'btn-info': this.toggle=='create'}"
      >
        <input
          type="radio"
          v-model="toggle"
          value="create"
          name="toggle"
          id="toggle2"
          autocomplete="off"
        />Создать комнату
      </label>
      <label
        class="btn btn-lg"
        :class="{'btn-outline-info': this.toggle!='join', 'btn-info': this.toggle=='join'}"
      >
        <input
          type="radio"
          v-model="toggle"
          value="join"
          name="toggle"
          id="toggle1"
          autocomplete="off"
        /> Присоединиться к комнате
      </label>
    </div>
    <transition name="slideUp" mode="out-in" appear>
      <div class v-if="toggle == 'join'">
        <label for="name" class>Номер комнаты</label>
        <br />
        <input
          type="number"
          min="0"
          v-model.number="roomId"
          name="name"
          id="name"
          class="form-control form-control-lg mb-3"
          placeholder="Введите номер комнаты"
        />
        <button class="btn btn-lg btn-danger btn-block">Присоединиться</button>
      </div>
      <div class v-if="toggle == 'create'">
        <label for="name" class>Напишите номер комнаты</label>
        <br />
        <input
          type="number"
          name="name"
          id="name"
          v-model.number="roomId"
          class="form-control form-control-lg mb-2"
          placeholder="Номер комнаты"
        />
        <label for="name" class>Количество месяцев</label>
        <br />
        <input
          type="number"
          min="0"
          v-model.number="roomMonth"
          name="name"
          id="name"
          class="form-control form-control-lg mb-3"
          placeholder="3"
        />
        <button class="btn btn-lg btn-danger btn-block">Создать</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Choose",
  data() {
    return {
      toggle: "create",
      roomId: "",
      roomMonth: 3
    };
  },
  computed: {
    ownerName() {
      return this.$store.state.ownerName;
    }
  }
};
</script>

<style>
</style>