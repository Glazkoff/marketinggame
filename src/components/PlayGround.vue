<template>
  <div id="playground" :class="{ 'full-screen': !adminNav }" v-cloak>
    <div id="play-field">
      <div
        class="play-information"
        :class="{ dragstart: dragstart, dragover: dragover }"
        @dragenter.prevent="dragov"
        @dragover.prevent
        @drop.prevent="altdrop"
        @dragleave="dragleave"
      >
        <!-- Обёртка случайного события с сервера -->
        <transition name="cardwrap">
          <Event
            :event="event"
            @close="closeEvent"
            v-if="isEvent && !isStart"
          ></Event>
        </transition>

        <!-- Начальный экран владельца комнаты -->
        <div
          class="owner-start-game d-flex align-content-between flex-wrap h-100"
          v-if="isOwner & isStart"
        >
          <div class="container h-100">
            <div class="row h-100 justify-content-center align-items-center">
              <div class="col-12">
                <h1 class="text-center">Начать игру</h1>
                <p>
                  Если все игроки подключились к комнате, вы можете запустить
                  <mark>первый раунд</mark> в созданной вами комнате.
                </p>
                <div
                  class="btn btn-primary btn-lg btn-block mt-3"
                  style="cursor: pointer"
                  @click="startGame()"
                >
                  Начать
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Конец начального экрана владельца комнаты -->
        <!-- Экран для обычного пользователя -->
        <div
          class="owner-start-game d-flex align-content-between flex-wrap h-100"
          v-if="!isOwner & isStart"
        >
          <div class="container text-centre h-100">
            <div class="row h-100 justify-content-center align-items-center">
              <div class="col-11 text-center">
                <h1>Ожидайте начала игры</h1>
                <p>
                  Когда все игроки подключатся к комнате, создатель комнаты
                  запустит
                  <mark>первый раунд</mark> в созданной комнате.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Конец экрана для обычного пользователя -->
        <!-- Основной экран -->
        <div class="gamer-round-data container h-100" v-if="!isStart">
          <div
            class="row h-100 justify-content-center align-items-start d-flex"
          >
            <div class="col-12 data-wrap" style="margin: auto auto;">
              <div class="container-fluid pl-0 pr-0">
                <div class="row">
                  <div
                    class="col-md-5 col-sm-12 d-flex align-content-center pt-sm-2 pb-sm-2"
                    style="vertical-align: middle"
                  >
                    <h4 class="mb-0 d-block">
                      Сейчас у вас ({{ gamerName }}) есть:
                    </h4>
                  </div>
                  <div class="col-md-7 col-sm-12 data-group">
                    <ul class="list-group list-group-horizontal w-100">
                      <li
                        class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center"
                        style="border-right: 1px solid rgba(0, 0, 0, 0.125); z-index: 20"
                      >
                        Бюджет
                        <span class="badge badge-primary badge-pill">
                          <h4>{{ gamerParams.money }}₽</h4>
                        </span>
                      </li>
                      <li
                        class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center"
                      >
                        Месяц
                        <span class="badge badge-primary badge-pill">
                          <h4
                            v-if="
                              firstRoomParams.month - gamerParams.month <
                                firstRoomParams.month
                            "
                          >
                            {{ firstRoomParams.month - gamerParams.month + 1 }}
                            из
                            {{ firstRoomParams.month }}
                          </h4>
                          <h4 v-else>
                            Завершено
                          </h4>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="data-table">
                <DataTable></DataTable>
              </div>
              <button
                class="btn btn-success w-100 mt-1 pr-2 btn-block mb-2"
                :disabled="isStart || stepDone"
                @click="makeStep()"
              >
                Завершить ход
                <small>(Использовано карт: {{ usedCards.length }})</small>
              </button>
            </div>
          </div>
        </div>
        <!-- Конец экрана для обычного пользователя -->
      </div>
    </div>
    <!-- Поле для карточек -->
    <div
      id="card-field"
      style="transition: all 5s, width 0s"
      :style="{ overflowX: stepDone ? 'hidden' : 'scroll' }"
    >
      <div class="loader-wrap h-100" v-if="cardsLoading">
        <Loader></Loader>
      </div>
      <div class="h-100" v-else>
        <transition mode="out-in" name="fade" type="transition">
          <div v-if="stepDone" class="dark-cover h-100 w-100" draggable="false">
            <div class="container h-100 w-100">
              <div
                class="row h-100 justify-content-md-center align-content-center"
              >
                <div class="col-12">
                  <h2 class="text-center">Вы сделали ход!</h2>
                  <p class="text-center">
                    <small>Ожидайте следующий</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition-group
          name="cardwrap"
          id="card-wrap"
          tag="div"
          v-if="!isStart"
        >
          <div
            class="card-box"
            v-for="(card, count) in cards"
            :key="count"
            :class="{
              'card-ml-0': card.oneOff,
              'card-ml-1': !card.oneOff && !isLastEffectStage(card.id),
              'card-ml-2': !card.oneOff && !hasThisEffect(card.id)
            }"
          >
            <div
              class="card-box w-100 h-100 bottom-card bottom-card-1"
              v-if="!card.oneOff && !isLastEffectStage(card.id)"
            ></div>
            <div
              class="card-box w-100 h-100 bottom-card bottom-card-2"
              v-if="
                (!card.oneOff && !hasThisEffect(card.id)) || isLastStep(card.id)
              "
            ></div>
            <div class="inner-card-wrap">
              <div class="card-head">
                <h6 class="card-title text-center pl-2 pr-2 mb-1">
                  {{ card.title }}
                </h6>
              </div>
              <small class="card-text text-center">{{ card.text }}</small>
              <h3 class="card-text text-center">
                {{ card.cost | formatNumber }} ₽
              </h3>
            </div>
            <button
              class="btn btn-dark pl-2"
              @click="dropFromBtn(count)"
              :disabled="stepDone || card.cost > gamerParams.money"
            >
              Использовать
            </button>
          </div>
        </transition-group>
      </div>
    </div>
    <!-- Конец Поле для карточек -->
    <!-- Список игроков -->
    <div id="enemy-field">
      <GamerList></GamerList>
    </div>
    <!-- Конец список игроков -->
    <!-- Спиок действующих эффектов -->
    <div id="effects-field">
      <Effects></Effects>
    </div>
    <!-- Конец списка действующих игроков -->
  </div>
</template>

<script>
import GamerList from "@/components/GamerList.vue";
import Effects from "@/components/Effects.vue";
import DataTable from "@/components/DataTable.vue";
import Loader from "@/components/Loader.vue";
import Event from "@/components/Event.vue";
import numeral from "numeral";
import Vue from "vue";
Vue.filter("formatNumber", function(value) {
  return numeral(value).format("0,0");
});
export default {
  name: "PlayGround",
  components: {
    GamerList,
    Effects,
    DataTable,
    Loader,
    Event
  },
  created() {
    this.$store.watch(
      state => state.completedSessions,
      (newValue, oldValue) => {
        // ИЗМЕНЕНИЕ КОЭФФИЦИЕНТОВ КАРТОЧЕК ПОСЛЕ СЕССИЙ
        this.completedSessions.forEach(el => {
          let cardIndex = this.refreshCards.findIndex(card => {
            return card.id === el;
          });
          if (cardIndex !== -1) {
            this.refreshCards[cardIndex].coefs = this.refreshCards[
              cardIndex
            ].coefs.map(coef => {
              // Изменение каждого коэф. после трёх ходов подряд
              let res = Math.ceil(((1 + coef) / 2) * 10) / 10;
              if (coef >= 10) {
                res = Math.ceil(res);
              }
              return res;
            });
          } else {
            console.error("Что-то не так с изменением карточек после сессий");
          }
        });

        this.$store.watch(
          state => state.isStart,
          (newValue, oldValue) => {
            if (!newValue) {
              setTimeout(() => {
                this.playAnimation();
              }, 100);
            }
          }
        );
        this.$store.watch(
          state => state.roomParams.money,
          (newValue, oldValue) => {
            if (newValue) {
              setTimeout(() => {
                this.playAnimation();
              }, 100);
            }
          }
        );

        // ЗАНЕСЕНИЕ ИЗ ШАБЛОНА И ПОДСТАНОВКА КОЭФФИЦИЕНТОВ
        this.refreshCards.forEach(el => {
          if (
            typeof el.coefs !== "undefined" &&
            typeof el.templateText !== "undefined" &&
            !el.oneOff
          ) {
            if (el.templateText !== null) {
              el.text = el.templateText;
            }
            if (el.coefs.length !== 0 && el.coefs.length !== undefined) {
              for (let i = 0; i < el.coefs.length; i++) {
                let regexp = new RegExp("(@coef" + i + ")");
                el.text = el.text.replace(
                  regexp,
                  (match, p1, offset, string) => {
                    return el.coefs[i];
                  }
                );
              }
            }
          }
        });
      }
    );
    this.$store.commit("SET_CARDS", this.shuffle(this.cards));
    this.refreshCards = [...this.cards];
  },
  data() {
    return {
      usedCards: [],
      cardsLoading: false,
      clientsRendered: true,
      dragstart: false,
      dragover: false,
      dragnode: undefined,
      params: {},
      refreshCards: [],
      number: 0,
      tweenedNumber: 0
    };
  },
  mounted() {
    this.number = this.$store.state.roomParams.money;
    this.playAnimation();
    this.getCards();
  },
  watch: {
    number: function(newValue) {
      if (this.$refs.number1 !== undefined) {
        this.$refs.number1.play();
      }
    },
    money: function(newValue) {
      setTimeout(() => {
        this.playAnimation();
      }, 50);
    }
  },
  computed: {
    cards() {
      return this.$store.state.cards;
    },
    oneOffCardList() {
      return this.$store.state.oneOffCardList;
    },
    clients() {
      return this.$store.state.roomParams.clients;
    },
    money() {
      return this.$store.state.roomParams.money;
    },
    isEvent() {
      let obj = this.$store.state.gameEvent;
      for (let key in obj) {
        return true;
      }
      return false;
    },
    event() {
      return this.$store.state.gameEvent;
    },
    isOwner() {
      return this.$store.state.isOwner;
    },
    isStart() {
      this.playAnimation();
      return this.$store.state.isStart;
    },
    gamerName() {
      return this.$store.state.gamerName;
    },
    gamerParams() {
      return this.$store.state.roomParams;
    },
    firstRoomParams() {
      return this.$store.state.firstRoomParams;
    },
    stepDone() {
      let cardField = document.querySelector("#card-field");
      if (cardField !== null) {
        cardField.scrollTo(0, 0);
      }
      return this.$store.state.stepDone;
    },
    effects() {
      return this.$store.state.activeEffects;
    },
    completedSessions() {
      return this.$store.state.completedSessions;
    },
    adminNav() {
      return this.$store.state.adminNav;
    }
  },
  methods: {
    // При клике на кнопку "Начать"
    startGame() {
      this.$socket.emit("startGame", { room_id: this.$store.state.roomId });
      this.playAnimation();
    },
    async makeStep() {
      this.$store.commit("doStep"); //
      this.$socket.emit("doStep", this.usedCards);
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
      this.usedCards = [];
      this.$store.commit("SET_CARDS", [...this.refreshCards]);
    },
    // **** Ниже необработанные методы ******
    playAnimation() {
      if (this.$refs.number1 !== undefined) {
        this.$refs.number1.play();
        setTimeout(() => {
          if (this.$refs.number1 !== undefined) {
            this.$refs.number1.play();
          }
        }, 100);
      }
    },
    isLastEffectStage(id) {
      let effectId = this.effects.findIndex(elem => elem.id === id);
      if (effectId !== -1) {
        let effect = this.effects[effectId];
        return effect.step + 1 === effect.duration;
      } else return false;
    },
    hasThisEffect(id) {
      return this.effects.findIndex(elem => elem.id === id) !== -1;
    },
    isLastStep(id) {
      let effect = this.effects.find(elem => elem.id === id);
      if (effect !== undefined) {
        return effect.step === effect.duration;
      } else {
        return false;
      }
    },
    closeEvent() {
      this.$store.commit("SOCKET_setGameEvent", {});
    },
    shuffle(arra1) {
      let ctr = arra1.length;
      let temp;
      let index;
      while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
      }
      return arra1;
    },

    dropFromBtn(index) {
      this.usedCards.push(this.cards[index].id);
      let change = -this.cards[index].cost;
      this.$store.commit("changeMoney", change);
      this.$store.commit("SPLICE_CARD", this.cards[index].id);
      this.playAnimation();
    },
    altdrop(e) {
      e.preventDefault();
      console.log("drop");
      this.dragovered = false;
      this.dragstart = false;
      if (typeof this.dragnode !== "undefined") {
        if (this.dragnode.parentNode.id === "card-wrap") {
          let i = 0;
          for (const iterator of this.dragnode.parentNode.childNodes) {
            if (iterator === this.dragnode) {
              break;
            }
            i++;
          }
          this.usedCards.push(this.cards[i].id);
          let change = -this.cards[i].cost;
          this.$store.commit("changeMoney", change);
          this.$store.commit("SPLICE_CARD", this.cards[i].id);
        }
      }
      this.dragnode = undefined;
      this.playAnimation();
    },
    altdragstart(e) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("text/plain", null);
      e.target.style.opacity = 0.5;
      e.target.style.transform = "scale(0.8)";
      this.dragstart = true;
      this.dragnode = e.target;
    },
    altdragend(e) {
      e.target.style.opacity = "";
      e.target.style.transform = "";
      this.dragnode = undefined;
      this.dragover = false;
      this.dragstart = false;
    },
    dragov(e) {
      console.log("over");
      e.dataTransfer.dropEffect = "move";
      this.dragover = true;
    },
    dragleave(e) {
      console.log("leave");
      this.dragover = false;
    },
    getCards() {
      console.log("GET CARDS!");
      this.cardsLoading = true;
      this.$store.dispatch("GET_CARDS").then(
        res => {
          this.refreshCards = [...res];
          this.cardsLoading = false;
        },
        err => {
          this.cardsLoading = false;
          console.log(err);
        }
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.cardsLoading = true;
      vm.$store.dispatch("GET_CARDS").then(
        res => {
          vm.refreshCards = [...res];
          vm.cardsLoading = false;
        },
        err => {
          vm.cardsLoading = false;
          console.log(err);
        }
      );
    });
  }
};
</script>

<style>
.data-table {
  width: 100%;
  overflow-x: auto;
}
.gamer-round-data {
  min-width: unset !important;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: #f5f5f5;
}
::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
#main-data .list-group-item {
  padding-top: 0.45rem !important;
  padding-bottom: 0.45rem !important;
}
.card-ml-0 {
  margin-left: 0;
}
.card-ml-1 {
  margin-left: 10px;
}
.card-ml-2 {
  margin-left: 20px;
}
.bottom-card {
  position: absolute !important;
}
.bottom-card-1 {
  width: 100%;
  height: 100%;
  transform: translateX(-10px) translateY(10px);
  z-index: -1;
  background: #f7f7f7 !important;
}
.bottom-card-2 {
  width: 100%;
  height: 100%;
  transform: translateX(-20px) translateY(20px);
  z-index: -2;
  background: #ebebeb !important;
}
.list-group-horizontal li.list-group-item {
  border-radius: 0 !important;
}
.dark-cover {
  opacity: 0.9;
  position: absolute;
  background: repeating-linear-gradient(
    45deg,
    #606dbc,
    #606dbc 10px,
    #465298 10px,
    #465298 20px
  );
  user-select: none;
  color: #fff;
  z-index: 1000;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s;
}

.fade-enter-active {
  transition-delay: 0.4s;
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

.cardwrap-enter-active,
.cardwrap-leave-active {
  transition: all 0.5s;
}

.cardwrap-leave-active {
  transform: translateX(-20px);
  opacity: 0;
}

.cardwrap-enter {
  transform: translateX(20px);
  opacity: 0;
}

#playground {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 40px);
  position: relative;
  padding-top: 50px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1.6fr 1fr;
}

#play-field,
#card-field {
  margin: auto auto;
  width: 100%;
  height: 100%;
}

#play-field {
  background-color: rgba(123, 45, 64, 0.3);
  grid-area: 1/1/2/2;
  display: flex;
  /* min-height: 16rem; */
}

#card-field {
  grid-area: 2/1/3/2;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 96%;
  height: 96%;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
  position: relative;
}

.play-information {
  transition: background-color 0.25s;
  width: 96%;
  height: 96%;
  background-color: #fff;
  margin: auto auto;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

.dragstart {
  border: 8px dashed gray;
}

.dragover {
  background-color: #d8d8d8;
}

#card-wrap {
  display: flex;
  height: 100%;
  transition: all 0.4s;
  max-height: 100%;
}

.card-box button {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.card-head {
  height: 30%;
  box-sizing: border-box;
  margin-bottom: 4px;
  display: flex;
}

.card-head h6 {
  display: block;
  margin: auto auto !important;
  font-size: 16px;
}

.card-box {
  box-shadow: -1px 4px 3px rgba(0, 0, 0, 0.4);
  position: relative;
  transition: all 0.4s;
  max-width: 220px;
  width: 30%;
  min-width: 180px;
  margin-right: 16px;
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 8px;
}

.card-image {
  background-color: rgba(0, 0, 0, 0.3);
  width: 80%;
  height: 20%;
  margin: 0 auto;
}

#enemy-field {
  background-color: rgba(1, 24, 202, 0.3);
  grid-area: 1/2/2/3;
  height: 100%;
  display: flex;
}

#effects-field {
  background-color: rgba(18, 202, 1, 0.438);
  grid-area: 2/2/3/3;
  height: 100%;
  min-height: 50%;
  max-height: 100%;
  display: flex;
  overflow: auto;
}

#card-field::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: #f5f5f5;
}

#card-field::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}

#card-field::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

#card-field::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

#card-field::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}

.event-box {
  background: #fff;
  border-radius: 8px;
  position: absolute;
  z-index: 2000;
}
#main-data {
  padding-right: 0;
}
.data-group .list-group-horizontal .list-group-item {
  padding: 0.1rem 0.5rem;
}
.data-group .list-group-horizontal .list-group-item h4 {
  margin-bottom: 0;
}
.inner-card-wrap {
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.inner-card-wrap small {
  padding-right: 10px;
  padding-left: 10px;
  font-size: 0.7rem;
}
.inner-card-wrap h3 {
  padding-bottom: 8px;
}
.inner-card-wrap h6 {
  font-size: 0.9rem;
}

[v-cloak] {
  display: none;
}
@media screen and (max-height: 560px) {
  .main-side {
    overflow-y: scroll;
  }
}
@media screen and (max-width: 1250px) {
  .list-group-item {
    padding: 8px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}
@media screen and (max-width: 1090px) {
  #splitScr {
    grid-template-rows: 1fr !important;
    grid-template-columns: 1fr !important;
    position: relative;
  }
  .main-side {
    grid-area: 1/1/2/2;
    display: block;
  }
  .sideBox {
    position: absolute;
    grid-area: unset !important;
    z-index: 200000;
    background: #fff;
    box-shadow: 100px 0px 200px rgba(20, 20, 20, 0.8);
    max-width: calc(100vw - 30px);
    width: 300px;
    min-height: 100vh;
  }
  .mess-block {
    max-width: unset;
  }
  .chat-btn {
    display: flex;
  }
}
@media screen and (max-width: 970px) {
  #playground {
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1.6fr 1fr;
  }
  #play-field {
    grid-area: 1/1/2/4;
    width: 100%;
    margin: 0;
  }
  #enemy-field {
    grid-area: 2/3/3/4;
  }
}
@media screen and (max-width: 490px) {
  .play-information {
    padding: 0;
  }
  .main-side .pg-header {
    position: relative;
    height: 5rem;
  }
  #playground {
    padding: 0;
  }
  .main-side #finish-screen {
    margin-top: 0rem;
  }
  .main-side .pg-header a {
    padding: 2.2rem 0rem 0rem 0rem;
    width: 10rem;
    left: 0;
    position: absolute;
  }
  .col .gray-block {
    height: 90%;
  }
  #direction-column {
    flex-direction: column;
    height: 26rem;
  }
  .col .list-group {
    margin: auto;
    padding-left: 1rem;
  }
  .w-100 {
    height: 100%;
  }
  #direction-column .col-8 {
    max-width: 100%;
  }
}
@media screen and (max-width: 615px) {
  .col .gray-block {
    height: 90%;
  }
  #flex {
    flex-direction: column;
    height: 26rem;
  }
  .col .list-group {
    margin: auto;
    padding-left: 1rem;
  }
  .w-100 {
    height: 100%;
  }
}

@media screen and (max-width: 730px) {
  .main-side {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  .play-information {
    padding: 0;
    height: 100%;
  }
  #play-field {
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  #playground {
    display: flex;
    flex-direction: column;
  }
  .list-group-item {
    padding: 2px !important;
    padding-left: 8px !important;
    padding-right: 2px !important;
  }

  #card-field {
    display: flex;
    width: 100vw !important;
    min-height: 30vh;
  }

  #enemy-field {
    display: flex;
    width: 100% !important;
    min-height: 20rem;
  }
  #effects-field {
    display: flex;
    width: 100% !important;
  }
}

@media screen and (max-width: 490px) {
  .main-side .pg-header {
    height: 5rem;
  }
  .main-side #finish-screen {
    margin-top: 0rem;
  }
  .main-side .pg-header a {
    padding: 2.2rem 0rem 0rem 0rem;
    width: 10rem;
    left: 0;
    position: absolute;
  }
  .col .gray-block {
    height: 90%;
  }
  #direction-column {
    flex-direction: column;
    height: 26rem;
  }
  .col .list-group {
    margin: auto;
    padding-left: 1rem;
  }
  .w-100 {
    height: 100%;
  }
}
@media screen and (max-width: 615px) {
  .col .gray-block {
    height: 90%;
  }
  #flex {
    flex-direction: column;
    height: 26rem;
  }
  .col .list-group {
    margin: auto;
    padding-left: 1rem;
  }
  .w-100 {
    height: 100%;
  }
}
@media screen and (max-height: 729px) {
  #card-field {
    min-height: 45%;
  }
  #effects-field {
    min-height: 55%;
    overflow: auto;
  }
  #enemy-field {
    min-height: 70%;
  }
  #gamerlist {
    max-height: 100%;
  }
  .play-information {
    padding: 2rem 0 0 0;
  }
  .gamer-round-data {
    overflow-y: hidden;
  }
}
@media screen and (orientation: portrait) {
}
@media screen and (max-width: 640px) {
}
@media (min-width: 576px) {
  .gamer-round-data {
    max-width: unset !important;
  }
}
@media screen and (max-width: 450px) {
  .list-group-item {
    padding: 2px !important;
    padding-left: 4px !important;
    padding-right: 2px !important;
  }
  .data-wrap {
    padding: 0 !important;
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  #nav {
    display: none;
  }
  #view {
    height: 100vh;
  }
  #playground {
    max-height: 100vh;
    height: 100vh;
  }
  #main-data {
    font-size: 12px;
    margin-top: 0px !important;
  }
  .badge h4 {
    font-size: 18px;
  }
  .card-image {
    height: 0;
  }
}
@media screen and (max-width: 1100px) and (orientation: landscape) {
  #nav {
    display: none;
  }
  #view {
    height: 100vh;
  }
  #playground {
    max-height: 100vh;
    height: 100vh;
  }
}
@media (orientation: portrait) {
  #nav {
    display: none;
  }
  #view {
    height: 100vh;
  }
  #playground {
    max-height: 100vh;
    height: 100vh;
  }
}
@media screen and (max-width: 320px) and (orientation: portrait) {
  .card-box {
    min-width: 132px;
  }

  #playground {
    padding-top: 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2.4fr 2fr 1.2fr;
  }
  #gamerlist h3 {
    font-size: 16px;
  }
  .play-information {
    /* margin: 0; */
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 0;
  }
  .main-side {
    max-height: unset;
  }

  .play-information h4 {
    font-size: 14px;
    margin-top: 4px !important;
    margin-bottom: 4px !important;
  }
  .data-wrap button {
    font-size: 12px !important;
    margin-top: 2px !important;
    font-weight: bold;
  }
  .gray-block {
    height: 0;
  }
  .card-head h6 {
    font-size: 14px;
    margin-bottom: 8px !important;
    margin-top: 8px !important;
  }
  #effects-head {
    height: 40px;
  }
  #effects-head h6 {
    margin: 0 !important;
  }
  .card-text {
    padding-top: 2px;
    line-height: 16px;
    margin-bottom: 0 !important;
  }
  ul.list-group {
    overflow-x: hidden;
  }
  #effects-field #effectslist ul {
    padding-top: 40px;
  }
  h3.card-text {
    font-size: 22px;
  }
}
</style>
