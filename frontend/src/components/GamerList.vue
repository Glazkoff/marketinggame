<template>
  <div id="gamerlist">
      <div
        class="list-group-item d-flex justify-content-between align-items-center active w-100" id="gamerlist-head"
      >
        <h3>Игроки</h3>
      </div>

      <ul class="list-group" v-if="!isStart">
        <li
        v-if="isOwner"
        class="list-group-item d-flex justify-content-between align-items-center list-group-item-primary"
      >
        <button
          @click="onManualStepClose()"
          id="close-step"
          class="btn btn-block btn-danger"
        >
          Завершить ход вручную
        </button>
      </li>
      <li
        class="list-group-item d-flex align-items-center"
        v-for="(gamer, count) in gamers"
        :key="count"
        :class="{
          'list-group-item-primary': gamer.isattacker && !gamer.isdisconnected,
          'list-group-item-warning': !gamer.isattacker && !gamer.isdisconnected,
          'list-group-item-danger': gamer.isdisconnected
        }"
      >
        <button v-if="isOwner && ownerId !== gamer.id && !gamer.isdisconnected" @click="kickUser(gamer)">&#x2715;
        </button>
        <div class="justify-content-between w-100 d-flex">
          {{ gamer.name }}
          <span
            class="badge badge-primary badge-pill gamer-status"
            v-if="gamer.isattacker && !gamer.isdisconnected"
          >Сделал ход</span
          >
          <span
            class="badge badge-warning badge-pill gamer-status"
            v-else-if="!gamer.isattacker && !gamer.isdisconnected"
          >Размышляет</span
          >
          <span
            class="badge badge-danger badge-pill gamer-status"
            v-else-if="gamer.isdisconnected"
          >Отключён</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "gamerlist",
  props: [
    'usedCards',
    'refreshCards'
  ],
  computed: {
    isStart() {
      return this.$store.state.isStart;
    },
    isOwner() {
      return this.$store.state.isOwner;
    },
    ownerId() {
      return this.$store.state.ownerId;
    },
    gamers() {
      return this.$store.state.gamers;
    },
    roomId() {
      return this.$store.state.roomId;
    },
    gamerParams() {
      return this.$store.state.roomParams;
    },
    oneOffCardList() {
      return this.$store.state.oneOffCardList;
    },
  },
  methods: {
    async onManualStepClose() {
      this.$store.commit("SET_STEP_TYPE", true)
      this.$store.commit("doStep"); //
      if (this.gamerParams.month > 0) {
        this.$socket.emit("manualStepClose", this.roomId);
        let stepArr = [];
        for (const val of this.usedCards) {
          let cardObj = {
            id: val,
            title: this.refreshCards.find(el => el.id === val).title
          };
          stepArr.push(cardObj);
        }
        this.$store.commit("addSteps", stepArr);
        // Одноразовые карточки (индексы):
      await this.$store.dispatch("GET_ONEOFF_CARD_LIST");
      let oneOffCards = this.oneOffCardList;
      for (const cardIndex of oneOffCards) {
        let usedIndex = this.usedCards.findIndex(elem => elem === cardIndex);
        if (usedIndex !== -1) {
          let spliceIndex = this.refreshCards.findIndex(
            elem => elem.id === cardIndex
          );
          this.refreshCards.splice(spliceIndex, 1);
        }
      }
      this.$emit('usedCardsManual');
      this.$store.commit("SET_CARDS", [...this.refreshCards]);
        await this.$store.dispatch("GET_USED_ONEOFF_CARD_LIST")
      }
    },
    kickUser(gamer) {
      let obj = {
        roomId: this.roomId,
        gamerId: gamer.id
      };
      this.$socket.emit("kickUser", obj);
    }
  },
  mounted() {
    // this.$store.commit("notNotOwner");
  }
};
</script>
<style>
#gamerlist {
  background-color: #fff;
  margin: auto;
  width: 96%;
  height: 97%;
  max-height: 60vh;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
  position: relative;
}

#gamerlist-head {
  position: absolute;
  top: 0;
  left: 0;
  height: 64px;
}

#gamerlist::-webkit-scrollbar {
  width: 8px;
  height: 16px;
  background-color: #f5f5f5;
}

#gamerlist::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

#gamerlist::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

#gamerlist::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

#gamerlist::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}

#gamerlist .list-group{
  overflow-y: auto;
  height: calc(100% - 64px);
  margin-top: 64px;
  border-radius: 0 !important;
}

#gamerlist .list-group-item {
    padding: .5rem !important;
  }

.list-group .list-group-item {
  border-radius: 0 !important;
}

.list-group-item button:not(#close-step) {
  background-color: transparent;
  border: none;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  width: 1.8rem;
  height: 1.8rem;
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 0;
  margin-right: 10px;
  text-align: center;
  vertical-align: middle;
  box-sizing: border-box;
  transform-origin: 0.9rem 0.9rem 0.9rem;
  transform: scale(0.8);
  outline: none;
  user-select: none;
  position: relative;
}

.list-group-item button:not(#close-step)::before {
  outline: none;
  display: none;
  content: "Удалить игрока";
  position: fixed;
  left: 0px;
  top: 0;
  border: 1px solid #dc3545;
  transform: rotate(-90deg);
  transform-origin: 0px 0px;
  font-size: 0.8rem;
  z-index: 1000;
  width: 12vw;
  min-width: 10em;
  line-height: 0.9rem;
  background-color: #fff;
  border-radius: 4px;
  padding: 0.4rem 0.5rem;
  box-sizing: border-box;
  opacity: 0;
  text-align: left;
  transition-delay: 1.4s;
  transition: 0.2s ease-in-out;
}

.list-group-item button:not(#close-step):hover::before {
  opacity: 1;
  display: block;
}

.list-group-item button:not(#close-step):hover {
  transform: rotate(90deg) scale(1.2);
}

.gamer-status {
  align-self: center;
}
</style>
