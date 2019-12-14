<template>
<transition name="fade">
  <div class="sideBox" :class="{'chatOpened': chatOpened, 'chatClosed': !chatOpened}">
    <div class="chat-btn" @click="transformChat()">
    </div>
    <h2 id="chat" class="ml-2">Чат</h2>
    <!-- <div class="chatField"> -->
    <div class="messageField" id="messageField">
      <div class="messageBox">
        <div class="message" v-for="(mess, count) in messages" :key="count">
          <div class="avatar"></div>
          <div class="mess-block">
            <div class="nickname" v-bind:class="{adminMess: mess.name=='Admin'}">{{mess.name}}</div>
            <div class="messText">{{mess.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <SendBox></SendBox>
  </div>
</transition>
</template>
<script>
import SendBox from "@/components/SendBox.vue";

export default {
  name: "Chat",
  data() {
    return {
      chatOpened: false
    };
  },
  components: {
    SendBox
  },
  computed: {
    messages() {
      // let messList = document.querySelector("#messageField");
      // messList.scrollTop = messList.scrollHeight + 150;
      setTimeout(() => {
        let messList = document.querySelector("#messageField");
        if (messList !== null) {
          messList.scrollTop = messList.scrollHeight;
        }
      }, 10);
      return this.$store.state.messages;
    }
  },
  methods: {
    transformChat() {
      this.chatOpened = !this.chatOpened
    }
  }
};
</script>

<style>
@media screen and (max-width: 1090px){
  .chatOpened {
    left: 0px;
  }
  .chatClosed {
    left: -300px;
    box-shadow: 0px 0px 0px rgba(0,0,0,.0) !important;
  }
}
.chat-btn {
  display: none;
  width: 32px;
  height: 80px;
  position: absolute;
  right: -24px;
  top: calc(50% - 40px);
  z-index: -200;
  background-color: rgb(131, 131, 131);
  border: 1px solid black;
  border-radius: 8px;
  /* opacity: 0.8; */
}
.adminMess {
  color: rgb(255, 50, 90);
}
h2#chat {
  display: block;
  box-sizing: border-box;
  height: 40px;
  margin-bottom: 0;
}
.messageField::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}
.messageField::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

.messageField::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: linear-gradient(left, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

.messageField::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.messageField::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
.messageField {
  /* min-height: calc(100% - 70px);*/
  min-height: calc(100vh - 150px);
  max-height: calc(100vh - 150px);
  /* height: auto; */
  overflow-y: scroll;
  margin-bottom: 70px;
  overflow-x: auto;
}
.chatField {
  /* min-height: calc(90vh - 56px);*/
  /* height: calc(90vh - 140px); */
  height: auto;
}
.sideBox {
  position: relative;
  height: 100%;
  width: 300px;
  max-width: 20vw;
  grid-area: 1/1/2/2;
  border-right: 1px solid gray;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: space-between;
  box-shadow: 2px 80px 2px rgba(0, 0, 0, 0.2);
  /* align-content: middle; */
  transition: all 0.5s;
  /* transition: left box-shadow 0.3s; */
}
.mess-block {
  max-width: 15vw;
}
.message:last-child {
  margin-bottom: 5px;
}
.message {
  display: grid;
  grid-template-columns: 1fr 5fr;
  /* grid-template-columns: 1fr; */
  grid-template-rows: 1fr;
}
.nickname {
  font-weight: bold;
  margin-top: 5px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #808080;
  grid-area: 1/1/2/2;
  margin: 8px;
}

.message {
  width: 100%;
  max-width: 100%;
  word-wrap: break-word;
}
</style>