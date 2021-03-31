<template>
  <div class="card container col-lg-4 col-md-5 col-sm-10 col-xs-8 mt-sm-5 p-4 mt-0">
    <ReviewModal
      v-if="showReviewModal"
      @close="onCloseReviewModal()"
    ></ReviewModal>
    <CheckModal
      v-if="showCheckModal"
      @close="onCloseCheckModal()"
      :errorMessage="errorMessage"
    ></CheckModal>
    <h1 class="mb-1">Привет, {{ gamerName }}!</h1>
    <a href="" @click.prevent="logout()">Выйти</a>
    <LastRoomCheck v-on:setRoomId="setRoomJoin"></LastRoomCheck>
    <p>Выбери, как ты начнёшь игру</p>
    <div class="btn-group-toggle mb-3" :class="{'btn-group-vertical': this.width<500, 'btn-group':this.width>=500 }">
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
        <label for="roomIdJoin" class>Номер комнаты</label>
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
        <label for="month" class>Количество месяцев</label>
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
          :class="{
            'is-invalid':
              this.roomParams.month < 3 ||
              this.roomParams.month > 120 ||
              this.roomParams.month % 3 !== 0 ||
              this.roomParams.month - Math.floor(roomParams.month) !== 0
          }"
          @keypress.enter="createGame()"
        />
        <div v-if="this.roomParams.month % 3 !== 0" class="invalid-feedback mb-3">
          Количество месяцев должно быть кратно 3!
        </div>
        <div v-if="this.roomParams.month < 3" class="invalid-feedback mb-3">
          Количество месяцев должно быть больше 2!
        </div>
        <div v-if="this.roomParams.month > 120" class="invalid-feedback mb-3">
          Количество месяцев должно быть меньше или равно 120!
        </div>
        <div
          v-if="this.roomParams.month - Math.floor(roomParams.month) !== 0"
          class="invalid-feedback mb-3"
        >
          Количество месяцев должно быть целым числом!
        </div>
        <label for="money" class>Бюджет за месяц</label>
        <br/>
        <input
          type="number"
          min="15000"
          step="15000"
          v-model.number="roomParams.money"
          name="money"
          id="money"
          class="form-control form-control-lg mb-3"
          placeholder="15000"
          :class="{
            'is-invalid':
              this.roomParams.money <= 14999 ||
              this.roomParams.money >= 1000000000 ||
              this.roomParams.money - Math.floor(roomParams.money) !== 0
          }"
          @keypress.enter="createGame()"
        />
        <div v-if="this.roomParams.money < 15000" class="invalid-feedback mb-3">
          Бюджет на месяц должен быть больше 14 999!
        </div>
        <div
          v-if="this.roomParams.money >= 1000000000"
          class="invalid-feedback mb-3"
        >
          Бюджет на месяц должен быть меньше 1 000 000 000!
        </div>
        <div
          v-if="this.roomParams.money - Math.floor(roomParams.money) !== 0"
          class="invalid-feedback mb-3"
        >
          Бюджет на месяц должен быть целым числом!
        </div>
        <button
          class="btn btn-lg btn-danger btn-block"
          @click="createGame()"
          :disabled="
            $v.roomParams.$invalid ||
              roomParams.month < 3 ||
              roomParams.money < 15000 ||
              roomParams.month % 3 !== 0 ||
              roomParams.month > 120 ||
              roomParams.money >= 1000000000 ||
              roomParams.month - Math.floor(roomParams.month) !== 0 ||
              this.roomParams.money - Math.floor(roomParams.money) !== 0
          "
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
import CheckModal from "@/components/CheckModal.vue";
import LastRoomCheck from "@/components/Choose/LastRoomCheck.vue";
import {required} from "vuelidate/lib/validators";

let apiUrl = "/api";
export default {
  name: "Choose",
  data() {
    return {
      toggle: "join",
      roomIdJoin: "",
      roomParams: "",
      loading: false,
      joinError: "",
      showReviewModal: false,
      showCheckModal: false,
      errorMessage: "",
      width: window.innerWidth
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
    ReviewModal,
    CheckModal,
    LastRoomCheck
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
    let a = setInterval(() => {
      this.$socket.open();
      if (this.$socket.connected) {
        clearInterval(a);
      }
    }, 200);
    window.addEventListener('resize', this.updateWidth);
  },
  methods: {
    onCloseReviewModal() {
      this.showReviewModal = false;
    },
    onShowReviewModal() {
      this.showReviewModal = true;
    },
    onCloseCheckModal() {
      this.showCheckModal = false;
    },
    onShowCheckModal() {
      this.showCheckModal = true;
    },
    logout() {
      try {
        this.$store
          .dispatch("AUTH_LOGOUT")
          .then(
            () => {
              this.$router.push("/");
            }
          )
          .catch(() => {
          });
      } catch (error) {
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
                this.roomParams = res.data;
                this.loading = false;
              },
              () => {
                this.loading = false;
              }
            )
            .catch(() => {
              this.loading = false;
            });
        } catch (error) {
          this.loading = false;
        }
      }
    },
    createGame() {
      this.loading = true;
      this.$http
        .post(apiUrl + "/rooms", this.roomParams)
        .then(res => {
          this.loading = false;
          if (res.data.status !== 400) {
            this.setRoomParams(res);
          } else {
            this.errorMessage = res.data.message;
            this.showCheckModal = true;
          }
        })
        .catch(err => {
          this.errorMessage = err;
          this.showCheckModal = true;
          this.loading = false;
        });
    },
    joinGame() {
      if (this.$v.roomIdJoin.required) {
        this.loading = true;
        this.$http
          .post(apiUrl + "/rooms/join/" + this.roomIdJoin, this.roomParams)
          .then(res => {
            console.warn("JOIN RES", res);
            this.setRoomParams(res);
            this.loading = false;
          })
          .catch(err => {
            this.showCheckModal = true;
            this.errorMessage = err.data.message;
            this.loading = false;
          });
      }
    },
    setRoomParams(res) {
      this.$store.dispatch("SET_ROOM_PARAMS", res);
      this.$router.push("main");
    },
    setRoomJoin(roomId) {
      this.roomIdJoin = roomId;
    },
    updateWidth() {
      this.width = window.innerWidth;
    },
  }
};
</script>

<style>
@media screen and (max-width: 575px) {
  .card.container {
    border: 0px !important;
  }

}
</style>
