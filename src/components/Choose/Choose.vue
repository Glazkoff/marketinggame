<template>
  <div class="pt-sm-5 row justify-content-center align-baseline">
    <!--  Основной блок-->
     <div class="col-xl-4 col-lg-6 col-md-10 col-sm-10 col-xs-8 p-4 ">
      <div class="card p-4">
        <ReviewModal
          v-if="showReviewModal"
          @close="onCloseReviewModal()"
        ></ReviewModal>
        <CheckModal
          v-if="showCheckModal"
          @close="onCloseCheckModal()"
          :errorMessage="errorMessage"
        ></CheckModal>
        <Trial
          v-if="showTrialModal"
          @close="onCloseTrialModal()"
          v-bind:is-subscribed="isSubscribed"
        ></Trial>
        <h1 class="mb-1">Привет, {{ gamerName }}!</h1>
        <a href="" @click.prevent="logout()">Выйти</a>
        <LastRoomCheck v-on:setRoomId="setRoomJoin"></LastRoomCheck>
        <p>Выбери, как ты начнёшь игру</p>
        <div class="btn-group-toggle mb-3"
             :class="{'btn-group-vertical': this.width<500, 'btn-group':this.width>=500 }">
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
          <div class="room-create" v-if="toggle == 'create' && !loading">
            <div class="alert-info rounded p-3 text-center" v-if="!this.isSubscribed">
              <h2>
                Создавать игры можно только с подпиской
              </h2>
              <div class="btn-group-toggle m-3"
                   :class="{'btn-group-vertical': this.width<500, 'btn-group':this.width>=500 }">
                <label
                  class="btn btn-lg border"
                  :class="{
          'btn-info': this.toggle != 'chooseRate',
          'btn-outline-info': this.toggle == 'getTrial'
        }"
                  @click="startTrial()"
                  v-if="!this.timeIsUp"
                >
                  <input
                    type="radio"
                    v-model="buy"
                    value="getTrial"
                    name="trial"
                    id="toggle3"
                    autocomplete="off"
                  />
                  Получить пробный период
                </label>

                <label
                  class="btn btn-lg border border-left"
                  :class="{
          'btn-info': this.toggle != 'getTrial',
          'btn-outline-info': this.toggle == 'chooseRate'
        }"
                >
                  <router-link to="tariff">
                    <input
                      type="radio"
                      v-model="buy"
                      value="chooseRate"
                      name="trial"
                      id="toggle4"
                      autocomplete="off"
                    /></router-link>
                  Выбрать тариф
                </label>
              </div>
            </div>
            <div v-if="this.isSubscribed && !this.timeIsUp">
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
              <Timer v-bind:deadline="Date.parse(new Date()) + 21600000" v-on:timeisup="onUnsubscribe()"></Timer>
            </div>
          </div>
        </transition>
        <div class="loader-wrap" v-if="loading">
          <Loader></Loader>
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn btn-link" v-if="isSubscribed" @click="onUnsubscribe()">
            Отменить подписку
          </button>
          <button class="btn btn-link" @click="onShowReviewModal()">
            Оставить отзыв
          </button>
        </div>
      </div>
    </div>
    <!--  Блок о тарифе-->
    <div class="col-xl-3 col-lg-3 col-md-10 col-sm-10 col-xs-8 p-4 order-lg-first">
      <div class="card p-xl-4 p-3">
        <h3 class="mb-1">О подписке</h3>
        <h5>Ваш тариф: <b>Стандартный</b></h5>
        <div class="card-text">
          <ul class="list-group">
            <li class="list-group-item">Преимущество 1
            </li>
            <li class="list-group-item">Преимущество 2
            </li>
          </ul>
        </div>
          <button class="btn btn-link text-left" @click="viewPayment()">
            Управление подпиской
          </button>
      </div>
    </div>
    <!--  Блок о рейтинге-->
    <div class="col-xl-4 col-lg-3 col-md-10 col-sm-10 p-4 order-lg-last">
      <rating/>
    </div>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";
import Loader from "@/components/Loader.vue";
import ReviewModal from "@/components/ReviewModal.vue";
import CheckModal from "@/components/CheckModal.vue";
import LastRoomCheck from "@/components/Choose/LastRoomCheck.vue";
import Trial from "@/components/Choose/Trial";
import {required} from "vuelidate/lib/validators";
import Timer from "@/components/Timer";
import Rating from "./Rating";


let apiUrl = "/api";
export default {
  name: "Choose",
  data() {
    return {
      toggle: "join",
      buy: "getRate",
      isSubscribed: false,
      showTrialModal: false,
      roomIdJoin: "",
      roomParams: "",
      loading: false,
      joinError: "",
      showReviewModal: false,
      showCheckModal: false,
      errorMessage: "",
      width: window.innerWidth,
      timeIsUp: false
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
    Rating,
    Timer,
    Trial,
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
    onTimeIsUp() {
      this.timeIsUp = true
    },
    onCloseTrialModal() {
      this.showTrialModal = false;
    },
    onCloseReviewModal() {
      this.showReviewModal = false;
    },
    onShowReviewModal() {
      this.showReviewModal = true;
    },
    onCloseCheckModal() {
      this.showCheckModal = false;
    },
    onShowCheckModal(message) {
      this.showCheckModal = true;
      this.errorMessage = message
    },
    onUnsubscribe() {
      this.isSubscribed = false;
      this.timeIsUp = true
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
            this.onShowCheckModal(res.data.message)
          }
        })
        .catch(err => {
          this.onShowCheckModal(err)
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
            this.onShowCheckModal(err.data.message)
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
    startTrial() {
      // Типа отправление данных о начале триала
      this.$store.dispatch('TRIAL_REQUEST').then(() => {
        // Если триал предоставлен, то показывается модалка триала
        this.showTrialModal = true;
        this.isSubscribed = true;
      }).catch((err) => {
        this.onShowCheckModal(err.data.message)
        this.loading = false;
      })
    },
    viewPayment() {
      this.$store.dispatch('PAYMENT_VIEW', this.information).then((res) => {
        this.onShowCheckModal(res.data)
      }).catch((err) => {
        this.onShowCheckModal(err.data)
      })
    }
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
