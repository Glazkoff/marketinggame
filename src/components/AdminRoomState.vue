<template>
  <div>
    <button
      class="btn btn-success btn-block btn-lg mt-3 mb-3 position-sticky processing"
      @click="loadState()"
    >
      Обновить
    </button>
    <h4>Комната #{{ this.$route.params.id }}</h4>
    <div class="loader-wrap" v-if="roomLoading">
      <Loader></Loader>
    </div>
    <div v-else-if="room !== undefined">
      <h6>Создана: {{ formatDate(room.createdAt) }}</h6>
      <h6>
        Последнее обновление: {{ formatDate(room.updatedAt) }} (Минут после
        создания: {{ minutesDiff(room.updatedAt, room.createdAt) }})
      </h6>
      <hr />
      <h5>ID создателя: {{ room.owner_id }}</h5>
      <h5>Участники: {{ room.participants_id }}</h5>
      <hr />
      <h5>
        Игра началась:
        <span class="text-success" v-if="!room.is_start">Да</span>
        <span class="text-danger" v-else>Нет</span>
      </h5>
      <h5>
        Игра завершена:
        <span class="text-success" v-if="room.is_finished">Да</span>
        <span class="text-danger" v-else>Нет</span>
      </h5>
      <hr />
      <h5 v-if="room.is_finished">Победители:</h5>
      <div v-if="room.is_finished">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Место</th>
              <th scope="col">ID пользователя</th>
              <th scope="col">Деньги</th>
            </tr>
            <tr v-if="room.winners[1].id !== -1">
              <th scope="row">I место</th>
              <td class="text-center">{{ room.winners[1].id }}</td>
              <td class="text-center">{{ room.winners[1].money }} ₽</td>
            </tr>
            <tr v-if="room.winners[2].id !== -1">
              <th scope="row">II место</th>
              <td class="text-center">{{ room.winners[2].id }}</td>
              <td class="text-center">{{ room.winners[2].money }} ₽</td>
            </tr>
            <tr v-if="room.winners[3].id !== -1">
              <th scope="row">III место</th>
              <td class="text-center">{{ room.winners[3].id }}</td>
              <td class="text-center">{{ room.winners[3].money }} ₽</td>
            </tr>
          </thead>
        </table>
      </div>

      <h5>Бюджет в месяц: {{ room.budget_per_month }} ₽</h5>
      <h5>
        Текущий месяц: {{ room.current_month }} из
        <span v-if="room.first_params !== undefined">{{
          room.first_params.month
        }}</span>
      </h5>
    </div>
    <hr />
    <h4>Состояния игроков:</h4>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
    <div class="users-state-wrap mt-5+" v-else>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Пользователь #</th>
            <th scope="col">Деньги</th>
            <th scope="col">conversion</th>
            <th scope="col">organicCount</th>
            <th scope="col">contextCount</th>
            <th scope="col">socialsCount</th>
            <th scope="col">smmCount</th>
            <th scope="col">straightCount</th>
            <th scope="col">organicCoef</th>
            <th scope="col">contextCoef</th>
            <th scope="col">socialsCoef</th>
            <th scope="col">smmCoef</th>
            <th scope="col">straightCoef</th>
            <th scope="col">realCostAttract</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="room.first_params !== undefined">
            <th scope="row">Изначальные параметры</th>
            <td>{{ room.first_params.money }}</td>
            <td>{{ room.first_params.conversion }}</td>
            <td>{{ room.first_params.organicCount }}</td>
            <td>{{ room.first_params.contextCount }}</td>
            <td>{{ room.first_params.socialsCount }}</td>
            <td>{{ room.first_params.smmCount }}</td>
            <td>{{ room.first_params.straightCount }}</td>
            <td>{{ room.first_params.organicCoef }}</td>
            <td>{{ room.first_params.contextCoef }}</td>
            <td>{{ room.first_params.socialsCoef }}</td>
            <td>{{ room.first_params.smmCoef }}</td>
            <td>{{ room.first_params.straightCoef }}</td>
            <td>{{ room.first_params.realCostAttract }}</td>
          </tr>
          <tr v-for="user in usersInRoom" :key="user.users_in_rooms_id">
            <th scope="row">{{ user.user_id }}</th>
            <td>{{ user.gamer_room_params.money }}</td>
            <td>{{ user.gamer_room_params.conversion }}</td>
            <td>{{ user.gamer_room_params.organicCount }}</td>
            <td>{{ user.gamer_room_params.contextCount }}</td>
            <td>{{ user.gamer_room_params.socialsCount }}</td>
            <td>{{ user.gamer_room_params.smmCount }}</td>
            <td>{{ user.gamer_room_params.straightCount }}</td>
            <td>{{ user.gamer_room_params.organicCoef }}</td>
            <td>{{ user.gamer_room_params.contextCoef }}</td>
            <td>{{ user.gamer_room_params.socialsCoef }}</td>
            <td>{{ user.gamer_room_params.smmCoef }}</td>
            <td>{{ user.gamer_room_params.straightCoef }}</td>
            <td>{{ user.gamer_room_params.realCostAttract }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader.vue";
import moment from "moment";
export default {
  name: "AdminRoomState",
  data() {
    return {
      room: {},
      loading: false,
      roomLoading: false
    };
  },
  components: {
    Loader
  },
  computed: {
    usersInRoom() {
      return this.$store.state.admin.usersInRoom;
    }
  },
  methods: {
    formatDate(date) {
      moment.locale("ru");
      return moment(date).format("llll");
    },
    minutesDiff(upd, create) {
      let updated = moment(upd);
      let created = moment(create);
      return moment(updated.diff(created)).format("m");
    },
    // TODO: сделать загрузку не всех комнат, а конкретно этой
    loadState() {
      this.roomLoading = true;
      this.loading = true;
      this.$store.dispatch("GET_ADMIN_ROOMS").then(
        res => {
          this.roomLoading = false;
          console.log(res);
          let index = this.$store.state.admin.rooms.findIndex(el => {
            return +el.room_id === +this.$route.params.id;
          });
          if (index !== -1) {
            this.room = this.$store.state.admin.rooms[index];

            this.$store
              .dispatch("GET_ADMIN_USERS_IN_ROOMS", this.$route.params.id)
              .then(
                res => {
                  this.loading = false;
                },
                err => {
                  this.loading = false;
                  console.log(err);
                }
              );
          } else {
            this.roomLoading = true;
            this.$store
              .dispatch("GET_ADMIN_ROOM_STATE", this.$route.params.id)
              .then(
                res => {
                  this.room = res[1];
                  this.roomLoading = false;
                },
                err => {
                  this.roomLoading = false;
                  console.log(err);
                }
              );
          }
        },
        err => {
          this.roomLoading = false;
          console.log(err);
        }
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let index = vm.$store.state.admin.rooms.findIndex(el => {
        return +el.room_id === +vm.$route.params.id;
      });
      if (index === -1) {
        vm.loadState();
        if (JSON.stringify(vm.room) === "[]") {
          vm.$router.push("/admin/rooms");
          return false;
        } else {
          return true;
        }
      } else {
        vm.loadState();
        // vm.room = vm.$store.state.admin.rooms[index];
        // vm.loading = true;
        // vm.$store
        //   .dispatch("GET_ADMIN_USERS_IN_ROOMS", vm.$route.params.id)
        //   .then(
        //     res => {
        //       vm.loading = false;
        //     },
        //     err => {
        //       vm.loading = false;
        //       console.log(err);
        //     }
        //   );
        return true;
      }
    });
  }
};
</script>

<style scoped>
.users-state-wrap {
  /* width: 100vw; */
  /* max-width: 100vw; */
  overflow-x: scroll;
  /* padding-right: 10rem; */
}
.users-state-wrap table {
  /* width: 90%; */
  display: block;
}
</style>
