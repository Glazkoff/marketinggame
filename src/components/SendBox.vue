<template>
  <form action @submit.prevent="sendMessage" class="inputBox">
    <textarea
      name
      rows="2"
      placeholder="Введите ваше сообщение..."
      v-model="message"
      @keydown.enter.prevent
      @keydown.enter="sendMessage"
    ></textarea>
    <button class="btn btn-primary" type="submit" @click="sendMessage">Отправить</button>
  </form>
</template>

<script>
export default {
  name: "SendBox",
  data() {
    return {
      message: ""
    };
  },
  methods: {
    sendMessage() {
      if (this.message !== "") {
        if (this.$store.state.gamerName === "") {
          this.$store.state.gamerName = "Anonim";
        }
        this.$socket.emit("newMessage", this.message);
        this.$store.state.messages.push({
          name: this.$store.state.gamerName,
          text: this.message
        });
        this.message = "";
        let messageList = document.querySelector("#messageField");
        let messBox = document.querySelector(".messageBox");
        // messageList.scrollTop =
        //   messBox.clientHeight - messageList.clientHeight + 140;
        messageList.scrollTop = messBox.scrollHeight + 140;
      }
    }
  }
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