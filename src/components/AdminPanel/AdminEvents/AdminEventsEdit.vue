<template>
  <div>
    <Modal @close="onModalClose()" v-if="showModal">
      <template v-slot:header>
        <h5>Изменение коэффициента события</h5>
      </template>
      <template v-slot:body>
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
    <h3>Редактирование случайного события #{{ eventId }}</h3>
    <button
      class="btn btn-danger btn-block btn-lg mb-2"
      @click="onEditCancel()"
      v-if="isEdit"
      :disabled="!isEdit || isSaveLoading"
    >
      Отменить редактирование
    </button>
    <div
      :class="{ description: !isEdit, 'bg-light': isEdit }"
      @click="toEdit()"
    >
      <div class="form-group ">
        <label for="title">Название события</label>
        <input
          type="text"
          id="title"
          class="form-control form-control-input"
          :disabled="!isEdit || isSaveLoading"
          v-model.trim="newEventDescription.title"
        />
      </div>
      <div class="form-group">
        <label for="description">Описание события</label>
        <textarea
          class="form-control"
          id="description"
          rows="3"
          v-model.trim="newEventDescription.description"
          :disabled="!isEdit || isSaveLoading"
        ></textarea>
        <small v-if="!isEdit"
          >Нажмите на поле, чтобы начать редактировать</small
        >
      </div>
    </div>
    <button
      class="btn btn-success btn-block btn-lg"
      disabled
      v-if="isEdit && isSaveLoading"
    >
      <span
        class="spinner-border spinner-border-md"
        role="status"
        aria-hidden="true"
      ></span>
      Сохранение...
    </button>
    <button
      class="btn btn-success btn-block btn-lg"
      @click="onDescriptionSave()"
      v-else-if="isEdit && !isSaveLoading"
    >
      Сохранить описание
    </button>
    <h3>Редактирование коэффициентов карточки</h3>
    <small>Нажмите на коэффициент, чтобы отредактировать</small>
    <table class="table table-sm" v-if="event !== undefined" v-cloak>
      <thead>
        <tr>
          <th scope="col" class="border-right border-left">ID</th>
          <th class="text-center border-right" colspan="3">
            {{ event.id }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="border-right border-left">Название</th>
          <td class="text-center border-right" colspan="3" :key="event.id">
            {{ event.title }}
          </td>
        </tr>
        <tr>
          <th scope="row" class="border-right border-left">Месяц</th>
          <template>
            <td
              class="text-center  font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'organicCount', num)"
            >
              {{ getFormatChange(event.data_change, "organicCount", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'contextCount', num)"
            >
              {{ getFormatChange(event.data_change, "contextCount", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'socialsCount', num)"
            >
              {{ getFormatChange(event.data_change, "socialsCount", num) }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-left border-right border-left">"Соц. медиа"</td>
          <template>
            <td
              class="text-center  font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'smmCount', num)"
            >
              {{ getFormatChange(event.data_change, "smmCount", num) }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-left border-right border-left">"Прямой заход"</td>
          <template>
            <td
              class="text-center  font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'straightCount', num)"
            >
              {{ getFormatChange(event.data_change, "straightCount", num) }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-left border-right border-left">К. "Органика"</td>
          <template>
            <td
              class="text-center  font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'organicCoef', num)"
            >
              {{ getFormatChange(event.data_change, "organicCoef", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'contextCoef', num)"
            >
              {{ getFormatChange(event.data_change, "contextCoef", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'socialsCoef', num)"
            >
              {{ getFormatChange(event.data_change, "socialsCoef", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'smmCoef', num)"
            >
              {{ getFormatChange(event.data_change, "smmCoef", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'straightCoef', num)"
            >
              {{ getFormatChange(event.data_change, "straightCoef", num) }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-left border-right border-left">Средний чек</td>
          <template>
            <td
              class="text-center  font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'averageCheck', num)"
            >
              {{ getFormatChange(event.data_change, "averageCheck", num) }}
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
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'realCostAttract', num)"
            >
              {{ getFormatChange(event.data_change, "realCostAttract", num) }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="text-left border-right border-left border-bottom">
            Конверсия
          </td>
          <template>
            <td
              class="text-center  border-bottom font-weight-bold"
              v-for="num in 3"
              :key="'event' + event.id + 'month' + num"
              :class="{ 'border-right': num === 3 }"
              @click="onChangeClick(event.data_change, 'conversion', num)"
            >
              {{ getFormatChange(event.data_change, "conversion", num) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Modal from "@/components/Modal";
export default {
  name: "AdminEventsEdit",
  components: {
    Modal
  },
  data() {
    return {
      descriptionSaveLoading: false,
      isEdit: false,
      isSaveLoading: false,
      showModal: false,
      modalLoading: false,
      modalVoidLoading: false,
      coefEdit: {},
      newEventDescription: {
        title: "",
        description: ""
      },
      newCoefValue: {
        operation: "+",
        change: 0
      }
    };
  },
  computed: {
    eventId() {
      return this.$route.params.id;
    },
    event() {
      return this.$store.state.admin.events.find(
        el => +el.id === +this.$route.params.id
      );
    }
  },
  methods: {
    onVoidChanges() {
      this.modalVoidLoading = true;
      let newParam = {
        param: this.coefEdit.param,
        when: this.coefEdit.when,
        id: this.$route.params.id,
        toDelete: true
      };
      this.$store.dispatch("POST_ADMIN_VOID_EVENT_PARAMS", newParam).then(
        res => {
          this.getAdminEvents();
          this.modalVoidLoading = false;
          this.onModalClose();
        },
        err => {
          this.modalVoidLoading = false;
          console.log(err);
        }
      );
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
      this.$store.dispatch("POST_ADMIN_EVENT_PARAMS", newParam).then(
        res => {
          this.getAdminEvents();
          this.modalLoading = false;
          this.onModalClose();
        },
        err => {
          this.modalLoading = false;
          console.log(err);
        }
      );
    },
    onModalClose() {
      this.showModal = false;
    },
    onChangeClick(dataChange, param, when) {
      when = when - 1;
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
    },
    onDescriptionSave() {
      this.isSaveLoading = true;
      this.newEventDescription.id = this.$route.params.id;
      this.$store
        .dispatch("PUT_ADMIN_EVENT_DESCRIPTION", this.newEventDescription)
        .then(
          res => {
            this.isSaveLoading = false;
            this.isEdit = false;
          },
          err => {
            this.isSaveLoading = false;
            this.isEdit = false;
            console.log(err);
          }
        );
    },
    toEdit() {
      this.isEdit = true;
    },
    onEditCancel() {
      this.isEdit = false;
    },
    getFormatChange(dataChange, param, when) {
      let findDataChange = dataChange.find(el => {
        return el.param === param && el.when === when - 1;
      });
      if (findDataChange === undefined) {
        return "-";
      } else {
        return "" + findDataChange.operation + findDataChange.change;
      }
    },
    async getAdminEvents() {
      try {
        await this.$store.dispatch("GET_ADMIN_EVENTS");
      } catch (error) {
        console.log(error);
      }
    }
  },
  async mounted() {
    if (this.event === undefined) {
      await this.getAdminEvents();
    }
    this.newEventDescription.title = this.event.title;
    this.newEventDescription.description = this.event.description;
  }
};
</script>

<style scoped>
.description {
  cursor: pointer;
}
[v-cloak] {
  display: none;
}
td:hover {
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
}
</style>
