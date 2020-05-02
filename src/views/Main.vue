<template>
  <div id="splitScr">
    <div
      class="main-side"
      :style="{ display: isFinish ? 'flex' : 'unset' }"
      :class="{ 'full-screen': !adminNav }"
    >
      <div class="pg-header">
        <h3 class="ml-1 mb-0">Комната #{{ roomNumber }}</h3>
        <router-link to="choose" class="mb-2 ml-1 mr-2"
          >Выйти из комнаты</router-link
        >
      </div>
      <transition name="fade" mode="out-in">
        <PlayGround v-if="!isFinish"></PlayGround>
        <Finish v-else></Finish>
      </transition>
    </div>
    <Chat></Chat>
  </div>
</template>

<script>
import Chat from "@/components/Chat.vue";
import PlayGround from "@/components/PlayGround.vue";
import Finish from "@/components/Finish.vue";

require("bootstrap/dist/css/bootstrap.css");

export default {
  name: "Main",
  data() {
    return {};
  },
  components: {
    Chat,
    PlayGround,
    Finish
  },
  methods: {
    leaveRoom() {
      console.log("Ушёл из комнаты!");
      this.$socket.emit("leaveRoom");
      this.$store.state.messages = [];
      this.$store.state.isStart = true;
      this.$store.state.isOwner = false;
      this.$store.state.isFinish = false;
      this.$store.commit("SOCKET_doNextStep");
      this.$store.commit("resetData");
    }
  },
  // ################  НЕ УДАЛЯТЬ  ###############
  beforeRouteEnter(to, from, next) {
    next(function(vm) {
      console.log(vm.$store.state.roomId);
      vm.$store.commit("setStateFromLS");
      let t = setTimeout(() => {
        if (vm.$store.state.roomId == -1) {
          next("/choose");
        } else {
          return true;
        }
      }, 2000);

      // return true
    });
  },
  // ######################################################
  beforeRouteLeave(to, from, next) {
    // вызывается перед переходом от пути, соответствующего текущему компоненту;
    // имеет доступ к контексту экземпляра компонента `this`.
    // const answer = window.confirm(
    //   "Вы хотите уйти? У вас есть несохранённые изменения!"
    // );
    this.leaveRoom();

    // if (answer) {
    next();
    // } else {
    //   next(false);
    // }
  },
  computed: {
    roomNumber() {
      return this.$store.state.roomId;
    },
    connections() {
      return this.$store.state.connections;
    },
    isFinish() {
      return this.$store.state.isFinish;
    },
    adminNav() {
      return this.$store.state.adminNav;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter-active {
  /* transition-delay: 0.4s; */
}
.fade-enter-to {
  transform: scale(1);
  opacity: 0.9;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter {
  opacity: 0;
  transform: scale(0.9);
}
#splitScr {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 4fr;
  width: 100vw;
  height: 100%;
}
.main-side {
  position: relative;
  max-height: calc(100vh - 40px);
  /* z-index: -1; */
}
.pg-header {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 42px;
  background-color: #fff;
  box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
}
.pg-header a {
  margin: auto 1rem !important;
  margin-left: 1rem;
}
@media screen and (max-width: 320px) {
  .pg-header {
    flex-direction: row;
    height: 40px;
    justify-content: space-between;
  }
  #playground {
    padding-top: 40px;
  }
}
/* .sidebox {
} */
</style>
