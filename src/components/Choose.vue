<template>
  <div class="card container col-4 mt-5 p-4">
    <h1 class="mb-4">Привет, {{gamerName}}!</h1>
    <button class="btn btn-lg btn-block btn-success">Присоединиться к комнате</button>
    <button class="btn btn-lg btn-info btn-block">Создать команту</button>
  </div>
</template>

<script>
export default {
  name: "Choose",
  data() {
    return {
      gamerName: "Аслан"
    };
  }
};
</script>

<style>
</style>