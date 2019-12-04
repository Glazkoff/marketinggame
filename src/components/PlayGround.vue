<template>
  <div id="playground">
    <div id="play-field">
      <div
        class="play-information"
        :class="{'dragstart': dragstart, 'dragover': dragover}"
        @dragenter.prevent="dragov"
        @dragover.prevent
        @drop.prevent="altdrop"
        @dragleave="dragleave"
      >
        <transition name="cardwrap">
          <div class="event-box w-100 h-100" v-if="isEvent && !isStart">
            <div class="container h-100">
              <div class="row mt-2">
                <div class="col-12">
                  <h4 class="text-center">
                    Cобытие!
                    {{event.title}}
                  </h4>
                  <hr />
                </div>
              </div>

              <div class="row h-25">
                <div class="col-12 h-100">
                  <div class="gray-block"></div>
                </div>
              </div>
              <div class="row">
                <div class="col-8 mt-2 offset-2">
                  <p class="text-center">{{event.description}}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-6 offset-3">
                  <button
                    style="display: block"
                    class="btn btn-primary w-100"
                    @click="closeEvent"
                  >Продолжить</button>
                </div>
              </div>
            </div>
          </div>
        </transition>
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
                  @click="startGame"
                >Начать</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="owner-start-game d-flex align-content-between flex-wrap h-100"
          v-if="!isOwner & isStart"
        >
          <div class="container text-centre h-100">
            <div class="row h-100 justify-content-center align-items-center">
              <div class="col-11 text-center">
                <h1>Ожидайте начала игры</h1>
                <p>
                  Когда все игроки подключатся к комнате, создатель комнаты запустит
                  <mark>первый раунд</mark> в созданной комнате.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="gamer-round-data container h-100" v-if="!isStart">
          <div class="row h-100 justify-content-center align-items-start">
            <div class="col-12">
              <h4 class="mt-3">Сейчас у вас ({{gamerName}}) есть:</h4>
              <ul class="list-group col-12 offset-0 mt-3 w-100" id="main-data">
                <ul class="list-group list-group-horizontal w-100">
                  <li
                  class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center col-6"
                  style="border-right: 1px solid rgba(0, 0, 0, 0.125); z-index: 20"
                >
                  Общий бюджет
                  <span class="badge badge-primary badge-pill">
                    <h4>{{gamerParams.money}} ₽</h4>
                  </span>
                </li>
                <li
                  class="list-group-item list-group-item-action active d-flex justify-content-between align-items-center col-6"
                >
                  Месяц
                  <span class="badge badge-primary badge-pill">
                    <h4>{{firstRoomParams.month - gamerParams.month+1}} из
                      {{firstRoomParams.month}}</h4>
                  </span>
                </li>
                </ul>
                
                <ul class="list-group list-group-horizontal w-100">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Трафик:
                    <span class="badge badge-primary badge-pill">
                      {{Math.ceil(gamerParams.organicCount+gamerParams.contextCount+gamerParams.socialsCount+gamerParams.smmCount+gamerParams.straightCount)}} чел.
                    </span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Клиенты:
                    <span class="badge badge-primary badge-pill">{{Math.ceil(gamerParams.clients)}} чел.</span>
                  </li>
                </ul>
                
                <ul class="list-group list-group-horizontal w-100">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Конверсия:
                    <span
                      class="badge badge-primary badge-pill"
                    >{{gamerParams.conversion*100}} %</span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Товарооборот:
                    <span
                      class="badge badge-primary badge-pill"
                    >{{Math.ceil(gamerParams.commCircul)}} ₽</span>
                  </li>
                  
                </ul>
                <ul class="list-group list-group-horizontal w-100">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Средний чек:
                    <span class="badge badge-primary badge-pill">
                      {{Math.ceil(gamerParams.averageCheck)}} ₽
                    </span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center w-50"
                  >
                    Реальная стоимость привлечения:
                    <span class="badge badge-primary badge-pill">{{Math.ceil(gamerParams.realCostAttract)}} ₽</span>
                  </li>
                </ul>
                <ul class="list-group list-group-horizontal w-100">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center col-4"
                  >
                    Затраты:
                    <span class="badge badge-primary badge-pill">
                      {{Math.ceil(gamerParams.realCostAttract * gamerParams.clients)}} ₽
                    </span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center col-4"
                  >
                    Доход:
                    <span class="badge badge-primary badge-pill">{{Math.ceil(gamerParams.commCircul - gamerParams.realCostAttract * gamerParams.clients)}} ₽</span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center col-4"
                  >
                    Доход на клиента:
                    <span class="badge badge-primary badge-pill">{{Math.ceil((gamerParams.commCircul - gamerParams.realCostAttract * gamerParams.clients)/gamerParams.clients) }} ₽</span>
                  </li>
                </ul>
                <!-- <li class="list-group-item d-flex justify-content-between align-items-center">
                  Прочие параметры
                  <span class="badge badge-primary badge-pill">{{animatedNumber}}</span>
                </li> -->
              </ul>
              <button class="btn btn-success mt-2 w-100 pr-2 btn-block" :disabled="isStart" @click="makeStep(1)">Завершить ход</button>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <div
      id="card-field"
      style="transition: all 5s"
      :style="{overflowX: stepDone ? 'hidden' : 'scroll'}"
    >
      <transition mode="out-in" name="fade" type="transition">
        <div v-if="stepDone" class="dark-cover h-100 w-100" draggable="false">
          <div class="container h-100 w-100">
            <div class="row h-100 justify-content-md-center align-content-center">
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
        mode="out-in"
        name="cardwrap"
        id="card-wrap"
        tag="div"
        type="transition"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          class="card-box"
          
          :draggable="card.cost<=gamerParams.money"
          @dragstart.self="altdragstart"
          v-for="(card, count) in cards"
          :key="count"
          @dragend="altdragend"
          v-if="!isStart"
        >
          <div class="card-head">
            <h6 class="card-title text-center pl-2 pr-2 mb-1">{{card.title}}</h6>
          </div>

          <div class="card-image"></div>
          <small class="card-text text-center">{{card.text}}</small>
          <h3 class="card-text text-center">{{card.cost}} ₽</h3>
          <button
            class="btn btn-dark pl-2"
            @click="dropFromBtn(count)"
            :disabled="stepDone||(card.cost>gamerParams.money)"
            
          >Использовать</button>
        </div>
      </transition-group>
    </div>

    <div id="enemy-field">
      <GamerList></GamerList>
    </div>
    <div id="effects-field">
      <Effects></Effects>
    </div>
  </div>
</template>

<script>
import GamerList from "@/components/GamerList.vue";
import Effects from "@/components/Effects.vue";
import { TweenMax, Power2, TimelineLite, TweenLite } from "gsap/TweenMax";

export default {
  name: "PlayGround",
  components: {
    GamerList,
    Effects
  },
  created() {
    this.cards = this.shuffle(this.cards);
  },
  mounted() {},
  data() {
    return {
      usedCards: [],
      clientsRendered: true,
      dragstart: false,
      dragover: false,
      dragnode: undefined,
      params: {},
      refreshCards: [],
      cards: [
        {
          id: 1,
          title: "Нанять SMM-менеджера",
          text: "Описание карточки, описание карточки",
          cost: 55000
        },
        {
          id: 2,
          title: "Заказать SEO-оптимизацию",
          text: "Описание карточки, описание карточки",
          cost: 50000
        },
        {
          id: 3,
          title: "Улучшение юзабилити",
          text: "Описание карточки, описание карточки",
          cost: 20000
        },
        {
          id: 4,
          title: "Реклама в соцсетях",
          text: "Описание карточки, описание карточки",
          cost: 25000
        },
        {
          id: 5,
          title: "PR-компания компании",
          text: "Описание карточки, описание карточки",
          cost: 30000
        },
        {
          id: 6,
          title: "Контекстная рекламная компания",
          text: "Описание карточки, описание карточки",
          cost: 35000
        },
        {
          id: 7,
          title: "Размещение информации в справочниках",
          text: "Описание карточки, описание карточки",
          cost: 20000
        }
      ],
      number: 0,
      tweenedNumber: 0
    };
  },
  mounted() {
    this.number = this.$store.state.roomParams.money;
  },
  watch: {
    number: function(newValue) {
      TweenLite.to(this.$data, 1, { tweenedNumber: newValue });
    }
  },
  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
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
      return this.$store.state.isStart;
    },
    gamerName() {
      return this.$store.state.gamerName;
    },
    gamerParams() {
      let a = this.$store.state.roomParams;
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
    }
  },
  methods: {
    closeEvent() {
      this.$store.commit("SOCKET_setGameEvent", {});
    },
    shuffle(arra1) {
      let ctr = arra1.length,
        temp,
        index;
      while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
      }
      return arra1;
    },
    makeStep() {
      this.$store.commit("doStep"); // 
      this.$socket.emit("doStep", this.usedCards);
      // Одноразовые карточки (индексы):
      let oneOffCards = [3, 7]      
      for (const cardIndex of oneOffCards) {
        let usedIndex = this.usedCards.findIndex(elem=>elem===cardIndex);
        console.log('ОДНОРАЗОВЫЕ КАРТОЧКИ');
        if (usedIndex !== -1) {

          let spliceIndex = this.refreshCards.findIndex(elem=>elem.id===cardIndex)
          this.refreshCards.splice(spliceIndex, 1)
        }
      }
      this.usedCards = [];
      this.cards=[...this.refreshCards];
      // let change = -this.cards[this.cards.findIndex(elem=>{return elem.id==index})].cost;
      // this.$store.commit("changeMoney", change);
      console.log('-----Index of cards------');
      console.log(this.usedCards);
      

    },
    dropFromBtn(index) {
      this.usedCards.push(this.cards[index].id);
      // this.makeStep(this.cards[index].id);
      let change = -this.cards[index].cost;
      this.$store.commit("changeMoney", change);
        this.cards.splice(index, 1);
    },
    startGame() {
      console.log("Стейт комнаты");
      let a = Object.assign(this.$store.state.roomParams);
      console.log(a);
      this.refreshCards = [...this.cards];
      this.$socket.emit("startGame", a);
      this.$store.commit("SOCKET_calcAllParams");
      this.$store.state.isOwner = false;
      this.$store.state.isStart = false;
    },
    beforeEnter: function(el) {
      console.log("befenterhook");
    },
    enter: function(el) {
      console.log("enterhook");
    },
    leave: function(el) {
      el.style.opacity = 0;
      el.style.height = 0;
      console.log("leavehook");
    },
    altdrop(e) {
      e.preventDefault();
      console.log("drop");
      this.dragovered = false;
      this.dragstart = false;
      if (typeof this.dragnode != "undefined") {
        if (this.dragnode.parentNode.id == "card-wrap") {
          let i = 0;
          for (const iterator of this.dragnode.parentNode.childNodes) {
            if (iterator == this.dragnode) {
              break;
            }
            i++;
          }
          // this.makeStep(this.cards[i].id);
          let change = -this.cards[i].cost;
          this.$store.commit("changeMoney", change);
          this.cards.splice(i, 1);
        }
      }
      this.dragnode = undefined;
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
    }
  }
};
</script>

<style>
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

/* .cardwrap-enter-active,
.cardwrap-leave-active {
  transition: all 1s;
}
.cardwrap-enter, .cardwrap-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.cardwrap-enter-to,
.cardwrap-leave {
  opacity: 1;
} */
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
  padding-top: 64px;
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
  /* transition: all 0.5s;v -   */
}

.card-box button {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.card-head {
  /* padding-top: 4px; */
  /* display: block; */
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
  position: relative;
  /* padding-left: 3px; */
  /* padding-right: 3px; */
  /* max-height: 100%; */
  /* overflow-y: hidden; */
  transition: all 0.4s;
  /* width: 160px; */
  max-width: 220px;
  width: 30%;
  min-width: 168px;
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
  /* min-height: 60px; */
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
  min-height: 100%;
  max-height: 100%;
  display: flex;
}

#card-field::-webkit-scrollbar {
  width: 4px;
  height: 8px;
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
</style>
