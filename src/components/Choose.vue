<template>
  <div class="card container col-lg-4 col-md-5 col-sm-10 col-xs-8 mt-5 p-4">
    <h1 class="mb-1">Привет, {{ gamerName }}!</h1>
    <a href="" @click.prevent="logout()">Выйти</a>
    <p>Выбери, как ты начнёшь игру</p>
    <div class="btn-group btn-group-toggle mb-3">
      <label
        class="btn btn-lg"
        :class="{
          'btn-outline-info': this.toggle != 'join',
          'btn-info': this.toggle == 'join'
        }"
      >
        <input
          type="radio"
          v-model="toggle"
          value="join"
          name="toggle"
          id="toggle1"
          autocomplete="off"
        />
        Присоединиться к комнате
      </label>
      <label
        class="btn btn-lg"
        :class="{
          'btn-outline-info': this.toggle != 'create',
          'btn-info': this.toggle == 'create'
        }"
        @click="loadRoomState()"
      >
        <input
          type="radio"
          v-model="toggle"
          value="create"
          name="toggle"
          id="toggle2"
          autocomplete="off"
        />Создать комнату
      </label>
    </div>
    <transition name="slideUp" mode="out-in" appear>
      <div class v-if="toggle == 'join'">
        <label for="name" class>Номер комнаты</label>
        <br />
        <input
          type="number"
          min="0"
          v-model.number="roomIdJoin"
          name="roomIdJoin"
          id="roomIdJoin"
          class="form-control form-control-lg mb-3"
          placeholder="Введите номер комнаты"
          @keypress.enter="joinGame()"
        />
        <button class="btn btn-lg btn-danger btn-block" @click="joinGame()">
          Присоединиться
        </button>
      </div>
      <div class v-if="toggle == 'create' && !loading">
        <label for="name" class>Количество месяцев</label>
        <br />
        <input
          type="number"
          min="3"
          step="3"
          v-model.number="roomParams.month"
          name="month"
          id="month"
          class="form-control form-control-lg mb-3"
          placeholder="3"
          @keypress.enter="createGame()"
        />
        <label for="name" class>Бюджет за месяц</label>
        <br />
        <input
          type="number"
          min="0"
          v-model.number="roomParams.money"
          name="money"
          id="money"
          class="form-control form-control-lg mb-3"
          placeholder="100000"
          @keypress.enter="createGame()"
        />
        <button class="btn btn-lg btn-danger btn-block" @click="createGame()">
          Создать
        </button>
      </div>
    </transition>
    <div class="loader-wrap" v-if="loading"><Loader></Loader></div>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";
import Loader from "@/components/Loader.vue";
let apiUrl = "http://localhost:3001/api";
export default {
  name: "Choose",
  data() {
    return {
      toggle: "join",
      roomIdJoin: "",
      roomParams: "",
      loading: false
    };
  },
  components: {
    Loader
  },
  computed: {
    gamerName() {
      return this.$store.state.gamerName;
    },
    stateFirstParams() {
      return this.$store.state.firstRoomParams;
    }
  },
  created() {
    console.log("JWT DECODE: ", jwt.decode(this.$store.state.token));
    let name = jwt.decode(this.$store.state.token).name;
    this.$socket.emit("setName", name);
    this.$store.commit("setName", name);
  },
  methods: {
    logout() {
      try {
        this.$store
          .dispatch("AUTH_LOGOUT")
          .then(
            () => {
              this.$router.push("/");
            },
            err => {
              console.log("ОШИБКА ВЫХОДА: ", err);
            }
          )
          .catch(err => {
            console.log("ОШИБКА ВЫХОДА: ", err);
          });
      } catch (error) {
        console.log(error);
      }
    },
    loadRoomState() {
      if (!this.roomParams) {
        this.loading = true;
        try {
          this.$store
            .dispatch("LOAD_DEFAULT_ROOM")
            .then(
              res => {
                console.log("ПРИШЁЛ СТЕЙТ ПО УМОЛЧАНИЮ: ", res);
                this.roomParams = res.data;
                this.loading = false;
              },
              err => {
                console.log("ОШИБКА ЗАГРУЗКИ: ", err);
                this.loading = false;
              }
            )
            .catch(err => {
              console.log("ОШИБКА ЗАГРУЗКИ: ", err);
              this.loading = false;
            });
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      }
    },
    createGame() {
      this.loading = true;
      this.$http
        .post(apiUrl + "/rooms", this.roomParams)
        .then(res => {
          console.log(res.data);
          this.loading = false;
          this.$store.commit("SET_ROOM_PARAMS", res.data);
          this.$router.push("main");
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
      // this.roomParams.month++
      // this.$store.state.isOwner = true;
      // this.$store.commit("setOwner");
      // console.log("IS OWNER", this.$store.state.isOwner);
      // this.$socket.emit("createRoom");
      // this.$store.commit("copyData", this.roomParams);
      // this.$router.push("main");
      // this.$store.state.roomParams = Object.assign(this.roomParams);
    },
    // Ниже методы необработаны
    joinGame() {
      this.$socket.emit("checkRoom", this.roomIdJoin);
      this.$socket.emit("setRoom", this.roomIdJoin);
      console.log("//" + this.roomIdJoin);
      this.$router.push("main");
    }
    // reset() {
    //   this.$store.commit("resetData");
    //   this.roomParams = {};
    //   this.roomParams = Object.assign(this.stateFirstParams);
    //   console.log("RESET FROM BTN");
    //   console.log(this.roomParams);
    //   console.log("FIRST PARAMS");
    //   console.log(Object.assign(this.stateFirstParams));
    // }
  }
};
</script>

<style>
@media screen and (max-width: 320px) {
  .card.p-4 {
    padding: 0.7rem !important;
  }
}
@media screen and (max-width: 575px) {
  .card.container {
    border: 0px !important;
  }
}
</style>
