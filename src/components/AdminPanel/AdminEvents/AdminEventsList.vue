<template>
  <div>
    <h3>Список случайных событий</h3>
    <div class="container-fluid">
      <button
        class="btn btn-success btn-block mb-4"
        v-if="!eventsLoading"
        @click="addEvent"
      >
        Добавить случайное событие
      </button>
      <div class="loader-wrap h-100" v-if="eventsLoading">
        <Loader></Loader>
      </div>
      <div class="table-responsive" v-else>
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <th scope="col" class="border-right border-left">ID</th>
              <th
                class="text-center border-right"
                v-for="event in events"
                :key="event.id"
                colSpan="3"
              >
                <router-link :to="`/admin/events/edit/${event.id}`"
                  >(редактировать)</router-link
                ><br />
                <a href="#" class="text-danger" @click="deleteEvent(event.id)"
                  >(удалить)</a
                ><br />
                <a
                  v-if="event.is_draft"
                  href="#"
                  class="text-success"
                  @click="publishEvent(event.id)"
                  >(опубликовать)</a
                ><a
                  v-else
                  href="#"
                  class="text-secondary"
                  @click="makeDraftEvent(event.id)"
                  >(сделать черновиком)</a
                ><br />{{ event.id }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" class="border-right border-left">Название</th>
              <td
                class="text-center border-right"
                colspan="3"
                v-for="event in events"
                :key="event.id"
              >
                {{ event.title }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Описание</th>
              <td
                class="text-center border-right text-wrap"
                colspan="3"
                v-for="event in events"
                :key="event.id"
              >
                {{ event.description }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="border-right border-left">Месяц</th>
              <template v-for="event in events">
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
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "organicCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Конт. реклама"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "contextCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                "Реклама соцсети"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "socialsCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Соц. медиа"</td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "smmCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">"Прямой заход"</td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "straightCount", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">К. "Органика"</td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "organicCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Конт. реклама"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "contextCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Реклама соцсети"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "socialsCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Соц. медиа"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "smmCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">
                К. "Прямой заход"
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "straightCoef", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left">Средний чек</td>
              <template v-for="event in events">
                <td
                  class="text-center  font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "averageCheck", num) }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left border-bottom">
                Реальная<br />стоимость<br />привлечения
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  border-bottom font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{
                    getFormatChange(event.data_change, "realCostAttract", num)
                  }}
                </td>
              </template>
            </tr>
            <tr>
              <td class="text-left border-right border-left border-bottom">
                Конверсия
              </td>
              <template v-for="event in events">
                <td
                  class="text-center  border-bottom font-weight-bold"
                  v-for="num in 3"
                  :key="'event' + event.id + 'month' + num"
                  :class="{ 'border-right': num === 3 }"
                >
                  {{ getFormatChange(event.data_change, "conversion", num) }}
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
import Loader from "@/components/Loader";
export default {
  name: "AdminEventsList",
  components: {
    Loader
  },
  data() {
    return {
      eventsLoading: false
    };
  },
  computed: {
    events() {
      return this.$store.state.admin.events;
    }
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    getEvents() {
      this.eventsLoading = true;
      this.$store.dispatch("GET_ADMIN_EVENTS").then(
        res => {
          this.eventsLoading = false;
        },
        () => {
          this.eventsLoading = false;
        }
      );
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
    addEvent() {
      this.eventsLoading = true;
      this.$store.dispatch("POST_ADMIN_EVENTS").then(
        res => {
          this.getEvents();
        },
        () => {
          this.getEvents();
        }
      );
    },
    deleteEvent(eventId) {
      this.eventsLoading = true;
      this.$store.dispatch("DELETE_ADMIN_EVENTS", eventId).then(
        res => {
          this.getEvents();
        },
        () => {
          this.getEvents();
        }
      );
    },
    publishEvent(eventId) {
      this.eventsLoading = true;
      this.$store
        .dispatch("PUT_ADMIN_EVENTS_DRAFT", { eventId, is_draft: false })
        .then(
          res => {
            this.getEvents();
          },
          () => {
            this.getEvents();
          }
        );
    },
    makeDraftEvent(eventId) {
      this.eventsLoading = true;
      this.$store
        .dispatch("PUT_ADMIN_EVENTS_DRAFT", { eventId, is_draft: true })
        .then(
          res => {
            this.getEvents();
          },
          () => {
            this.getEvents();
          }
        );
    }
  }
};
</script>

<style scoped>
th:first-child,
td:first-child {
  position: sticky;
  left: 0px;
  background-color: #c3e2e6;
}
</style>
