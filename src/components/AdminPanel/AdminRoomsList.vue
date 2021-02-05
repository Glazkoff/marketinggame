<template>
  <div>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
    <div id="rooms-list" v-else>
      <div id="find-string" class="container-fluid">
        <div class="row">
          <input
            class="form-control form-control-lg mb-2"
            type="text"
            placeholder="Введите номер комнаты"
            v-model.number="findstring"
          />
        </div>
      </div>
      <button
        class="btn btn-success btn-block btn-lg"
        @click="reloadRoomsList()"
      >
        Обновить список
      </button>
      <div class="container-fluid mt-2">
        <div class="row">
          <div class="card-columns">
            <router-link
              :to="'/admin/rooms/' + room.room_id"
              v-for="room in filterrooms"
              :key="room.room_id"
              class="card"
              tag="div"
            >
              <div class="card-body">
                <h5 class="card-title">Комната #{{ room.room_id }}</h5>
                <!-- <p class="card-text">
                  Текст о комнате
                </p> -->
              </div>
              <ul class="list-group list-group-flush">
                <!-- TODO: исправить -->
                <li class="list-group-item">
                  Количество игроков:
                  <!-- {{ room.participants_id.length }} -->
                </li>
                <li class="list-group-item">
                  Игра началась:
                  <span class="text-success" v-if="!room.is_start">Да</span>
                  <span class="text-danger" v-else>Нет</span>
                </li>
                <li class="list-group-item">
                  Игра завершена:
                  <span class="text-success" v-if="room.is_finished">Да</span>
                  <span class="text-danger" v-else>Нет</span>
                </li>
                <li class="list-group-item">
                  Cоздана: {{ room.createdAt | formatDate }}
                </li>
                <li class="list-group-item">
                  Последнее изменение: {{ room.updatedAt | formatDate }}
                </li>
              </ul>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
import moment from "moment";

export default {
  name: "AdminRoomsList",
  data() {
    return {
      loading: false,
      findstring: ""
    };
  },
  computed: {
    rooms() {
      return this.$store.state.admin.rooms;
    },
    filterrooms() {
      let array = this.rooms;
      if (this.findstring === "") {
        return array;
      } else {
        array = array.filter(el => {
          return el.room_id.toString().indexOf(this.findstring) !== -1;
        });
        return array;
      }
    }
  },
  filters: {
    formatDate: function(date) {
      if (date) {
        moment.locale("ru");
        return moment(String(date)).format("llll");
      }
    }
  },
  components: {
    Loader
  },
  methods: {
    reloadRoomsList() {
      this.loading = true;
      this.$store.dispatch("GET_ADMIN_ROOMS").then(
        res => {
          this.loading = false;
          console.log(res);
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.reloadRoomsList();
      // vm.loading = true;
      // vm.$store.dispatch("GET_ADMIN_ROOMS").then(
      //   res => {
      //     vm.loading = false;
      //     console.log(res);
      //   },
      //   err => {
      //     vm.loading = false;
      //     console.log(err);
      //   }
      // );
    });
  }
};
</script>

<style scoped>
.card {
  cursor: pointer;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
}
.card:hover,
.card:hover * {
  background-color: #ddf5ea;
}
.card h5 {
}
.card-columns {
  -webkit-column-count: 3;
  -moz-column-count: 3;
  column-count: 3;
  max-width: 100%;
}

#find-string {
  position: sticky;
  top: -0.5rem;
  z-index: 1000;
  background-color: #fff;
}

#find-string .row {
  padding-top: 0.5rem;
}

@media (max-width: 730px) {
  .card-columns {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
  }
}

@media (max-width: 575px) {
  .card-columns {
    margin-top: 1rem;
    -webkit-column-count: 1;
    -moz-column-count: 1;
    column-count: 1;
    width: 100%;
  }
  .card {
    text-align: center;
  }
}
</style>
