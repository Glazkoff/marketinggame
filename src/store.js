import Vue from "vue";
import Vuex from "vuex";
// import router from '../src/router'
import axios from "axios";
import jwt from "jsonwebtoken";

const apiUrl = process.env.VUE_APP_API_URL || "http://localhost:3001/api";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("user-token") || "",
    status: "",
    prevRoomParams: {},
    roomParams: {},
    firstRoomParams: {},
    roomId: -1,
    userId: "",
    // Ниже необработанные данные
    gamerName: "",
    socketId: "",
    isAdmin: false,
    adminNav: false,
    isOwner: false,
    isStart: true,
    isFinish: false,
    stepDone: false,
    havePrevData: false,
    connections: [],
    messages: [],
    gamers: [],
    winners: {},
    activeEffects: [],
    steps: [],
    gameEvent: null,
    completedSessions: []
  },
  getters: {
    // Логическое значение - авторизован или нет
    isAuthenticated: state => !!state.token,
    // Статус авторизации
    authStatus: state => state.status
  },
  mutations: {
    // Изменение состояния на "Загрузка"
    AUTH_REQUEST: state => {
      state.status = "loading";
    },
    // Изменение состояния на "Успех"
    AUTH_SUCCESS: (state, token) => {
      state.status = "success";
      state.token = token;
    },
    // Изменение состояния на "Ошибка"
    AUTH_ERROR: state => {
      state.status = "error";
    },
    // Выход из учётной записи
    AUTH_LOGOUT: state => {
      state.token = "";
      state.status = "";
    },
    // Установить значение параметров комнаты
    SET_ROOM_PARAMS: (state, roomParams) => {
      if (JSON.stringify(state.roomParams) !== "{}") {
        for (var key in state.roomParams) {
          state.prevRoomParams[key] = state.roomParams[key];
        }
        state.roomParams = roomParams;
      } else {
        state.roomParams = roomParams;
        for (var k in roomParams) {
          state.prevRoomParams[k] = state.roomParams[k];
          state.firstRoomParams[k] = state.roomParams[k];
        }

        console.log("FIRST_ROOM_PARAMS: ", state.firstRoomParams);
        console.log("PREV_ROOM_PARAMS: ", state.prevRoomParams);
        console.log("ROOM_PARAMS: ", state.roomParams);
      }
    },
    SET_ROOM_ID: (state, roomId) => {
      state.roomId = roomId;
    },
    TRY_RESET_ROOM_PARAMS: state => {
      axios({
          url: `${apiUrl}/rooms/reset`,
          // data: user,
          method: "GET"
        })
        .then(
          resp => {
            console.log("TRY_RESET_ROOM_PARAMS");
          },
          err => {
            console.log(err);
          }
        )
        .catch(err => {
          console.log(err);
        });
    },
    SET_IS_START(state, isStart) {
      state.isStart = isStart;
    },
    SET_USER_ID(state, userId) {
      state.userId = userId;
    },
    SET_NAME(state, name) {
      state.gamerName = name;
    },
    async SET_GAME_PARAMS(state, res) {
      state.prevRoomParams = res.data.prev_room_params;
      state.roomParams = res.data.gamer_room_params;
      state.firstRoomParams = res.data.first_params;
      state.isStart = res.data.is_start;
      state.roomId = res.data.room_id;
      state.isFinish = res.data.is_finished;
      state.winners = res.data.winners;
      console.log('GAMERS:', res.data);
      if (res.data.gamers !== undefined) {
        state.gamers = [...res.data.gamers.gamers]
      }
      // state.gamers = res.data.gamers.gamers;
      console.log("SET_GAME_PARAMS: ", res);
      let decode = await jwt.decode(state.token);
      if (res.data.owner_id === decode.id) {
        state.isOwner = true;
      }
    },
    SOCKET_SET_GAME_START(state, boolean) {
      console.log("SET GAME START: ", boolean);
      state.isStart = boolean;
    },
    // Уточнить необходимость
    doAnimation(state, data) {
      state.roomParams.money++;
      state.roomParams.money--;
    },
    SOCKET_addMessage(state, newMessage) {
      state.messages.push(newMessage);
      let messList = document.querySelector("#messageField");
      if (messList !== null) {
        messList.scrollTop = messList.scrollHeight;
      }
    },
    // Связан с action
    SOCKET_setGameEvent(state, eventObj) {
      state.gameEvent = {};
      state.gameEvent = Object.assign(eventObj);
    },
    // TODO: исправить отметку о ходах игроков
    SOCKET_doNextStep(state) {
      state.stepDone = false;
      for (const gamer of state.gamers) {
        gamer.isattacker = false;
      }
    },
    changeMoney(state, change) {
      if (state.roomParams.money !== undefined) {
        state.roomParams.money += change;
      }
    },
    doStep(state) {
      state.stepDone = true;
    },
    //  TODO: Добавить взаимодействие с БД
    addSteps(state, data) {
      let monthArr = [];
      for (var val of data) {
        console.log(val);
        monthArr.push(val);
      }
      state.steps.push(monthArr);
    },
    SOCKET_finish(state, winnersObj) {
      state.isFinish = true;
      state.winners = Object.assign(winnersObj);
    },
    SOCKET_setGamers(state, obj) {
      state.gamers = [...obj.gamers]
      // state.prevRoomParams = {}
    },
    /* *********************************** */
    // resetData(state) {
    //   console.log('RESET!')
    //   state.connections = []
    //   state.messages = []
    //   state.gamers = []
    //   state.winners = {}
    //   state.activeEffects = []
    //   state.completedSessions = []
    //   state.gameEvent = null
    //   state.isOwner = false
    //   state.isStart = true
    //   state.isFinish = false
    //   state.stepDone = false
    //   state.roomId = -1
    //   state.steps = []
    //   state.havePrevData = false
    //   // state.roomParams = Object.assign(state.firstRoomParams)
    //   state.roomParams = {}
    //   state.prevRoomParams = {}
    //   for (var key in state.firstRoomParams) {
    //     state.roomParams[key] = state.firstRoomParams[key]
    //   }
    //   localStorage.removeItem('store')
    // },
    // SOCKET_resetData(state) {
    //   this.commit('resetData');
    // },
    // changeAdminNav(state) {
    //   state.adminNav = !state.adminNav
    // },
    // changeAdminStatus(state) {
    //   state.isAdmin = !state.isAdmin
    // },

    // copyData(state, data) {
    //   state.roomParams = {}
    //   for (var key in data) {
    //     state.roomParams[key] = data[key]
    //   }
    // },

    // setOwner(state) {
    //   state.isOwner = true
    // },
    // SOCKET_setOwner(state) {
    //   state.isOwner = true
    // },
    // notNotOwner(state) {
    //   state.isOwner = !state.isOwner
    //   state.isOwner = !state.isOwner
    // },
    // // setRoomId(state, number) {
    // //   state.roomId = number
    // // },
    // // setRoomParams(state, {
    // //   month
    // // }) {
    // //   console.log('MONTH STATE', month)
    // //   state.roomParams.month = month
    // // },

    // SOCKET_roomNotFound() {
    //   this.commit('resetData');
    //   router.push('/choose')
    // },

    // SOCKET_setRoomNumber(state, roomId) {
    //   state.roomId = roomId
    // },

    // setStateFromLS(state) {
    //   let stateLS = localStorage.getItem('store')
    //   console.log('store', stateLS)
    //   if (stateLS) {
    //     this.replaceState(
    //       Object.assign(state, JSON.parse(localStorage.getItem('store')))
    //     )
    //   }
    // },
    // SOCKET_kickUser() {
    //   router.push('/choose')
    // },
    // SOCKET_setStartGame(state, roomParams) {
    //   // console.log('SET START GAME');
    //   for (var key in state.roomParams) {
    //     state.prevRoomParams[key] = state.roomParams[key]
    //   }
    //   // console.log('~~~~~~~PREV~~~~~~')
    //   // console.log(state.prevRoomParams)
    //   if (state.isStart) {
    //     state.firstRoomParams.month = roomParams.month + 0
    //   }
    //   state.isStart = false
    //   // if (state.roomParams.month == undefined) {
    //   state.roomParams = roomParams
    //   // console.log('Тут')
    //   // console.log(state.roomParams)
    //   let clients = (state.roomParams.organicCount * state.roomParams.organicCoef + state.roomParams.contextCount * state.roomParams.contextCoef + state.roomParams.socialsCount * state.roomParams.socialsCoef + state.roomParams.smmCount * state.roomParams.smmCoef + state.roomParams.straightCount * state.roomParams.straightCoef) * state.roomParams.conversion
    //   state.roomParams.clients = Math.ceil(clients)
    //   // console.log('Клиенты: ' + clients)
    //   let commCircul = clients * state.roomParams.averageCheck
    //   state.roomParams.commCircul = commCircul
    //   // console.log('commCircul: ' + commCircul)
    //   let expenses = Math.ceil(clients * state.roomParams.realCostAttract)
    //   state.roomParams.expenses = expenses
    //   // console.log('expenses: ' + expenses)
    //   let result = commCircul - expenses
    //   // console.log('result: ' + result)
    //   let resultPerClient = result / clients
    //   state.roomParams.moneyPerClient = Math.ceil(resultPerClient)
    //   // }
    //   state.roomParams = roomParams
    // },

    // SOCKET_changeGamerStatus(state, id) {
    //   for (const gamer of state.gamers) {
    //     if (gamer.id === id) {
    //       gamer.isattacker = true
    //       break
    //     }
    //   }
    // },

    // SOCKET_calcAllParams(state) {
    //   let clients = (state.roomParams.organicCount * state.roomParams.organicCoef + state.roomParams.contextCount * state.roomParams.contextCoef + state.roomParams.socialsCount * state.roomParams.socialsCoef + state.roomParams.smmCount * state.roomParams.smmCoef + state.roomParams.straightCount * state.roomParams.straightCoef) * state.roomParams.conversion
    //   state.roomParams.clients = clients
    //   console.log('Клиенты: ' + clients)
    //   let commCircul = clients * state.roomParams.averageCheck
    //   state.roomParams.commCircul = commCircul
    //   console.log('commCircul: ' + commCircul)
    //   let expenses = clients * state.roomParams.realCostAttract
    //   state.roomParams.expenses = expenses
    //   console.log('expenses: ' + expenses)
    //   let result = commCircul - expenses
    //   console.log('result: ' + result)
    //   let resultPerClient = result / clients
    //   state.roomParams.moneyPerClient = resultPerClient
    //   // state.roomParams.money += result;
    // },
    // SOCKET_setEffects(state, effects) {
    //   effects.forEach(el => {
    //     if (el.step === el.duration) {
    //       state.completedSessions.push(el.id)
    //     }
    //   })
    //   console.log(state.completedSessions)
    //   state.activeEffects = [...effects]
    // }
  },
  actions: {
    AUTH_REQUEST: function (context, user) {
      let prom;
      let there = this;
      try {
        prom = new Promise(function (resolve, reject) {
          // Promise используется для редиректа при входе в систему
          context.commit("AUTH_REQUEST");
          axios({
              url: `${apiUrl}/login`,
              data: user,
              method: "POST"
            })
            .then(
              resp => {
                console.log("AUTHORIZATION", resp.data);
                const token = resp.data.token;
                localStorage.setItem("user-token", token);
                axios.defaults.headers.common["Authorization"] = token;
                context.commit("AUTH_SUCCESS", token);
                there._vm.$socket.disconnect();
                there._vm.$socket.open();
                resolve(token);
              },
              error => {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  console.log(error.response);
                  console.log(
                    `Ошибка сервера ${error.response.status} при ответе`
                  );
                } else if (error.request) {
                  console.log(
                    `Ошибка сервера ${error.request.status} при запросе`
                  );
                  console.log(error.request);
                } else {
                  console.log("Error", error.message);
                }
                console.log(error.config);
                context.commit("AUTH_ERROR");
                delete axios.defaults.headers.common["Authorization"];
                localStorage.removeItem("user-token"); // если запрос ошибочен, удаление токена в localstorage при возможности
                reject(error);
              }
            )
            .catch(error => {
              console.log("ОШИБКА СЕРВЕРА");
              console.log(error);
            });
        });
        return prom;
      } catch (err) {
        console.log(err);
      }
    },
    // Удаление всех данных при выходе из учётной записи
    AUTH_LOGOUT: function (context) {
      return new Promise(resolve => {
        context.commit("AUTH_LOGOUT");
        context.token = "";
        localStorage.removeItem("user-token"); // удаляем токен из localstorage
        delete axios.defaults.headers.common["Authorization"];
        this._vm.$socket.disconnect();
        resolve();
      });
    },
    LOAD_DEFAULT_ROOM: state => {
      return new Promise((resolve, reject) => {
        axios({
            url: `${apiUrl}/default/room`,
            method: "GET"
          })
          .then(res => {
            // console.log(res);
            resolve(res);
          })
          .catch(err => {
            // console.log('ошибка xзагрузки', err);
            reject(err);
          });
      });
    },
    TRY_RESET_ROOM: function (state) {
      let there = this;
      return new Promise((resolve, reject) => {
        axios({
            url: `${apiUrl}/rooms/reset`,
            method: "GET"
          })
          .then(res => {
            console.log("FROM RESSETTING ROOM", res);
            state.commit("SET_GAME_PARAMS", res);
            there._vm.$socket.emit("subscribeRoom", res.data.room_id);
            resolve(res);
          })
          .catch(err => {
            console.log("ошибка загрузки", err);
            reject(err);
          });
      });
    },
    SET_ROOM_PARAMS: function (state, res) {
      console.warn("FROM SETTING ROOM", res);
      state.commit("SET_GAME_PARAMS", res);
    },
    SOCKET_SET_GAME_PARAMS(state, res) {
      console.warn("FROM SOCKET SETTING ROOM", res);
      state.commit("SET_GAME_PARAMS", res);
    },
    SOCKET_gameEvent(state, eventObj) {
      console.log(eventObj);
      state.commit("SOCKET_setGameEvent", eventObj);
    }
  }
});
// store.subscribe((mutation, state) => {
//   // Сохраняем состояние как JSON-строку
//   localStorage.setItem('store', JSON.stringify(state))
// })
export default store;
