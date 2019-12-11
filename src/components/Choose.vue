<template>
  <div class="card container col-lg-4 col-md-5 col-sm-7 col-xs-8 mt-5 p-4">
    <h1 class="mb-1">Привет, {{gamerName}}!</h1>
    <router-link to="/">Сменить имя</router-link>

    <p>Выбери, как ты начнёшь игру</p>
    <div class="btn-group btn-group-toggle mb-3">
      <label
        class="btn btn-lg"
        :class="{'btn-outline-info': this.toggle!='join', 'btn-info': this.toggle=='join'}"
      >
        <input
          type="radio"
          v-model="toggle"
          value="join"
          name="toggle"
          id="toggle1"
          autocomplete="off"
        /> Присоединиться к комнате
      </label>
      <label
        class="btn btn-lg"
        :class="{'btn-outline-info': this.toggle!='create', 'btn-info': this.toggle=='create'}"
      >
        <input
          type="radio"
          v-model="toggle"
          value="create"
          name="toggle"
          id="toggle2"
          autocomplete="off"
          @click="reset"
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
        <button class="btn btn-lg btn-danger btn-block" @click="joinGame()">Присоединиться</button>
      </div>
      <div class v-if="toggle == 'create'">
        <!-- <label for="name" class>Номер комнаты</label>
        <br />
        <input
          type="number"
          name="roomId"
          id="roomId"
          min="0"
          disabled
          v-model.number="roomId"
          class="form-control form-control-lg mb-2"
          value
        />-->
        <label for="name" class>Количество месяцев</label>
        <br />
        <input
          type="number"
          min="1"
          v-model.number="roomParams.month"
          name="month"
          id="month"
          class="form-control form-control-lg mb-3"
          placeholder="3"
          @keypress.enter="createGame()"
        />
        <label for="name" class>Начальный капитал</label>
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
        <button class="btn btn-lg btn-danger btn-block" @click="createGame()">Создать</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Choose",
  data() {
    return {
      toggle: "join",
      roomIdJoin: "",
      roomParams: {}
    };
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
    // this.$store.commit('resetData');
    // console.log(Object.assign(this.stateFirstParams));
    this.roomParams = Object.assign(this.stateFirstParams)
  },
  beforeMount() {
    // this.$store.commit('resetData');
    // this.roomParams = this.stateFirstParams
  },
  beforeRouteUpdate (to, from, next) {
    // this.$store.commit('resetData');
    // this.roomParams = this.stateFirstParams
  },
  mounted() {
    // this.$store.commit('resetData');
    // this.roomParams = this.$store.state.firstRoomParams;
  },
  methods: {
    createGame() {
      this.$socket.emit("createRoom", "");
      this.$router.push("main");
      this.$store.state.isOwner = true;
      this.$store.state.roomParams = Object.assign(this.roomParams);
    },
    joinGame() {
      this.$socket.emit("setRoom", this.roomIdJoin);
      console.log("//" + this.roomIdJoin);
      this.$router.push("main");
    },
    reset() {
      console.log('!!reset!!');
      // this.$store.commit('resetData');
      this.roomParams = Object.assign(this.stateFirstParams);
      console.log(this.roomParams);
      
      // this.roomParams = this.stateFirstParams;
    }
  },
  beforeRouteEnter(to, from, next) {
    // if (vm.$store.state.roomId == -1) {
    next(function(vm) {
      if (vm.$store.state.gamerName == "") {
        next("/");
      } else {
        return true;
      }
    });
  }
};
</script>

<style>
</style>