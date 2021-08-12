<template>
  <div id="splitScr">
    <SocketStatus></SocketStatus>
    <div v-if="loading" class="loader-wrap">
      <Loader></Loader>
    </div>
    <div
      v-else
      class="main-side"
      :style="{ display: isFinish ? 'flex' : 'unset' }"
      :class="{ 'full-screen': !adminNav }"
    >
      <div class="pg-header align-items-center">
        <h3 class="ml-1 mb-0">Комната #{{ roomNumber }}</h3>
        <router-link to="choose" class="ml-1"
        >Выйти из комнаты
        </router-link
        >
      </div>
      <ReviewModal
        v-if="showReviewModal"
        @close="onHideReviewModal()"
      ></ReviewModal>
      <CheckModal
        v-if="showCheckModal"
        @close="onCloseCheckModal()"
        :errorMessage="errorMessage"
      ></CheckModal>
      <transition name="fade" mode="out-in">
        <PlayGround v-if="!isFinish"></PlayGround>
        <Finish v-else @showReviewModal="onShowReviewModal()"></Finish>
      </transition>
    </div>
    <Chat></Chat>
  </div>
</template>

<script>
import Chat from "@/components/Chat.vue";
import PlayGround from "@/components/PlayGround.vue";
import Finish from "@/components/Finish.vue";
import Loader from "@/components/Loader.vue";
import SocketStatus from "@/components/SocketStatus.vue";
import ReviewModal from "@/components/ReviewModal.vue";
import CheckModal from "@/components/CheckModal.vue";

require("bootstrap/dist/css/bootstrap.css");

export default {
  name: "Main",
  data() {
    return {
      loading: false,
      showReviewModal: false,
      errorMessage: "",
      showCheckModal: false
    };
  },
  components: {
    Chat,
    PlayGround,
    Finish,
    Loader,
    SocketStatus,
    ReviewModal,
    CheckModal
  },
  methods: {
    onShowReviewModal() {
      this.showReviewModal = true;
    },
    onHideReviewModal() {
      this.showReviewModal = false;
    },
    onCloseCheckModal() {
      this.showCheckModal = false;
      this.$router.push('/choose')
    },
    leaveRoom() {
      console.log("Ушёл из комнаты!");
      this.$socket.emit("leaveRoom", this.roomNumber);
      this.$store.state.messages = [];
      this.$store.state.isStart = true;
      this.$store.state.isOwner = false;
      this.$store.state.isFinish = false;
      this.$store.state.prevRoomParams = {};
      this.$store.state.roomParams = {};
      this.$store.state.firstRoomParams = {};
      this.$store.commit("resetData");
    }
  },
  // ################  НЕ УДАЛЯТЬ  ###############
  beforeRouteEnter(to, from, next) {
    next(async function (vm) {
      if (
        isNaN(vm.$store.state.roomParams.money) ||
        typeof vm.$store.state.roomParams.money
      ) {
        vm.loading = true;
        try {
          await vm.$store.dispatch("TRY_RESET_ROOM");
          vm.loading = false;
        } catch (error) {
          vm.showCheckModal = true;
          vm.errorMessage = error.data.message;
          vm.loading = false;


        }
      }
      return true;
    });
  },
  beforeRouteLeave(to, from, next) {
    // вызывается перед переходом от пути, соответствующего текущему компоненту;
    // имеет доступ к контексту экземпляра компонента `this`.
    this.$socket.emit("roomLeave", this.roomNumber);
    this.leaveRoom();
    next();
  },
  mounted() {

  },
  computed: {
    roomNumber() {
      return this.$store.state.roomId;
    },
    connections() {
      return this.$store.state.connections;
    },
    isFinish() {
      if (this.$store.state.isFinish) {
        // this.onShowReviewModal();
      }
      return this.$store.state.isFinish;
    },
    adminNav() {
      return this.$store.state.adminNav;
    }
  }
};
</script>

<style>

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
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
  flex-direction: column;
  max-height: calc(100vh - 40px);
}

.pg-header {
  position: relative;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background-color: #fff;
  box-shadow: 0px 4px 3px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.5rem;
}

@media screen and (max-width: 320px) {
  .pg-header {
    flex-direction: row;
    height: auto;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .pg-header h3 {
    font-size: 1.5em;
  }
}
</style>
