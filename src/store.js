import Vue from "vue";
import Vuex from "vuex";
import router from "../src/router";
import axios from "axios";
import jwt from "jsonwebtoken";

const apiUrl = "/api";

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
    ownerId: -1,
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
    completedSessions: [],
    cards: [],
    oneOffCardList: [],
    admin: {
      rooms: [],
      reviews: [],
      usersInRoom: [],
      globalConfig: {},
      users: [],
      usersCount: 1,
      cards: [],
      events: []
    }
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
      }
    },
    SET_ROOM_ID: (state, roomId) => {
      state.roomId = roomId;
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
      state.ownerId = res.data.owner_id;
      state.isFinish = res.data.is_finished;
      state.winners = res.data.winners;
      if (res.data.gamers !== undefined) {
        state.gamers = [...res.data.gamers.gamers];
      }
      if (res.data.effects !== undefined) {
        res.data.effects.forEach(el => {
          if (el.step === el.duration) {
            state.completedSessions.push(el.id);
          }
        });
        state.activeEffects = [...res.data.effects];
      }
      let decode = await jwt.decode(state.token);
      if (res.data.owner_id === decode.id) {
        state.isOwner = true;
      }
    },
    SOCKET_SET_GAME_START(state, boolean) {
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
      if (state.steps.length < state.firstRoomParams.month) {
        let monthArr = [];
        for (var val of data) {
          monthArr.push(val);
        }
        state.steps.push(monthArr);
      }
    },
    SOCKET_finish(state, winnersObj) {
      state.isFinish = true;
      state.winners = Object.assign(winnersObj);
    },
    SOCKET_setGamers(state, obj) {
      state.gamers = obj.gamers;
    },
    SOCKET_setToast(state, toast) {
    },
    SOCKET_setEffects(state, effects) {
      effects.forEach(el => {
        if (el.step === el.duration) {
          state.completedSessions.push(el.id);
        }
      });
      state.activeEffects = [...effects];
    },

    // Выкинуть пользователя с главного экрана
    SOCKET_kickUser() {
      router.push("/choose").catch(() => {
      });
    },
    /* *********************************** */
    resetData(state) {
      console.log("RESET!");
      state.connections = [];
      state.messages = [];
      state.gamers = [];
      state.winners = {};
      state.activeEffects = [];
      state.completedSessions = [];
      state.gameEvent = null;
      state.isOwner = false;
      state.ownerId = -1;
      state.isStart = true;
      state.isFinish = false;
      state.stepDone = false;
      state.roomId = -1;
      state.steps = [];
      state.havePrevData = false;
      // state.roomParams = Object.assign(state.firstRoomParams)
      state.roomParams = {};
      state.prevRoomParams = {};
      for (var key in state.firstRoomParams) {
        state.roomParams[key] = state.firstRoomParams[key];
      }
    },
    changeAdminNav(state) {
      state.adminNav = !state.adminNav;
    },
    changeAdminStatus(state) {
      state.isAdmin = !state.isAdmin;
    },
    SET_ADMIN_ROOMS(state, rooms) {
      state.admin.rooms = rooms;
    },
    SET_ADMIN_USERS_IN_ROOMS(state, users) {
      state.admin.usersInRoom = users;
    },
    SET_ADMIN_CONFIG(state, config) {
      state.admin.globalConfig = config;
    },
    SET_ADMIN_USERS(state, users) {
      state.admin.users = users;
    },
    SET_ADMIN_USERS_COUNT(state, usersCount) {
      state.admin.usersCount = usersCount.count;
    },
    SET_ADMIN_CARDS(state, cards) {
      state.admin.cards = cards;
    },
    SET_CARDS(state, cards) {
      state.cards = cards;
    },
    SPLICE_CARD(state, cardId) {
      let ind = state.cards.findIndex(el => +el.id === +cardId);
      state.cards.splice(ind, 1);
    },
    SET_ONEOFF_CARD_LIST(state, oneOffCardList) {
      state.oneOffCardList = [];
      oneOffCardList.forEach(el => {
        state.oneOffCardList.push(el.card_id);
      });
    },
    SET_ADMIN_CARD_DESCRIPTION(state, data) {
      let cardIndex = state.admin.cards.findIndex(el => +el.id === +data.id);
      state.admin.cards[cardIndex].coefs = data.coefs;
      state.admin.cards[cardIndex].text = data.text;
      state.admin.cards[cardIndex].templateText = data.templateText;
      state.admin.cards[cardIndex].title = data.title;
    },
    SET_ADMIN_EVENTS(state, events) {
      state.admin.events = events;
    },
    SET_ADMIN_EVENT_DESCRIPTION(state, data) {
      let eventIndex = state.admin.events.findIndex(el => +el.id === +data.id);
      if (eventIndex !== -1) {
        state.admin.events[eventIndex].description = data.description;
        state.admin.events[eventIndex].title = data.title;
      }
    },
    SET_ADMIN_REVIEWS(state, reviews) {
      state.admin.reviews = reviews;
    },
    DELETE_REVIEW(state, id) {
      let index = state.admin.reviews.findIndex(el => el.review_id === id);
      state.admin.reviews.splice(index, 1);
    }
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
            url: `${apiUrl}/auth/login`,
            data: user,
            method: "POST"
          })
            .then(
              resp => {
                const token = resp.data.token;
                localStorage.setItem("user-token", token);
                axios.defaults.headers.common["Authorization"] = token;
                context.commit("AUTH_SUCCESS", token);
                there._vm.$socket.disconnect();
                there._vm.$socket.open();
                resolve(token);
              },
              error => {
                context.commit("AUTH_ERROR");
                delete axios.defaults.headers.common["Authorization"];
                localStorage.removeItem("user-token"); // если запрос ошибочен, удаление токена в localstorage при возможности
                reject(error);
              }
            )
            .catch(() => {
              console.log("ОШИБКА СЕРВЕРА");
            });
        });
        return prom;
      } catch (err) {

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
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    TRY_RESET_ROOM: function (state) {
      let there = this;
      return new Promise((resolve, reject) => {
        // FIXME roomId
        axios({
          url: `${apiUrl}/rooms/reset`,
          method: "GET"
        })
          .then(res => {
            state.commit("SET_GAME_PARAMS", res);
            there._vm.$socket.emit("subscribeRoom", res.data.room_id, (res.data.first_params.month !== res.data.gamer_room_params.month || !res.data.is_start));
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    SET_ROOM_PARAMS: function (state, res) {
      state.commit("SET_GAME_PARAMS", res);
    },
    GET_CARDS: function (state, res) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/cards`,
          method: "GET"
        })
          .then(res => {
            state.commit("SET_CARDS", res.data);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ONEOFF_CARD_LIST: function (state, res) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/cards/oneoff`,
          method: "GET"
        })
          .then(res => {
            state.commit("SET_ONEOFF_CARD_LIST", res.data);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_ROOMS: function name(state, res) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/rooms`,
          method: "GET"
        })
          .then(res => {
            state.commit("SET_ADMIN_ROOMS", res.data);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_USERS_IN_ROOMS(state, roomId) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/rooms/${roomId}/users`,
          method: "GET"
        })
          .then(res => {
            state.commit("SET_ADMIN_USERS_IN_ROOMS", res.data);
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_ROOM_STATE(state, roomId) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/rooms/${roomId}`,
          method: "GET"
        })
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_CONFIG(state, res) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/config`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_CONFIG", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_CONFIG(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/config`,
          method: "POST",
          data: {
            event_chance: data.event_chance
          }
        })
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_USERS(state, page) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/users/list/${page}`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_USERS", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_USERS_COUNT(state) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/users/count`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_USERS_COUNT", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    DELETE_ADMIN_USER(state, userId) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/users/id/${userId}`,
          method: "DELETE"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_CARDS(state, res) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_CARDS", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_CARDS(state) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards`,
          method: "POST"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    DELETE_ADMIN_CARDS(state, cardId) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${cardId}`,
          method: "DELETE"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_CARD_PARAMS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${data.id}`,
          method: "POST",
          data
        })
          .then(resp => {
            // state.commit("SET_ADMIN_CARD_PARAMS", data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    PUT_ADMIN_CARDS_DRAFT(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${data.cardId}/is_draft`,
          method: "PUT",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_VOID_CARD_PARAMS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${data.id}`,
          method: "POST",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_CARD_ONEOFF(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${data.id}/oneoff`,
          method: "POST",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    PUT_ADMIN_CARD_DESCRIPTION(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/cards/${data.id}/description`,
          method: "PUT",
          data
        })
          .then(resp => {
            state.commit("SET_ADMIN_CARD_DESCRIPTION", data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_EVENTS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_EVENTS", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_EVENTS(state) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events`,
          method: "POST"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    DELETE_ADMIN_EVENTS(state, eventId) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events/${eventId}`,
          method: "DELETE"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    PUT_ADMIN_EVENTS_DRAFT(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events/${data.eventId}/is_draft`,
          method: "PUT",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_EVENT_PARAMS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events/${data.id}`,
          method: "POST",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_ADMIN_VOID_EVENT_PARAMS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events/${data.id}`,
          method: "POST",
          data
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    PUT_ADMIN_EVENT_DESCRIPTION(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/admin/events/${data.id}/description`,
          method: "PUT",
          data
        })
          .then(resp => {
            state.commit("SET_ADMIN_EVENT_DESCRIPTION", data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    POST_REVIEW(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/reviews`,
          method: "POST",
          data
        })
          .then(resp => {
            // state.commit("SET_ADMIN_EVENT_DESCRIPTION", data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    GET_ADMIN_REVIEWS(state, data) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/reviews`,
          method: "GET"
        })
          .then(resp => {
            state.commit("SET_ADMIN_REVIEWS", resp.data);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    DELETE_ADMIN_REVIEW(state, id) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/reviews/${id}`,
          method: "DELETE"
        })
          .then(resp => {
            state.commit("DELETE_REVIEW", id);
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    SOCKET_SET_GAME_PARAMS(state, res) {
      console.warn("FROM SOCKET SETTING ROOM", res);
      state.commit("SET_GAME_PARAMS", res);
    },
    SOCKET_gameEvent(state, eventObj) {
      state.commit("SOCKET_setGameEvent", eventObj);
    },

    // Получить информацию о последней комнате
    GET_LAST_ROOM(state) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/personal/lastroom`,
          method: "GET"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // Послать запрос на выход из последней комнаты пользователя
    POST_GO_OUT_LAST_ROOM(state) {
      return new Promise((resolve, reject) => {
        axios({
          url: `${apiUrl}/personal/lastroom`,
          method: "DELETE"
        })
          .then(resp => {
            resolve(resp.data);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
export default store;
