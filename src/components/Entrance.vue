<template>
  <div>
    <form action @submit.prevent>
      <label for="name">Ваше имя</label>
      <br />
      <input type="text" name="name" id="name" />
      <br />
      <button>Войти</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Entrance",
  props: {
    msg: String
  }
};
</script>

<style scoped>
</style>
