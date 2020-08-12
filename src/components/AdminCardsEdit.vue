<template>
  <div>
    <Modal @close="onModalClose()" v-if="showModal">
      <template v-slot:header>
        <h5>Изменение коэффициента</h5>
      </template>
      <template v-slot:body>
        <!-- <h1>Fuck you, asshole!</h1> -->
        <p>
          Предыдущее значение:
          <strong v-if="coefEdit.oldValue !== undefined"
            >{{ coefEdit.oldValue.operation
            }}{{ coefEdit.oldValue.change }}</strong
          ><strong v-else>-</strong>
        </p>
        <div class="row">
          <label for="operation" class="w-100 col-3"
            >Знак:
            <select
              name=""
              id="operation"
              class="form-control form-control-lg"
              v-model="newCoefValue.operation"
            >
              <option value="+">+</option>
              <option value="*">*</option>
              <option value="-">-</option>
              <!-- <option value="/">/</option> -->
            </select>
          </label>
          <label for="new-coef" class="w-100 col-9"
            >Новое значение:
            <input
              class="form-control form-control-lg"
              type="number"
              placeholder="0.0"
              id="new-coef"
              v-model.number.trim="newCoefValue.change"
              step="0.1"
            />
          </label>
        </div>
        <!-- <label for="new-coef" class="w-100"
          >Новое значение:
          <input
            class="form-control form-control-lg"
            type="number"
            placeholder="0.0"
            id="new-coef"
            v-model.number.trim="newCoefValue"
          />
        </label> -->
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-danger"
          type="button"
          disabled
          v-if="modalVoidLoading"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Оставить пустым
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="onVoidChanges()"
          :disabled="modalLoading"
          v-else
        >
          Оставить пустым
        </button>
        <button
          class="btn btn-primary"
          type="button"
          disabled
          v-if="modalLoading"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Сохранить изменения
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="modalVoidLoading"
          @click="onSaveChanges()"
          v-else
        >
          Сохранить изменения
        </button>
      </template>
    </Modal>
    <div class="card-exists" v-cloak>
      <h3>Редактирование карточки #{{ cardId }}</h3>
      <router-link :to="`/admin/cards`" class=" d-block mb-3"
        >Назад</router-link
      >
      <div class="loader-wrap h-100" v-if="cardsLoading">
        <Loader></Loader>
      </div>
      <div class="text-center" v-else-if="isError">
        <h1 class="mb-1 text-danger">Произошла ошибка!</h1>

        <p class="mb-1 text-danger">
          Возможно, данная карточка удалена или не существует
        </p>
      </div>
      <div class="table-responsive" v-else-if="card !== undefined">
        <small>Нажмите на коэффициент, чтобы отредактировать</small>
        <table class="table table-sm">
          <thead>
            <tr>
              <th scope="col" class="border-right border-left">ID</th>
              <th class="text-center border-right" :colspan="card.duration">
                {{ card.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="border-right border-left">Название</th>
              <td
                class="text-center border-right"
                :colspan="card.duration"
                :key="card.id"
              >
                {{ card.title }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Месяц</th>
              <template>
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
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'organicCount', num)"
                >
                  {{ getFormatChange(card.data_change, "organicCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Конт. реклама"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'contextCount', num)"
                >
                  {{ getFormatChange(card.data_change, "contextCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Реклама соцсети"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'socialsCount', num)"
                >
                  {{ getFormatChange(card.data_change, "socialsCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Соц. медиа"</td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'smmCount', num)"
                >
                  {{ getFormatChange(card.data_change, "smmCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Прямой заход"</td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'straightCount', num)"
                >
                  {{ getFormatChange(card.data_change, "straightCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">К. "Органика"</td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'organicCoef', num)"
                >
                  {{ getFormatChange(card.data_change, "organicCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Конт. реклама"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'contextCoef', num)"
                >
                  {{ getFormatChange(card.data_change, "contextCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Реклама соцсети"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'socialsCoef', num)"
                >
                  {{ getFormatChange(card.data_change, "socialsCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Соц. медиа"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'smmCoef', num)"
                >
                  {{ getFormatChange(card.data_change, "smmCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Прямой заход"
              </td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'straightCoef', num)"
                >
                  {{ getFormatChange(card.data_change, "straightCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">Средний чек</td>
              <template>
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="onChangeClick(card.data_change, 'averageCheck', num)"
                >
                  {{ getFormatChange(card.data_change, "averageCheck", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left border-bottom">
                Реальная<br />стоимость<br />привлечения
              </td>
              <template>
                <td
                  class="text-center  border-bottom font-weight-bold"
                  v-for="num in card.duration"
                  :key="'card' + card.id + 'month' + num"
                  :class="{ 'border-right': num === card.duration }"
                  @click="
                    onChangeClick(card.data_change, 'realCostAttract', num)
                  "
                >
                  {{
                    getFormatChange(card.data_change, "realCostAttract", num)
                  }}
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
import Loader from "./Loader";
import Modal from "./Modal";
export default {
  name: "AdminCardsEdit",
  components: {
    Loader,
    Modal
  },
  data() {
    return {
      cardsLoading: false,
      modalLoading: false,
      modalVoidLoading: false,
      isError: false,
      showModal: false,
      coefEdit: {},
      newCoefValue: {
        operation: "+",
        change: 0
      }
    };
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
    onChangeClick(dataChange, param, when) {
      console.log("Change", dataChange, param, when);
      this.showModal = true;
      this.coefEdit.dataChange = dataChange;
      this.coefEdit.param = param;
      this.coefEdit.when = when;
      this.coefEdit.oldValue = dataChange.find(el => {
        return el.param === param && el.when === when;
      });
      if (this.coefEdit.oldValue !== undefined) {
        this.newCoefValue.change = this.coefEdit.oldValue.change;
        this.newCoefValue.operation = this.coefEdit.oldValue.operation;
      } else {
        this.newCoefValue.change = 0;
        this.newCoefValue.operation = "+";
      }
      console.log(this.coefEdit);
    },
    onModalClose() {
      this.showModal = false;
    },
    onSaveChanges() {
      let newParam = {
        param: this.coefEdit.param,
        operation: this.newCoefValue.operation,
        change: this.newCoefValue.change,
        when: this.coefEdit.when,
        id: this.$route.params.id
      };
      this.modalLoading = true;
      this.$store.dispatch("POST_ADMIN_CARD_PARAMS", newParam).then(
        res => {
          this.getAdminCards();
          this.modalLoading = false;
          this.onModalClose();
        },
        err => {
          this.modalLoading = false;
          console.log(err);
        }
      );
    },
    onVoidChanges() {
      this.modalVoidLoading = true;
      let newParam = {
        param: this.coefEdit.param,
        when: this.coefEdit.when,
        id: this.$route.params.id,
        toDelete: true
      };
      this.$store.dispatch("POST_ADMIN_VOID_CARD_PARAMS", newParam).then(
        res => {
          this.getAdminCards();
          this.modalVoidLoading = false;
          this.onModalClose();
        },
        err => {
          this.modalVoidLoading = false;
          console.log(err);
        }
      );
    },
    getAdminCards() {
      this.cardsLoading = true;
      this.$store.dispatch("GET_ADMIN_CARDS").then(
        res => {
          this.cardsLoading = false;
          if (this.card === undefined) {
            this.isError = true;
          }
        },
        err => {
          this.cardsLoading = false;
          if (this.card === undefined) {
            this.isError = true;
          }
          console.log(err);
        }
      );
    }
  },
  computed: {
    cardId() {
      return this.$route.params.id;
    },
    card() {
      let card = this.$store.state.admin.cards.find(
        el => +el["id"] === +this.$route.params.id
      );
      return card;
    }
  },
  mounted() {
    this.cardsLoading = true;
    if (this.card !== undefined) {
      this.cardsLoading = false;
    } else {
      // this.$store.dispatch("GET_ADMIN_CARDS").then(
      //   res => {
      //     this.cardsLoading = false;
      //     if (this.card === undefined) {
      //       this.isError = true;
      //     }
      //   },
      //   err => {
      //     this.cardsLoading = false;
      //     if (this.card === undefined) {
      //       this.isError = true;
      //     }
      //     console.log(err);
      //   }
      // );
      this.getAdminCards();
    }
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
td:hover {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
</style>
