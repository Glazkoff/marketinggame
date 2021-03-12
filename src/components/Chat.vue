<template>
  <transition name="fade">
    <div
      class="sideBox"
      :class="{ chatOpened: chatOpened, chatClosed: !chatOpened }"
    >
      <div
        class="chat-btn"
        @click="transformChat()"
        :class="{ 'bg-danger': chatOpened, 'bg-info': !chatOpened }"
      >
        <transition name="fade">
          <img
            src="../assets/chat-icon.svg"
            alt=""
            class="chat-btn-icon"
            v-if="!chatOpened"
          />
          <img
            src="../assets/close-icon.svg"
            alt=""
            class="chat-btn-icon"
            v-if="chatOpened"
          />
        </transition>
        <div class="chat-count" v-if="!messCountIsVoid && !chatOpened">
          <span>{{ unreadMessCount }}</span>
        </div>
      </div>
      <h2 id="chat" class="ml-2">Чат</h2>
      <div class="messageField" id="messageField">
        <div class="messageBox">
          <div
            class="message"
            v-for="(mess, count) in messages"
            :key="count"
            :class="{ adminBg: mess.name == 'Admin' }"
          >
            <div class="avatar"></div>
            <div class="mess-block">
              <div
                class="nickname"
                :class="{ adminMess: mess.name == 'Admin' }"
              >
                {{ mess.name }}
              </div>
              <div class="messText">{{ mess.text }}</div>
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
      chatOpened: false,
      unreadMessCount: 0,
      readCount: 0
    };
  },
  mounted() {
    this.$store.watch(
      (state, getters) => state.messages,
      (newValue, oldValue) => {
        if (!this.chatOpened) {
          console.log(newValue.length);
          this.unreadMessCount = newValue.length - this.readCount;
        } else {
          this.readCount = newValue.length;
        }
      }
    );
  },
  components: {
    SendBox
  },
  computed: {
    messages() {
      // let a = setTimeout(() => {
      let messList = document.querySelector("#messageField");
      if (messList !== null) {
        messList.scrollTop = messList.scrollHeight;
      }
      // }, 10);
      return this.$store.state.messages;
    },
    messCountIsVoid() {
      return this.unreadMessCount === 0;
    }
  },
  watch: {},
  methods: {
    transformChat() {
      this.chatOpened = !this.chatOpened;
      this.unreadMessCount = 0;
      this.readCount = this.$store.state.messages.length;
    }
  }
};
</script>

<style>
.adminBg {
  background: rgba(226, 226, 226, 0.329);
}

.chat-count {
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: red;
  position: absolute;
  right: -8px;
  top: -8px;
  font-size: 10px;
  color: #fff;
  display: flex;
}

.chat-count span {
  display: block;
  margin: auto;
  font-weight: bold;
}

@media screen and (max-width: 1090px) {
  .mess-block {
    max-width: unset;
  }

  .chatOpened {
    left: 0px;
  }

  .chatOpened .chat-btn {
    border-radius: 0;
  }

  .chatClosed {
    left: -300px;
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0) !important;
  }
}

@media screen and (max-width: 330px) {
  .chatClosed {
    left: calc(30px - 100vw);
  }
}

.chat-btn {
  cursor: pointer;
  transition-duration: 0.5s;
  display: none;
  width: 40px;
  height: 40px;
  position: absolute;
  right: -32px;
  top: calc(50% - 20px);
  z-index: -200;
  background-color: #f8f9fa;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
  border-radius: 8px;
}

.chat-btn-icon {
  margin: auto;
  padding-left: 8px;
  display: block;
  width: 30px;
  color: #fff;
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
  height: calc(100vh - 120px);
  overflow-y: scroll;
  margin-bottom: 70px;
  overflow-x: auto;
}

.sideBox {
  position: relative;
  height: 100%;
  max-width: 20vw;
  grid-area: 1/1/2/2;
  border-right: 1px solid gray;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 60px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.5s;
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
  grid-template-rows: 1fr;
  width: 100%;
  word-break: break-word;
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
</style>
