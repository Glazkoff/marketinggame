<template>
  <div id="finish-screen">
    <div class="container mt-2">
      <div class="row" v-if="isLoozer">
        <div class="col-12">
          <h2 class="text-center h-100">
            Увы, {{ gamerName }}, в следующий раз должно получиться!
          </h2>
        </div>
      </div>
      <hr v-if="isLoozer" style="margin: 0" />
      <div class="row" v-if="isLoozer">
        <div class="col-12">
          <h4 class="text-center h-100 mt-2 mb-3">
            Результаты других игроков:
          </h4>
        </div>
      </div>
      <div class="row" v-if="isLoozer">
        <div class="col-6 offset-3">
          <div class="card" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block block-winner-img"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title">
                    Первое место -
                    <strong>{{
                      firstPosition !== undefined ? firstPosition.name : ""
                    }}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
<!--                    <em
                      >{{
                        firstPosition !== undefined
                          ? Math.ceil(
                              firstPosition.money -
                                (Math.ceil(
                                  firstRoomParams.organicCount *
                                    firstRoomParams.organicCoef *
                                    firstRoomParams.conversion
                                ) +
                                  Math.ceil(
                                    firstRoomParams.contextCount *
                                      firstRoomParams.contextCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.socialsCount *
                                      firstRoomParams.socialsCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.smmCount *
                                      firstRoomParams.smmCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.straightCount *
                                      firstRoomParams.straightCoef *
                                      firstRoomParams.conversion
                                  )) *
                                  firstRoomParams.averageCheck
                            )
                          : ""
                      }}
                      ₽</em
                    >-->
                    <em> {{ (firstPosition.money - firstRoomParams.money).toFixed(2)}} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" id="direction-column" v-if="isSomeWinner">
        <div class="col-4">
          <div class="gray-block block-winner-img"></div>
        </div>
        <div class="col-8 text-center mt-0" v-if="isWinner">
          <h5 class="mb-0">Поздравляю, {{ gamerName }}!</h5>
          <h3 class="mb-0">Вы - победитель</h3>
          <p class="mb-0">Вам удалось заработать: {{firstPosition.money.toFixed(2)}}</p>
          <ul class="list-group col-10 offset-1 mt-3">
            <li
              class="list-group-item list-group-item-action list-group-item-action-success active d-flex justify-content-between align-items-center"
            >
              Выручка за игру:
              <span class="badge badge-primary badge-pill">
                <h4>
                  {{
                    gamerData !== undefined
                      ? Math.ceil(
                          gamerData.money -
                            (Math.ceil(
                              firstRoomParams.organicCount *
                                firstRoomParams.organicCoef *
                                firstRoomParams.conversion
                            ) +
                              Math.ceil(
                                firstRoomParams.contextCount *
                                  firstRoomParams.contextCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.socialsCount *
                                  firstRoomParams.socialsCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.smmCount *
                                  firstRoomParams.smmCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.straightCount *
                                  firstRoomParams.straightCoef *
                                  firstRoomParams.conversion
                              )) *
                              firstRoomParams.averageCheck
                        )
                      : "" | formatNumber
                  }}
                  ₽
                </h4>
              </span>
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              Привлечено клиентов:
              <span class="badge badge-primary badge-pill"
                >{{
                  gamerRoomParams !== undefined
                    ? Math.ceil(
                        gamerRoomParams.organicCount *
                          gamerRoomParams.organicCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.contextCount *
                          gamerRoomParams.contextCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.socialsCount *
                          gamerRoomParams.socialsCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.smmCount *
                          gamerRoomParams.smmCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.straightCount *
                          gamerRoomParams.straightCoef *
                          gamerRoomParams.conversion
                      ) -
                      (Math.ceil(
                        firstRoomParams.organicCount *
                          firstRoomParams.organicCoef *
                          firstRoomParams.conversion
                      ) +
                        Math.ceil(
                          gamerRoomParams.contextCount *
                            firstRoomParams.contextCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.socialsCount *
                            firstRoomParams.socialsCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.smmCount *
                            firstRoomParams.smmCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.straightCount *
                            firstRoomParams.straightCoef *
                            firstRoomParams.conversion
                        ))
                    : ""
                }}
                × {{ firstRoomParams.month }} мес. =
                {{
                  (Math.ceil(
                    gamerRoomParams.organicCount *
                      gamerRoomParams.organicCoef *
                      gamerRoomParams.conversion
                  ) +
                    Math.ceil(
                      gamerRoomParams.contextCount *
                        gamerRoomParams.contextCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.socialsCount *
                        gamerRoomParams.socialsCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.smmCount *
                        gamerRoomParams.smmCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.straightCount *
                        gamerRoomParams.straightCoef *
                        gamerRoomParams.conversion
                    ) -
                    (Math.ceil(
                      firstRoomParams.organicCount *
                        firstRoomParams.organicCoef *
                        firstRoomParams.conversion
                    ) +
                      Math.ceil(
                        gamerRoomParams.contextCount *
                          firstRoomParams.contextCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.socialsCount *
                          firstRoomParams.socialsCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.smmCount *
                          firstRoomParams.smmCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.straightCount *
                          firstRoomParams.straightCoef *
                          firstRoomParams.conversion
                      ))) *
                    firstRoomParams.month
                }}</span
              >
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              Потрачено на продвижение:
              <span class="badge badge-primary badge-pill"
                >{{
                  (firstRoomParams.money * firstRoomParams.month -
                    (gamerRoomParams.money - firstRoomParams.money))
                    | formatNumber
                }}
                ₽ из
                {{
                  (firstRoomParams.money * firstRoomParams.month) | formatNumber
                }}
                ₽</span
              >
            </li>
            <!-- <li class="list-group-item d-flex justify-content-between align-items-center">
              Прочие параметры
              <span class="badge badge-primary badge-pill">-</span>
            </li>-->
          </ul>
        </div>
        <div class="col-8 text-center mt-3" v-else-if="isPrizer">
          <h5 class="mb-0">Поздравляю, {{ gamerName }}!</h5>
          <h3 class="mb-0">
            Вы на {{ isSecondWinner ? "втором" : "третьем" }} месте
          </h3>
          <p class="mb-0">Вам удалось заработать: {{isSecondWinner ? secondPosition.money.toFixed(2) : thirdPosition.money.toFixed(2)}}</p>
          <ul class="list-group col-10 offset-1 mt-3">
            <li
              class="list-group-item list-group-item-action list-group-item-action-success active d-flex justify-content-between align-items-center"
            >
              Выручка за игру:
              <span class="badge badge-primary badge-pill">
                <h4>
                  {{
                    gamerData !== undefined
                      ? Math.ceil(
                          gamerData.money -
                            (Math.ceil(
                              firstRoomParams.organicCount *
                                firstRoomParams.organicCoef *
                                firstRoomParams.conversion
                            ) +
                              Math.ceil(
                                firstRoomParams.contextCount *
                                  firstRoomParams.contextCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.socialsCount *
                                  firstRoomParams.socialsCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.smmCount *
                                  firstRoomParams.smmCoef *
                                  firstRoomParams.conversion
                              ) +
                              Math.ceil(
                                firstRoomParams.straightCount *
                                  firstRoomParams.straightCoef *
                                  firstRoomParams.conversion
                              )) *
                              firstRoomParams.averageCheck
                        )
                      : "" | formatNumber
                  }}
                  ₽
                </h4>
              </span>
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              Привлечено клиентов:
              <span class="badge badge-primary badge-pill"
                >{{
                  gamerRoomParams !== undefined
                    ? Math.ceil(
                        gamerRoomParams.organicCount *
                          gamerRoomParams.organicCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.contextCount *
                          gamerRoomParams.contextCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.socialsCount *
                          gamerRoomParams.socialsCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.smmCount *
                          gamerRoomParams.smmCoef *
                          gamerRoomParams.conversion
                      ) +
                      Math.ceil(
                        gamerRoomParams.straightCount *
                          gamerRoomParams.straightCoef *
                          gamerRoomParams.conversion
                      ) -
                      (Math.ceil(
                        firstRoomParams.organicCount *
                          firstRoomParams.organicCoef *
                          firstRoomParams.conversion
                      ) +
                        Math.ceil(
                          gamerRoomParams.contextCount *
                            firstRoomParams.contextCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.socialsCount *
                            firstRoomParams.socialsCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.smmCount *
                            firstRoomParams.smmCoef *
                            firstRoomParams.conversion
                        ) +
                        Math.ceil(
                          firstRoomParams.straightCount *
                            firstRoomParams.straightCoef *
                            firstRoomParams.conversion
                        ))
                    : ""
                }}
                × {{ firstRoomParams.month }} мес. =
                {{
                  (Math.ceil(
                    gamerRoomParams.organicCount *
                      gamerRoomParams.organicCoef *
                      gamerRoomParams.conversion
                  ) +
                    Math.ceil(
                      gamerRoomParams.contextCount *
                        gamerRoomParams.contextCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.socialsCount *
                        gamerRoomParams.socialsCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.smmCount *
                        gamerRoomParams.smmCoef *
                        gamerRoomParams.conversion
                    ) +
                    Math.ceil(
                      gamerRoomParams.straightCount *
                        gamerRoomParams.straightCoef *
                        gamerRoomParams.conversion
                    ) -
                    (Math.ceil(
                      firstRoomParams.organicCount *
                        firstRoomParams.organicCoef *
                        firstRoomParams.conversion
                    ) +
                      Math.ceil(
                        gamerRoomParams.contextCount *
                          firstRoomParams.contextCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.socialsCount *
                          firstRoomParams.socialsCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.smmCount *
                          firstRoomParams.smmCoef *
                          firstRoomParams.conversion
                      ) +
                      Math.ceil(
                        firstRoomParams.straightCount *
                          firstRoomParams.straightCoef *
                          firstRoomParams.conversion
                      ))) *
                    firstRoomParams.month
                }}</span
              >
            </li>
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              Потрачено на продвижение:
              <span class="badge badge-primary badge-pill"
                >{{
                  (firstRoomParams.money * firstRoomParams.month -
                    (gamerRoomParams.money - firstRoomParams.money))
                    | formatNumber
                }}
                ₽ из
                {{
                  (firstRoomParams.money * firstRoomParams.month) | formatNumber
                }}
                ₽</span
              >
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
        <div class="col-6" v-if="hasSecondPosition">
          <div class="card mb-2" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block block-secondplace-img"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5 class="card-title" v-if="isWinner || isLoozer">
                    Второе место -
                    <strong>{{
                      secondPosition !== undefined ? secondPosition.name : ""
                    }}</strong>
                  </h5>
                  <h5 class="card-title" v-if="isPrizer">
                    Первое место -
                    <strong>{{
                      secondPosition !== undefined ? secondPosition.name : ""
                    }}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
<!--                    <em
                      >{{
                        secondPosition !== undefined
                          ? Math.ceil(
                              secondPosition.money -
                                (Math.ceil(
                                  firstRoomParams.organicCount *
                                    firstRoomParams.organicCoef *
                                    firstRoomParams.conversion
                                ) +
                                  Math.ceil(
                                    firstRoomParams.contextCount *
                                      firstRoomParams.contextCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.socialsCount *
                                      firstRoomParams.socialsCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.smmCount *
                                      firstRoomParams.smmCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.straightCount *
                                      firstRoomParams.straightCoef *
                                      firstRoomParams.conversion
                                  )) *
                                  firstRoomParams.averageCheck
                            )
                          : ""
                      }}
                      ₽</em
                    >-->
                    <em>{{ (secondPosition.money - firstRoomParams.money).toFixed(2) }} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6" v-if="hasThirdPosition">
          <div class="card mb-2" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-3">
                <div class="gray-block block-thirdplace-img"></div>
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <h5
                    class="card-title"
                    v-if="isWinner || isSecondWinner || isLoozer"
                  >
                    Третье место -
                    <strong>{{
                      thirdPosition != undefined ? thirdPosition.name : ""
                    }}</strong>
                  </h5>
                  <h5 class="card-title" v-if="isThirdWinner">
                    Второе место -
                    <strong>{{
                      thirdPosition != undefined ? thirdPosition.name : ""
                    }}</strong>
                  </h5>
                  <p class="card-text">
                    Игроку удалось заработать
                    <br />
<!--                    <em
                      >{{
                        thirdPosition !== undefined
                          ? Math.ceil(
                              thirdPosition.money -
                                (Math.ceil(
                                  firstRoomParams.organicCount *
                                    firstRoomParams.organicCoef *
                                    firstRoomParams.conversion
                                ) +
                                  Math.ceil(
                                    firstRoomParams.contextCount *
                                      firstRoomParams.contextCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.socialsCount *
                                      firstRoomParams.socialsCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.smmCount *
                                      firstRoomParams.smmCoef *
                                      firstRoomParams.conversion
                                  ) +
                                  Math.ceil(
                                    firstRoomParams.straightCount *
                                      firstRoomParams.straightCoef *
                                      firstRoomParams.conversion
                                  )) *
                                  firstRoomParams.averageCheck
                            )
                          : ""
                      }}
                      ₽</em
                    >-->
                    <em>{{(thirdPosition.money - firstRoomParams.money).toFixed(2)}} ₽</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-8 align-content-center justify-content-between pr-0 finish-table"
        >
          <DataTable is-finish-table="true"></DataTable>
        </div>
        <div
          class="col-4 align-content-center justify-content-between steps"
          id="stepsBox"
        >
          <h6 class>Ваши ходы:</h6>
          <div
            class="row mt-1"
            v-for="(step, count) in steps"
            v-bind:key="count"
          >
            <div class="col-4 align-content-center justify-content-between">
              <p class="mb-0 h-100 w-100 text-center font-weight-bold">
                {{ count + 1 }} месяц
              </p>
            </div>
            <div class="col-8 pl-0" v-if="step.length !== 0">
              <p class="mb-0" v-for="(card, num) in step" v-bind:key="num">
                -{{ card.title }}
              </p>
            </div>
            <div class="col-8 pl-0" v-else>
              <p class="mb-0">-</p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-6 align-content-center justify-content-between">
          <router-link
            to="Choose"
            tag="button"
            class="btn btn-info w-100"
            style="margin: auto auto; display: block;"
            >Cоздать новую комнату</router-link
          >
        </div>
        <div class="col-6">
          <button
            @click="showReviewModal()"
            class="btn btn-secondary w-100"
            style="margin: auto auto; display: block;"
          >
            Оставить отзыв
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import jwt from "jsonwebtoken";

export default {
  name: "Finish",
  methods: {
    showReviewModal() {
      this.$emit("showReviewModal");
    }
  },
  components: {
    DataTable
  },
  computed: {
    decoded() {
      try {
        let decoded = jwt.decode(localStorage.getItem("user-token"));
        return decoded;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    steps() {
      return this.$store.state.steps;
    },
    gamerRoomParams() {
      return this.$store.state.roomParams;
    },
    firstRoomParams() {
      return this.$store.state.firstRoomParams;
    },
    gamerName() {
      return this.$store.state.gamerName;
    },
    hasSecondPosition() {
      return this.$store.state.winners["2"]["id"] !== -1;
    },
    hasThirdPosition() {
      return this.$store.state.winners["3"]["id"] !== -1;
    },
    isWinner() {
      return this.decoded.id === this.$store.state.winners[1].id;
    },
    isSecondWinner() {
      return this.decoded.id === this.$store.state.winners[2].id;
    },
    isThirdWinner() {
      return this.decoded.id === this.$store.state.winners[3].id;
    },
    isPrizer() {
      if (
        this.$store.state.winners[2] !== undefined &&
        this.$store.state.winners[3] === undefined
      ) {
        return this.$socket.id === this.$store.state.winners[2].id;
      }
      if (
        this.$store.state.winners[2] !== undefined &&
        this.$store.state.winners[3] !== undefined
      ) {
        return (
          this.decoded.id === this.$store.state.winners[2].id ||
          this.decoded.id === this.$store.state.winners[3].id
        );
      } else {
        return false;
      }
    },
    isLoozer() {
      return !(
        this.decoded.id === this.$store.state.winners[1].id ||
        this.decoded.id === this.$store.state.winners[2].id ||
        this.decoded.id === this.$store.state.winners[3].id
      );
    },
    isSomeWinner() {
      return (
        this.decoded.id === this.$store.state.winners[1].id ||
        this.decoded.id === this.$store.state.winners[2].id ||
        this.decoded.id === this.$store.state.winners[3].id
      );
    },
    gamerData() {
      if (this.isWinner) {
        return this.$store.state.winners[1];
      } else if (this.decoded.id === this.$store.state.winners[2].id) {
        return this.$store.state.winners[2];
      } else if (this.decoded.id === this.$store.state.winners[3].id) {
        return this.$store.state.winners[3];
      } else {
        return null;
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
          this.decoded.id === this.$store.state.winners[2].id ||
          this.decoded.id === this.$store.state.winners[3].id
        ) {
          return this.$store.state.winners[1];
        }
      } else {
        return false;
      }
      return false;
    },
    thirdPosition() {
      if (this.$store.state.winners.hasOwnProperty("3")) {
        if (
          this.isWinner ||
          this.decoded.id === this.$store.state.winners[2].id ||
          this.isLoozer
        ) {
          return this.$store.state.winners[3];
        } else if (this.decoded.id === this.$store.state.winners[3].id) {
          return this.$store.state.winners[2];
        }
      } else {
        return false;
      }
      return false;
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
.finish-table .table td {
  font-size: 0.7rem;
}
#finish-screen .list-group-item:first-child {
  font-size: 1.1rem;
}
#finish-screen .list-group-item {
  padding-top: 0.3rem !important;
  padding-bottom: 0.3rem !important;
  font-size: 0.9rem;
}
#finish-screen .list-group-item:first-child span h4 {
  font-size: 1rem;
  margin-bottom: 0;
}
#finish-screen ul {
  margin-top: 4px !important;
}
#finish-screen .table thead th,
.table td,
.table th {
  white-space: nowrap;
}
.gamer-round-data .table th {
  white-space: unset;
}
.gamer-round-data h4 {
  font-size: 1.1rem;
}
#finish-screen .container {
  max-width: unset;
  margin-top: 0;
}
.steps {
  overflow-y: scroll;
  overflow-x: auto;
  max-height: 300px;
}
.steps p {
  font-size: 0.9rem;
  /* white-space: nowrap; */
}
#finish-screen .card-body {
  padding: 0.45rem;
  padding-left: 0.8rem;
}
#finish-screen .card-body h5 {
  margin-bottom: 0;
  font-size: 0.9rem;
}
#finish-screen .card-body p {
  font-size: 0.8rem;
}

#stepsBox::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #f5f5f5;
}

#stepsBox::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}
#stepsBox::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: linear-gradient(top, #fff, #e4e4e4);
  border: 1px solid #aaa;
}

#stepsBox::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

#stepsBox::-webkit-scrollbar-thumb:active {
  background: linear-gradient(left, #0079fb, #1e98ba);
}
.block-winner-img {
  background: url("../assets/1.svg") no-repeat 50% 50%;
}
.block-secondplace-img {
  background: url("../assets/2.svg") no-repeat 50% 50%;
}
.block-thirdplace-img {
  background: url("../assets/3.svg") no-repeat 50% 50%;
}
</style>
