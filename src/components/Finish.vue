<template>
  <div id="finish-screen">
    <div class="container mt-4">
      <div class="row" v-if="isLoozer">
        <div class="col-12">
          <h2 class="text-center h-100">Увы, {{gamerName}}, следующий раз должно получиться!</h2>
        </div>
      </div>
      <hr v-if="isLoozer" style="margin: 0" />
      <div class="row" v-if="isLoozer">
        <div class="col-12">
          <h4 class="text-center h-100 mt-2 mb-3">Результаты других игроков:</h4>
        </div>
      </div>
      <div class="row" v-if="isLoozer">
        <div class="col-6 offset-3">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title">
                    Первое место -
                    <strong>{{firstPosition!==undefined ? firstPosition.name : ''}}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
                    <em>{{firstPosition!==undefined ? firstPosition.money : ''}} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="isSomeWinner">
        <div class="col-4">
          <div class="gray-block"></div>
        </div>
        <div class="col-8 text-center mt-3" v-if="isWinner">
          <h3>Поздравляю, {{gamerData!==undefined ? gamerData.name : ''}}!</h3>
          <h1>Вы - победитель</h1>
          <p>Вам удалось заработать:</p>
          <ul class="list-group col-10 offset-1 mt-3">
            <li
              class="list-group-item list-group-item-action list-group-item-action-success active d-flex justify-content-between align-items-center"
            >
              Общий бюджет
              <span class="badge badge-primary badge-pill">
                <h4>{{gamerData!==undefined ? gamerData.money : ''}} ₽</h4>
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Использовано карточек:
              <span class="badge badge-primary badge-pill">123</span>
            </li>
            <!-- <li class="list-group-item d-flex justify-content-between align-items-center">
              Прочие параметры
              <span class="badge badge-primary badge-pill">-</span>
            </li>-->
          </ul>
        </div>
        <div class="col-8 text-center mt-3" v-else-if="isPrizer">
          <h3>Поздравляю, {{gamerData.name}}!</h3>
          <h1>Вы на {{isSecondWinner ? 'втором' : 'третьем'}} месте</h1>
          <p>Вам удалось заработать:</p>
          <ul class="list-group col-10 offset-1 mt-3">
            <li
              class="list-group-item list-group-item-action list-group-item-action-success active d-flex justify-content-between align-items-center"
            >
              Общий бюджет
              <span class="badge badge-primary badge-pill">
                <h4>{{gamerData!==undefined ? gamerData.money : ''}} ₽</h4>
              </span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Использовано карточек:
              <span class="badge badge-primary badge-pill">123</span>
            </li>
            <!-- <li class="list-group-item d-flex justify-content-between align-items-center">
              Прочие параметры
              <span class="badge badge-primary badge-pill">-</span>
            </li>-->
          </ul>
        </div>
      </div>
      <!-- <hr> -->
      <div class="row mt-2">
        <div class="col-6" v-if="isSecondPosition">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title" v-if="isWinner ||isLoozer">
                    Второе место -
                    <strong>{{secondPosition!==undefined ? secondPosition.name : ''}}</strong>
                  </h5>
                  <h5 class="card-title" v-if="isPrizer">
                    Первое место -
                    <strong>{{secondPosition!==undefined ? secondPosition.name : ''}}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
                    <em>{{secondPosition!==undefined ? secondPosition.money : ''}} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6" v-if="isThirdPosition">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title" v-if="isWinner || isSecondWinner || isLoozer">
                    Третье место -
                    <strong>{{thirdPosition!=undefined ? thirdPosition.name : ''}}</strong>
                  </h5>
                  <h5 class="card-title" v-if="isThirdWinner">
                    Второе место -
                    <strong>{{thirdPosition!=undefined ? thirdPosition.name : ''}}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
                    <em>{{thirdPosition!==undefined ? thirdPosition.money : ''}} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <hr> -->
      <div class="row mt-2">
        <div class="col-6 align-content-center justify-content-between">
          <router-link
            to="Choose"
            tag="button"
            class="btn btn-info w-100"
            style="margin: auto auto; display: block;"
          >Cоздать новую комнату</router-link>
        </div>
        <div class="col-6">
          <button
            class="btn btn-secondary w-100"
            style="margin: auto auto; display: block;"
            disabled
          >
            Играть ещё раз в
            комнате
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Finish",
  methods: {},
  computed: {
    gamerName() {
      return this.$store.state.gamerName;
    },
    isSecondPosition() {
      if (this.$store.state.winners.hasOwnProperty("2")) {
        return true;
      } else return false;
    },
    isThirdPosition() {
      if (this.$store.state.winners.hasOwnProperty("3")) {
        return true;
      } else return false;
    },
    isWinner() {
      return this.$socket.id === this.$store.state.winners[1].id;
    },
    isSecondWinner() {
      return this.$socket.id === this.$store.state.winners[2].id;
    },
    isThirdWinner() {
      return this.$socket.id === this.$store.state.winners[3].id;
    },
    isPrizer() {
      if (
        this.$store.state.winners[2] !== undefined &&
        this.$store.state.winners[3] == undefined
      ) {
        return this.$socket.id === this.$store.state.winners[2].id;
      }
      if (
        this.$store.state.winners[2] !== undefined &&
        this.$store.state.winners[3] !== undefined
      ) {
        return (
          this.$socket.id === this.$store.state.winners[2].id ||
          this.$socket.id === this.$store.state.winners[3].id
        );
      }
    },
    isLoozer() {
      return !(
        this.$socket.id === this.$store.state.winners[1].id ||
        this.$socket.id === this.$store.state.winners[2].id ||
        this.$socket.id === this.$store.state.winners[3].id
      );
    },
    isSomeWinner() {
      return (
        this.$socket.id === this.$store.state.winners[1].id ||
        this.$socket.id === this.$store.state.winners[2].id ||
        this.$socket.id === this.$store.state.winners[3].id
      );
    },
    gamerData() {
      if (this.isWinner) {
        return this.$store.state.winners[1];
      } else if (this.$socket.id === this.$store.state.winners[2].id) {
        return this.$store.state.winners[2];
      } else if (this.$socket.id === this.$store.state.winners[3].id) {
        return this.$store.state.winners[3];
      }
    },
    firstPosition() {
      return this.$store.state.winners[1];
    },
    secondPosition() {
      if (this.$store.state.winners.hasOwnProperty("2")) {
        if (this.isWinner || this.isLoozer) {
          return this.$store.state.winners[2];
        } else if (
          this.$socket.id === this.$store.state.winners[2].id ||
          this.$socket.id === this.$store.state.winners[3].id
        ) {
          return this.$store.state.winners[1];
        }
      } else return false;
    },
    thirdPosition() {
      if (this.$store.state.winners.hasOwnProperty("3")) {
        if (
          this.isWinner ||
          this.$socket.id === this.$store.state.winners[2].id ||
          this.isLoozer
        ) {
          return this.$store.state.winners[3];
        } else if (this.$socket.id === this.$store.state.winners[3].id) {
          return this.$store.state.winners[2];
        }
      } else return false;
    }
  }
};
</script>
<style>
.gray-block {
  background-color: gray;
  width: 100%;
  height: 100%;
}

#finish-screen {
  margin: auto auto;
  margin-top: 90px;
  background-color: #fff;
  width: 96%;
  height: calc(96% - 80px);
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
