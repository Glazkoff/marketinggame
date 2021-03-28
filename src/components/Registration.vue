<template>
  <div id="entr">
    <div
      class="card container col-lg-4 col-md-6 col-sm-10 col-xl-4 p-4"
      v-if="!serverSuccess"
    >
      <h3 class="mb-4">Создайте учётную запись</h3>
      <div class="centered-box" v-if="loading">
        <Loader></Loader>
      </div>
      <form action @submit.prevent>
        <div class="form-group" v-if="!loading">
          <label for="name" class>Ваше имя</label>
          <br />
          <input
            type="text"
            name="name"
            id="name"
            v-model.trim="$v.name.$model"
            :class="{ 'is-invalid': $v.name.$error || serverError }"
            class="form-control form-control-lg"
            placeholder="Введите имя"
            @click="onFormClick()"
          />
          <div v-if="!$v.name.required" class="invalid-feedback">
            Обязательно введите имя!
          </div>
        </div>
        <div class="form-group" v-if="!loading">
          <label for="name" class>Логин</label>
          <br />
          <input
            type="text"
            name="login"
            id="login"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': $v.login.$error || serverError }"
            placeholder="Введите логин"
            v-model.trim="$v.login.$model"
            @click="onFormClick()"
          />
          <div v-if="!$v.login.required" class="invalid-feedback">
            Обязательно введите логин!
          </div>
          <small class="form-text text-danger">
            {{ serverError }}
          </small>
        </div>

        <div class="form-group" v-if="!loading">
          <label for="name" class>Пароль</label>
          <br />
          <input
            type="password"
            name="password"
            class="form-control form-control-lg"
            :class="{ 'is-invalid': $v.password.$error || serverError }"
            placeholder="Введите пароль"
            v-model.trim="$v.password.$model"
            @click="onFormClick()"
          />
          <div v-if="!$v.password.required" class="invalid-feedback">
            Обязательно введите пароль!
          </div>
        </div>
        <button
          class="btn btn-lg btn-primary btn-block"
          @click="tryRegister()"
          :disabled="$v.$invalid || loading"
        >
          Зарегистрироваться
        </button>
        <small class="form-text text-muted">
          Есть учётная запись?
          <router-link to="/">Войдите!</router-link>
        </small>
      </form>
    </div>
    <div
      class="card container col-lg-4 col-md-6 col-sm-10 col-xl-4 p-4 alert alert-success"
      v-if="serverSuccess"
    >
      <h3 class="mb-4">Учётная запись успешно создана!</h3>
      <div class="form-group">
        <router-link
          to="/"
          tag="button"
          class="btn btn-lg btn-success btn-block"
          @click="tryRegister()"
        >
          Вернуться на главную</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import Loader from "@/components/Loader.vue";
import axios from "axios";
export default {
  name: "Registration",
  data() {
    return {
      name: "",
      login: "",
      password: "",
      serverSuccess: false,
      serverError: "",
      loading: false
    };
  },
  components: {
    Loader
  },
  validations: {
    name: {
      required
    },
    login: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    tryRegister() {
      let regData = {
        name: this.name,
        login: this.login,
        password: this.password
      };
      this.loading = true;
      axios
        .post("/api/auth/register", regData)
        .then(res => {
          this.loading = false;
          this.serverSuccess = true;
        })
        .catch(err => {
          this.loading = false;
          if (err.data !== undefined) {
            this.serverError = err.data.message;
          }
        });
    },
    onFormClick() {
      this.serverError = "";
    }
  }
};
</script>

<style scoped>
#entr {
  height: 100vh;
  display: grid;
  place-items: center;
}
.centered-box {
  width: 100%;
  display: grid;
  place-items: center;
}
</style>
