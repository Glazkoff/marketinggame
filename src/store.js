import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gamerName: "",
    socketId: "",
    isOwner: false,
    isStart: true,
    isFinish: false,
    stepDone: false,
    roomId: -1,
    roomParams: {
      month: 3,
      money: 100000,
      organicCount: 7500,
      contextCount: 9500,
      socialCount: 1500,
      smmCount: 1200,
      straightCount: 300,
      organicCoef: 0.1,
      contextCoef: 0.07,
      socialsCoef: 0.25,
      smmCoef: 0.05,
      straightCoef: 0.1,
      conversion: 0.3
    },
    connections: [],
    messages: [],
    gamers: [],
    winners: {},
    gameEvent: null
  },
  getters: {},
  mutations: {
    setName(state, name) {
      state.gamerName = name;
    },
    setOwner(state) {
      state.isOwner = true;
    },
    // setRoomId(state, number) {
    //   state.roomId = number
    // },
    setRoomParams(state, { month }) {
      state.roomParams.month = month;
    },
    doStep(state) {
      state.stepDone = true;
    },
    SOCKET_doNextStep(state) {
      state.stepDone = false;
      for (const gamer of state.gamers) {
        gamer.isattacker = false;
      }
    },
    SOCKET_setRoomNumber(state, roomId) {
      state.roomId = roomId;
    },
    SOCKET_addMessage(state, newMessage) {
      state.messages.push(newMessage);
      let messList = document.querySelector("#messageField");
      if (messList !== null) {
        messList.scrollTop = messList.scrollHeight;
      }
    },
    SOCKET_setStartGame(state, roomParams) {
      state.isStart = false;
      // console.log("ПРИШЛИ ПАРАМЕТРЫ КОМНАТЫ");
      // console.log(roomParams);
      state.roomParams = roomParams;
    },
    SOCKET_setGamers(state, obj) {
      state.gamers = [...obj.gamers];
    },
    SOCKET_changeGamerStatus(state, id) {
      for (const gamer of state.gamers) {
        if (gamer.id == id) {
          gamer.isattacker = true;
          break;
        }
      }
    },
    SOCKET_finish(state, winnersObj) {
      state.isFinish = true;
      state.winners = Object.assign(winnersObj);
    },
    SOCKET_setGameEvent(state, eventObj) {
      state.gameEvent = {};
      state.gameEvent = Object.assign(eventObj);
    }
  },
  actions: {
    SOCKET_gameEvent(state, eventObj) {
      console.log(eventObj);
      state.commit("SOCKET_setGameEvent", eventObj);
      setTimeout(() => {
        state.commit("SOCKET_setGameEvent", {});
      }, 7000);
    }
  }
});
