<template>
  <form action @submit.prevent class="inputBox">
    <textarea name rows="2" placeholder="Введите ваше сообщение..."></textarea>
    <button class="btn btn-primary" type="submit">Отправить</button>
  </form>
</template>

<script>
export default {
  name: "SendBox"
};
</script>

<style scoped>
textarea {
  resize: none;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
}
.inputBox {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.inputBox button {
  border-radius: 0;
}
</style>