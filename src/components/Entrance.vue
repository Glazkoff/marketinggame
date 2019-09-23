<template>
  <div class="card container col-4 mt-5 p-4">
    <form action @submit.prevent>
      <div class="form-group">
        <label for="name" class>Ваше имя</label>
        <br />
        <input
          type="text"
          name="name"
          id="name"
          class="form-control form-control-lg"
          placeholder="Введите ваше имя "
        />
        <small
          id
          class="form-text text-muted"
        >Имя необходимо, чтобы другие игроки могли идентифицировать в чате и игре</small>
      </div>
      <button class="btn btn-lg btn-primary btn-block">Войти</button>
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
