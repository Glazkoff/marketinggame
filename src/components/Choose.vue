<template>
  <div class="card container col-lg-4 col-md-5 col-sm-10 col-xs-8 mt-5 p-4">
    <ReviewModal
      v-if="showReviewModal"
      @close="onCloseReviewModal()"
    ></ReviewModal>
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
      <div class v-if="toggle == 'join' && !loading">
        <label for="name" class>Номер комнаты</label>
        <br/>
        <input
          type="number"
          min="0"
          v-model.number="$v.roomIdJoin.$model"
          name="roomIdJoin"
          id="roomIdJoin"
          class="form-control form-control-lg "
          placeholder="Введите номер комнаты"
          @keypress.enter="joinGame()"
          @input="joinError = ''"
          :class="{
            'is-invalid':
              ($v.roomIdJoin.$invalid && $v.roomIdJoin.$dirty) || joinError,
            'mb-3': !(
              ($v.roomIdJoin.$invalid && $v.roomIdJoin.$dirty) ||
              joinError
            )
          }"
        />
        <div v-if="!$v.roomIdJoin.required" class="invalid-feedback mb-3">
          Обязательно введите номер комнаты!
        </div>
        <div v-if="joinError" class="invalid-feedback mb-3">
          {{ joinError }}
        </div>
        <button
          class="btn btn-lg btn-danger btn-block"
          @click="joinGame()"
          :disabled="$v.roomIdJoin.$invalid"
        >
          Присоединиться
        </button>
      </div>
      <div class v-if="toggle == 'create' && !loading">
        <label for="name" class>Количество месяцев</label>
        <br/>
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
        <br/>
        <input
          type="number"
          min="50000"
          step="1000"
          v-model.number="roomParams.money"
          name="money"
          id="money"
          class="form-control form-control-lg mb-3"
          placeholder="100000"
          @keypress.enter="createGame()"
        />
        <div v-if="this.roomParams.month<=0" class="mb-3">
        Количество месяцев должно быть больше 0!
        </div>
        <div v-if="this.roomParams.money<=15000" class="mb-3">
        Бюджет на месяц должен быть больше 15 000!
        </div>
        <button
          class="btn btn-lg btn-danger btn-block"
          @click="createGame()"
          :disabled="$v.roomParams.$invalid||roomParams.month<=0||roomParams.money<15000"
        >
          Создать
        </button>
      </div>
    </transition>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
    <button class="btn btn-link text-right mt-2" @click="onShowReviewModal()">
      Оставить отзыв
    </button>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";
import Loader from "@/components/Loader.vue";
import ReviewModal from "@/components/ReviewModal.vue";
import {required} from "vuelidate/lib/validators";

let apiUrl = process.env.VUE_APP_API_URL || "http://localhost:3001/api";
export default {
  name: "Choose",
  data() {
    return {
      toggle: "join",
      roomIdJoin: "",
      roomParams: "",
      loading: false,
      joinError: "",
      showReviewModal: false
    };
  },
  validations: {
    roomIdJoin: {
      required
    },
    roomParams: {
      month: {
        required
      },
      money: {
        required
      }
    }
  },
  components: {
    Loader,
    ReviewModal
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
    let token = this.$store.state.token;
    let decode = jwt.decode(token);
    if (decode.admin) {
      this.$store.commit("SET_USER_ID", decode.id);
      this.$store.commit("changeAdminStatus");
    }
    let name = decode.name;
    this.$store.commit("SET_NAME", name);
    this.$socket.disconnect();
    this.$socket.query.token = this.$store.state.token;
    console.log(this.$store.state.token);
    let a = setInterval(() => {
      this.$socket.open();
      if (this.$socket.connected) {
        clearInterval(a);
      }
    }, 200);
  },
  methods: {
    onCloseReviewModal() {
      this.showReviewModal = false;
    },
    onShowReviewModal() {
      this.showReviewModal = true;
    },
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
          console.log("ДАН КОМНАТЫ", res.data);
          this.loading = false;
          if (res.data.status !== 400) {
            this.setRoomParams(res);
          } else{
            alert(res.data.message)
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });

      // console.log(apiUrl);
      // this.roomParams.month++;
      // this.$store.state.isOwner = true;

      // console.log("IS OWNER", this.$store.state.isOwner);
      // this.$socket.emit("createRoom");
      // this.$store.commit("copyData", this.roomParams);
      // this.$router.push("main");
      // this.$store.state.roomParams = Object.assign(this.roomParams);
    },
    joinGame() {
      if (this.$v.roomIdJoin.required) {
        this.loading = true;
        this.$http
          .post(apiUrl + "/rooms/join/" + this.roomIdJoin, this.roomParams)
          .then(res => {
            console.log("ДАН КОМНАТЫ", res.data.first_params);
            console.warn("JOIN RES", res);
            this.setRoomParams(res);
            this.loading = false;
          })
          .catch(err => {
            this.joinError = err.data.message;
            console.log(err.data.message);
            this.loading = false;
          });
      }
    },
    setRoomParams(res) {
      // this.$store.state.prevRoomParams = {};
      // this.$store.state.roomParams = {};
      // this.$store.state.firstRoomParams = {};
      // this.$store.commit("SET_IS_START", res.data.is_start);
      // this.$store.commit("SET_ROOM_ID", res.data.room_id);
      // this.$store.commit("SET_ROOM_PARAMS", res.data.first_params);
      this.$store.dispatch("SET_ROOM_PARAMS", res);
      this.$socket.emit("subscribeRoom", res.data.room_id);
      this.$router.push("main");
    }
    // Ниже методы необработаны

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
