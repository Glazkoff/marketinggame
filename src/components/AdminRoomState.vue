<template>
  <div>
    <h4>Комната #{{ this.$route.params.id }}</h4>
    {{ room }}

    <h4>Состояния игроков:</h4>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
    <div class="users-state-wrap" v-else>
      <!-- {{ usersInRoom }} -->
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
export default {
  name: "AdminRoomState",
  data() {
    return {
      room: {},
      loading: false
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let index = vm.$store.state.admin.rooms.findIndex(el => {
        return +el.room_id === +vm.$route.params.id;
      });
      if (index === -1) {
        vm.$router.push("/admin/rooms");
        return false;
      } else {
        vm.room = vm.$store.state.admin.rooms[index];
        vm.loading = true;
        vm.$store
          .dispatch("GET_ADMIN_USERS_IN_ROOMS", vm.$route.params.id)
          .then(
            res => {
              vm.loading = false;
            },
            err => {
              vm.loading = false;
              console.log(err);
            }
          );
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
