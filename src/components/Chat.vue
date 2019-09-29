<template>
  <div class="sideBox">
    <h2>Chat</h2>
    <div class="messageBox">
      <div class="message" v-for="mess in messages" :key="mess.key">
        <div class="avatar"></div>

        <div class="mess-block">
          <div class="nickname">{{mess.name}}</div>
          <div class="messText">{{mess.text}}</div>
        </div>
      </div>
    </div>

    <!-- <div class="input-box"> -->
    <SendBox></SendBox>
    <!-- </div> -->
  </div>
</template>
<script>
import SendBox from "@/components/SendBox.vue";

export default {
  name: "Chat",
  data() {
    return {
      messages: [
        {
          id: 1,
          avatar: "http://",
          name: "Никита",
          text: "Привет, ребят! Жесть, здесь так много текста!"
        },
        {
          id: 2,
          avatar: "http://",
          name: "Никита",
          text: "Привет, ребят!"
        }
      ]
    };
  },
  components: {
    SendBox
  }
};
</script>

<style>
.sideBox {
  position: relative;
  height: 100%;
  width: 100%;
  grid-area: 1/1/2/2;
  border-right: 1px solid gray;
}

.message {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr;
}
.nickname {
  font-weight: bold;
  margin-top: 5px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #808080;
  grid-area: 1/1/2/2;
  margin: 8px;
}

.message {
  width: 100%;
}
</style>