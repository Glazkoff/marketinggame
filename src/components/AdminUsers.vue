<template>
  <div>
    <h2>Пользователи</h2>
    <div class="loader-wrap" v-if="sizeLoading">
      <Loader></Loader>
    </div>
    <div v-else>
      <h6 v-if="listSize">Страницы: {{ currentPage }} из {{ listSize }}</h6>
      <div
        class="btn-group btn-group-toggle w-100 sticky-top"
        data-toggle="buttons"
      >
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="options"
            id="option1"
            @click="setBeforePage()"
            :disabled="currentPage === 1"
          />Предыдущая
        </label>
        <label class="btn btn-secondary" v-if="currentPage >= 6">
          <input type="radio" name="options" id="option2" />...
        </label>
        <label
          class="btn btn-secondary"
          v-for="n in buttonArray"
          :key="n"
          :class="{ active: n == currentPage }"
          @click="setCurrentPage(n)"
        >
          <input type="radio" name="options" id="option2" />{{ n }}
        </label>
        <label class="btn btn-secondary" v-if="currentPage < listSize - 4">
          <input type="radio" name="options" id="option2" />...
        </label>
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="options"
            id="option3"
            @click="setNextPage()"
            :disabled="currentPage === listSize"
          />
          Следующая
        </label>
      </div>
      <div class="loader-wrap" v-if="listLoading">
        <Loader></Loader>
      </div>
      <div class="table-responsive-lg" v-else>
        <table class="table text-center table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Логин</th>
              <th scope="col">Никнейм</th>
              <th scope="col">Дата регистрации</th>
              <th scope="col">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.user_id">
              <th class="text-center align-middle" scope="row">
                {{ user.user_id }}
              </th>
              <td class="text-center align-middle">{{ user.login }}</td>
              <td class="text-center align-middle">{{ user.name }}</td>
              <td class="text-center align-middle">{{ user.createdAt }}</td>
              <td class="text-center align-middle">
                <button
                  class="btn btn-danger"
                  v-if="toDeleteId === user.user_id"
                  disabled
                >
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Ждите
                </button>
                <button
                  v-else
                  class="btn btn-danger"
                  @click="onUserDelete(user.user_id)"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader";
export default {
  name: "AdminUsers",
  data() {
    return {
      sizeLoading: false,
      listLoading: false,
      buttonArray: [],
      currentPage: 1,
      midPage: 1,
      toDeleteId: 0
    };
  },
  computed: {
    users() {
      return this.$store.state.admin.users;
    },
    listSize() {
      if (this.$store.state.admin.usersCount >= 10) {
        return Math.ceil(this.$store.state.admin.usersCount / 10);
      } else {
        return 1;
      }
    }
  },
  components: {
    Loader
  },
  methods: {
    onUserDelete(userId) {
      this.toDeleteId = userId;
      this.$store.dispatch("DELETE_ADMIN_USER", userId).then(
        res => {
          this.loadUsers();
        },
        err => {
          console.log(err);
        }
      );
    },
    setBeforePage() {
      if (this.currentPage !== 1) {
        let n = this.currentPage--;
        this.updateButtonArray(n);
        this.loadUsers();
      }
    },
    setNextPage() {
      if (this.currentPage !== this.listSize) {
        let n = this.currentPage++;
        this.updateButtonArray(n);
        this.loadUsers();
      }
    },
    updateButtonArray(n) {
      if (
        n >= this.buttonArray[Math.ceil(this.buttonArray.length / 2)] &&
        n < this.listSize - 2
      ) {
        this.buttonArray = [];
        for (let index = -4; index < 4; index++) {
          let el = n + index;
          this.buttonArray.push(el);
        }
      } else if (n > 5 && n < this.listSize - 2) {
        this.buttonArray = [];
        for (let index = -4; index < 4; index++) {
          let el = n + index;
          this.buttonArray.push(el);
        }
      } else if (n <= 5) {
        this.buttonArray = [];
        for (let index = 1; index < 11; index++) {
          let el = index;
          this.buttonArray.push(el);
        }
      }
    },
    setCurrentPage(n) {
      if (this.currentPage !== n) {
        this.currentPage = n;
        this.updateButtonArray(n);
        // if (
        //   n > this.buttonArray[Math.ceil(this.buttonArray.length / 2)] &&
        //   n < this.listSize - 2
        // ) {
        //   this.buttonArray = [];
        //   for (let index = -4; index < 5; index++) {
        //     let el = n + index;
        //     this.buttonArray.push(el);
        //   }
        // } else if (n > 5 && n < this.listSize - 2) {
        //   this.buttonArray = [];
        //   for (let index = -4; index < 5; index++) {
        //     let el = n + index;
        //     this.buttonArray.push(el);
        //   }
        // } else if (n <= 5) {
        //   this.buttonArray = [];
        //   for (let index = 1; index < 11; index++) {
        //     let el = index;
        //     this.buttonArray.push(el);
        //   }
        // }
        this.loadUsers();
      }
    },
    loadListSize() {
      this.sizeLoading = true;
      this.$store.dispatch("GET_ADMIN_USERS_COUNT").then(
        res => {
          this.sizeLoading = false;
          if (this.listSize >= 10) {
            this.midPage = 5;
            for (let index = 0; index < 10; index++) {
              this.buttonArray.push(index + 1);
            }
          } else {
            this.midPage = Math.ceil(this.listSize / 2);
            for (let index = 0; index < this.listSize; index++) {
              this.buttonArray.push(index + 1);
            }
          }
        },
        err => {
          this.sizeLoading = false;
          console.log(err);
        }
      );
    },
    loadUsers() {
      this.listLoading = true;
      this.$store.dispatch("GET_ADMIN_USERS", this.currentPage).then(
        res => {
          this.listLoading = false;
        },
        err => {
          this.listLoading = false;
          console.log(err);
        }
      );
    }
  },
  mounted() {
    this.loadListSize();
    this.loadUsers();
  }
};
</script>

<style lang="scss" scoped></style>
