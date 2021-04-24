<template>
  <div id="app">
    <Offline
      @detected-condition="amIOnline"
      online-class="online"
      offline-class="offline"
    >
      <template v-slot:[onlineSlot] :slot-name="onlineSlot">
        <div class="centered-content text-center">
          <img src="./assets/cloud-off.svg" alt="" height="96" width="96" />
          <h1 class="text-light">Офлайн!</h1>
          <h3 class="text-light">
            Дождитесь, когда у вас снова будет доступ в интернет
          </h3>
        </div>
      </template>
    </Offline>

    <Toasts></Toasts>
    <div id="nav" :class="{ 'admin-show': adminNav, 'admin-hide': !adminNav }">
      <router-link to="/">Вход</router-link>|
      <router-link to="/choose">Создать игру</router-link>|
      <router-link to="/main">Главный экран</router-link>|
      <router-link to="/about">Об игре</router-link>
    </div>
    <div id="view" :class="{ 'full-screen': !adminNav }">
      <transition name="slide" mode="out-in" appear>
        <router-view></router-view>
      </transition>
      
      <div 
        v-if="this.$route.path == '/choose' && !showRate" 
        class="bg-info h-100 btn-rate d-flex cursour-pointer" 
        @click="showRate = !showRate">
        <img
          width="32px"
          class="align-self-center"
          src="./assets/rating.svg" 
          alt="Обновить"> 
        <span class="align-self-center text-white font-weight-bold font-size-large">
          >
        </span>
      </div>
      <transition name="rate">
        <div class="rate-container overflow-auto h-100" v-if="this.$route.path == '/choose' && showRate">
          <div class="mt-4" v-if="loadRate">
            <div class="d-flex justify-content-center">
              <h1 class="h1 text-info">Рейтинг пользователей</h1> 
              <img @click="updateRate()"
                width="32px"
                class="mr-2 ml-2 btn btn-outline-info rounded-circle align-self-center p-0"
                src="./assets/updateRate.svg" 
                alt="Обновить"> 
              <img @click="showRate = !showRate"
                width="32px"
                class="mr-2 btn btn-outline-info rounded-circle align-self-center p-0"
                src="./assets/closeRate.svg" 
                alt="Обновить"> 
            </div>
            <div class="rate-header d-flex mt-1 pt-2 pb-2 pr-4 bg-info font-weight-bold text-white">
              <span class="col-2">Место</span>
              <span class="col-10">Имя игрока</span>
            </div>
            <div class="mt-1 pt-2 border-top">
              <div 
                class="rate-raw d-flex p-2 btn-outline-info" 
                v-for="item in rate" 
                :key="item.user_id"
                @click="getUserRate(item.user_id)">
                <span class="col-2">
                  <img width="32px" src="./assets/1.svg" v-if="item.id + 1 == 1" alt="First">
                  <img width="32px" src="./assets/2.svg" v-else-if="item.id + 1 == 2" alt="Second">
                  <img width="32px" src="./assets/3.svg" v-else-if="item.id + 1 == 3" alt="Third">
                  <img width="32px" src="./assets/noplacerate.svg" v-else alt="NPR">
                  {{item.id + 1}}
                </span>
                <span class="col-10">
                  {{item.name}}
                </span>
              </div>
            </div>
          </div>
          <div class="loader-wrap" v-else-if="!loadRate">
            <Loader></Loader>
          </div>
        </div>
      </transition>
      <transition name="popup" mode="in-out">
        <div 
          class="popup-screen"
          v-if="userRate">
            <div class="popup p-2">
              <div class="d-flex justify-content-between align-self-center">
                <img width="32px"  class="cp" 
                  src="./assets/update.svg" alt="">
                <div class="h1 text-center " id="name">
                  {{userState.name}}
                </div>
                <img 
                  @click="userRate = !userRate" class="cp"
                  width="32px" src="./assets/close.svg" alt="">
              </div>
              <div class="popup-body">
                <div class="statics w-100 border rounded-lg d-flex">
                  <div :style="'width:' + 
                    userState.countFirst / userState.countGames * 100
                   + '%;'" class="bg-success"></div>
                  <div :style="'width:' + 
                    userState.countSecond / userState.countGames * 100
                   + '%;'" class="bg-primary"></div>
                  <div :style="'width:' + 
                    userState.countThird / userState.countGames * 100
                   + '%;'" class="bg-warning"></div>
                  <div :style="'width:' + 
                    (userState.countGames - (
                      userState.countFirst +
                      userState.countSecond + 
                      userState.countThird
                    )) / userState.countGames * 100
                   + '%;'" class="bg-danger"></div>
                </div>
                <div class="legend-rate ml-2">
                  <div class="border-bottom">
                    <div style="height: 10px; width: 10px;" class="bg-success rounded-circle d-inline-block"> </div> <span>Первых мест: {{userState.countFirst}}</span>
                  </div>
                  <div class="border-bottom">
                    <div style="height: 10px; width: 10px;" class="bg-primary rounded-circle d-inline-block"> </div> <span>Вторых мест: {{userState.countSecond}}</span>
                  </div>
                  <div class="border-bottom">
                    <div style="height: 10px; width: 10px;" class="bg-warning rounded-circle d-inline-block"> </div> <span>Третьих мест: {{userState.countThird}}</span>
                  </div>
                  <div class="border-bottom">
                    <div style="height: 10px; width: 10px;" class="bg-secondary rounded-circle d-inline-block"> </div> <span>Без мест: {{
                        userState.countGames - (userState.countFirst + userState.countSecond + userState.countThird)
                      }}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </transition>
    </div>

  </div>
</template>
<script>
import Offline from "v-offline";
import jwt from "jsonwebtoken";
import Loader from "@/components/Loader.vue";
export default {
  data() {
    return {
      user: "",
      message: "",
      messages: [],
      rate: [],
      loadRate: false,
      userRate: false,
      userState: {
        name: '',
        countGames: 0,
        countFirst: 0,
        countSecond: 0,
        countThird: 0
      },
      showRate: false,
      onLine: null,
      onlineSlot: "online",
      offlineSlot: "offline"
    };
  },
  components: {
    Loader,
    Offline
  },
  sockets: {
    connect: function(connections) {
      this.$store.state.socketId = this.$socket.id;
      console.log("Сonnect");
      let token = this.$store.state.token;
      this.$socket.emit("authenticate", { token });
    },
    authenticated: function() {
      console.log("ПОДКЛЮЧЕНО!");
    },
    unauthorized: function(error) {
      console.error("НЕ АВТОРИЗОВАН!");
      if (
        error.data.type === "UnauthorizedError" ||
        error.data.code === "invalid_token"
      ) {
      }
    },
    setToast: function(toast) {
      switch (toast.type) {
        case "success":
          this.$toast.success(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "warning":
          this.$toast.warning(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "danger":
          this.$toast.error(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
        case "info":
        default:
          this.$toast.info(toast.body, {
            showProgress: true,
            timeOut: toast.timeOut
          });
          break;
      }
    },
    askIfInTheRoom() {
      if (this.$route.path === "/main" && this.$store.state.roomId !== -1) {
        this.$socket.emit("subscribeRoom", this.$store.state.roomId, true);
      }
    }
  },
  beforeCreate() {
    let decode = jwt.decode(this.$store.state.token);
    if (decode) {
      if (decode.admin) {
        this.$store.commit("SET_USER_ID", decode.id);
        this.$store.commit("changeAdminStatus");
      }
      let name = decode.name;
      this.$store.commit("SET_NAME", name);
      if (this.$store.state.gamerName) {
        this.$socket.emit("setName", this.$store.state.gamerName);
      }
      if (this.$store.state.roomId) {
        this.$socket.emit("setRoom", this.$store.state.roomId);
      }
      console.log("SEND RESRESH!");
      this.$socket.emit(
        "refreshSocketID",
        this.$store.state.socketId,
        this.$store.state.roomId
      );
    }
  },
  methods: {
    changeAdminNav() {
      this.$store.commit("changeAdminNav");
    },
    amIOnline(e) {
      this.onLine = e;
    },
    updateRate() {
      this.$http.get('/api/users/rate')
      .then(res => {
        this.rate = res.data
        this.loadRate = true
      })
    },
    getUserRate(userId) {
      this.userRate = true
      userId = parseInt(userId)
      let user = this.rate.find(a => a.user_id === userId)
      this.userState.name = user.name
      this.userState.countGames = user.count
      this.userState.countFirst = user['1']
      this.userState.countSecond = user['2']
      this.userState.countThird = user['3']
    }
  },
  computed: {
    adminNav() {
      return this.$store.state.adminNav;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    }
  },
  mounted() {

    this.updateRate()

    const token = localStorage.getItem("user-token");
    if (token) {
      this.$http.defaults.headers.common["Authorization"] = token;
    }
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // Если ошибка авторизации на сервере, выкинуть пользователя
          this.$store.dispatch("AUTH_LOGOUT");
          this.$router.push("/login");
        }
        throw err;
      });
    });
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
  }
};
</script>
<style>
.centered-content {
  margin: auto;
}
.offline {
  background-color: #fc9842;
  background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  display: flex;
}
.online {
  display: none;
}
body {
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0;
  margin: 0;
  height: 100vh;
}
#app {
  height: 100%;
  position: relative;
}
#nav {
  box-sizing: border-box;
  padding: 8px;
  height: 40px;

  width: 100%;
}
#view {
  height: calc(100vh - 40px);
}
.full-screen {
  height: calc(100vh - 00px) !important;
  max-height: calc(100vh - 00px) !important;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}

.slide-leave-active {
  transform: translateX(-110%);
}
.slide-enter {
  transform: translateX(110%);
}
.rate-enter-active,
.rate-leave-active {
  transition: all 0.2s;
}

.slide-leave-active {
  transform: translateX(-110%);
}
.rate-enter {
  transform: translateX(110%);
}
.admin-btn {
  color: #fff;
  background-color: #007bff;
  border: none;
  position: fixed;
  top: 0;
  right: 0;
  height: 40px;
  box-sizing: border-box;
  padding: 5px 10px;
  font-size: 1.4rem;
  z-index: 1000;
}
.admin-btn[disabled] {
  background-color: #6bb3ff;
  visibility: hidden;
}
.admin-show {
  position: relative;
}
.admin-hide {
  position: static;
  position: fixed;
  top: -36px;
  left: 0;
}
.loader-wrap {
  width: 100%;
  display: flex;
}
.loader-wrap > * {
  margin: auto;
}
.toast-container {
  top: 2rem !important;
}
@media (max-width: 930px) {
  .toast-container {
    right: 1rem !important;
    width: calc(100vw - 2rem) !important;
    min-width: calc(100vw - 2rem) !important;
  }
  .toast {
    max-width: calc(100vw - 2rem) !important;
  }
}
@media screen and (max-height: 600px), (max-width: 500px){
  body{
    overflow-y: scroll;
  }
}

.rate-container {
  position: absolute;
  top: -70px;
  left: 0;
  background-color: rgb(255, 255, 255);
  border-right: 1px solid #6c757d;
}

.btn-rate {
  position: absolute;
  left: 0; 
  top: -48px;
  cursor: pointer;
}

.rate-raw {
  cursor: pointer;
}

.col-rate {
  flex-basis: auto;
}

.popup-screen {
  position: fixed;
  width: 100vw;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, .5);
  padding: 20% 20%;
}

.popup {
  background: rgb(255, 255, 255);
}

.popup img {
  cursor: pointer;
}
.cp {
  cursor: pointer;
}

.statics div {
  height: 6px;
}

</style>
