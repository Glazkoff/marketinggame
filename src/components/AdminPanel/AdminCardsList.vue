<template>
  <div>
    <h3 class="mb-3">Список карточек</h3>
    <div class="container-fluid" v-if="!cardsLoading">
      <button class="btn btn-success btn-block mb-4" @click="addCard">
        Добавить карточку
      </button>
    </div>
    <div class="container-fluid">
      <div class="loader-wrap h-100" v-if="cardsLoading">
        <Loader></Loader>
      </div>
      <div class="table-responsive" v-else>
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th scope="col" class="border-right border-left">ID</th>
              <th
                class="text-center border-right"
                :colspan="card.duration"
                v-for="card in cards"
                :key="card.id"
              >
                <router-link :to="`/admin/cards/edit/${card.id}`"
                  >(редактировать)</router-link
                ><br />
                <a href="#" class="text-danger" @click="deleteCard(card.id)"
                  >(удалить)</a
                ><br />
                <a
                  v-if="card.is_draft"
                  href="#"
                  class="text-success"
                  @click="publishCard(card.id)"
                  >(опубликовать)</a
                ><a
                  v-else
                  href="#"
                  class="text-secondary"
                  @click="makeDraftCard(card.id)"
                  >(сделать черновиком)</a
                ><br />{{ card.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="border-right border-left">Название</th>
              <td
                class="text-center border-right"
                :colspan="card.duration"
                v-for="card in cards"
                :key="card.id"
              >
                {{ card.title }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Стоимость</th>
              <td
                class="text-center border-right text-wrap"
                :colspan="card.duration"
                v-for="card in cards"
                :key="card.id"
              >
                {{ card.cost }}₽
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Описание</th>
              <td
                class="text-center border-right text-wrap"
                :colspan="card.duration"
                v-for="card in cards"
                :key="card.id"
              >
                {{ card.text }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Месяц</th>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ num }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Органика"</td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "organicCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Конт. реклама"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "contextCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Реклама соцсети"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "socialsCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Соц. медиа"</td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "smmCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Прямой заход"</td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "straightCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">К. "Органика"</td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "organicCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Конт. реклама"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "contextCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Реклама соцсети"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "socialsCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Соц. медиа"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "smmCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Прямой заход"
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "straightCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">Средний чек</td>
              <template v-for="card in cards">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "averageCheck", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left border-bottom">
                Реальная<br />стоимость<br />привлечения
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  border-bottom font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{
                    getFormatChange(card.data_change, "realCostAttract", num)
                  }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left border-bottom">
                Конверсия
              </td>
              <template v-for="card in cards">
                <td
                  class="text-center  border-bottom font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                >
                  {{ getFormatChange(card.data_change, "conversion", num) }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
export default {
  name: "AdminCardsList",
  components: {
    Loader
  },
  data() {
    return {
      cardsLoading: false
    };
  },
  computed: {
    cards: function(params) {
      return this.$store.state.admin.cards;
    }
  },
  methods: {
    getFormatChange(dataChange, param, when) {
      let findDataChange = dataChange.find(el => {
        return el.param === param && el.when === when;
      });
      if (findDataChange === undefined) {
        return "-";
      } else {
        return "" + findDataChange.operation + findDataChange.change;
      }
    },
    addCard() {
      this.cardsLoading = true;
      this.$store.dispatch("POST_ADMIN_CARDS").then(
        res => {
          this.getCards();
        },
        err => {
          this.getCards();
        }
      );
    },
    deleteCard(cardId) {
      this.cardsLoading = true;
      this.$store.dispatch("DELETE_ADMIN_CARDS", cardId).then(
        res => {
          this.getCards();
        },
        err => {
          this.getCards();
        }
      );
    },
    getCards() {
      this.cardsLoading = true;
      this.$store.dispatch("GET_ADMIN_CARDS").then(
        res => {
          this.cardsLoading = false;
        },
        err => {
          this.cardsLoading = false;
        }
      );
    },
    publishCard(cardId) {
      this.cardsLoading = true;
      this.$store
        .dispatch("PUT_ADMIN_CARDS_DRAFT", { cardId, is_draft: false })
        .then(
          res => {
            this.getCards();
          },
          err => {
            this.getCards();
          }
        );
    },
    makeDraftCard(cardId) {
      this.cardsLoading = true;
      this.$store
        .dispatch("PUT_ADMIN_CARDS_DRAFT", { cardId, is_draft: true })
        .then(
          res => {
            this.getCards();
          },
          err => {
            this.getCards();
          }
        );
    }
  },
  mounted() {
    this.getCards();
  }
};
</script>

<style scoped>
th:first-child,
td:first-child {
  position: sticky;
  left: 0px;
  background-color: #c3e6cb;
}
</style>
