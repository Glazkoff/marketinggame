<template>
  <div>
    <div id="admin-screen">
      <transition name="admin-transition">
        <div class="side-panel">
          <router-link
            tag="div"
            class="menu-point"
            to="/admin/rooms"
            active-class="menu-point-active"
            :exact="true"
          >
            Состояния комнат</router-link
          >
          <router-link
            tag="div"
            class="menu-point menu-point-disabled"
            to="/admin"
            active-class="menu-point-active"
            :exact="true"
          >
            Главная
          </router-link>
          <router-link
            tag="div"
            :disabled="true"
            class="menu-point menu-point-disabled"
            to="/admin/statistics"
            active-class="menu-point-active"
            :exact="true"
          >
            Статистика</router-link
          >
        </div>
      </transition>
      <div class="main-panel">
        <div id="dashboard" v-if="this.$route.path == '/admin'">
          <!-- <h1>{{ this.$route.path }}</h1> -->
          <h3>Добавить общее оповещение</h3>
          <label for="">Выберите тип</label><br />
          <div
            class="btn-block btn-group btn-group-toggle mb-2"
            data-toggle="buttons"
          >
            <label
              class="btn btn-success"
              :class="{ active: type === 'success' }"
            >
              <input type="radio" v-model="type" value="success" id="option1" />
              Успех
            </label>
            <label
              class="btn btn-danger"
              :class="{ active: type === 'danger' }"
            >
              <input type="radio" v-model="type" value="danger" id="option2" />
              Опасность
            </label>
            <label
              class="btn btn-warning"
              :class="{ active: type === 'warning' }"
            >
              <input type="radio" v-model="type" value="warning" id="option3" />
              Предупреждение
            </label>
            <label class="btn btn-info" :class="{ active: type === 'info' }">
              <input
                type="radio"
                v-model="type"
                value="info"
                name="options"
                id="option4"
              />
              Инфо
            </label>
          </div>
          <br /><label for="">Текст сообщения</label>
          <input
            type="text"
            class="form-control form-control-lg mb-2"
            v-model="toastMessage"
            @keypress.enter="addToast()"
          />
          <label for="inputState">Таймаут</label>
          <select
            id="inputState"
            class="form-control form-control-lg mb-4"
            v-model="timeOut"
          >
            <option value="0">Бесконечно</option>
            <option value="5000">5 секунд</option>
            <option value="10000">10 секунд</option>
            <option value="15000">15 секунд</option>
          </select>
          <button
            class="btn btn-block btn-lg btn-primary"
            @click="addToast()"
            :disabled="toastMessage == '' || type == ''"
          >
            Добавить оповещение
          </button>
        </div>
        <transition name="admin-transition">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPanel",
  data() {
    return {
      toastMessage: "",
      type: "info",
      timeOut: 0
    };
  },
  methods: {
    addToast() {
      this.$socket.emit("addToast", {
        body: this.toastMessage,
        type: this.type,
        timeOut: this.timeOut
      });
      this.toastMessage = "";
    }
  }
};
</script>

<style scoped>
#admin-screen {
  display: grid;
  grid-gap: 0;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: 1fr;
  width: 100vw;
  height: 100vh;
}
.side-panel,
.main-panel {
  height: 100%;
}
.side-panel {
  border-right: 1px solid #000;
  max-width: 20vw;
}
.side-panel .menu-point {
  padding: 1rem;
  cursor: pointer;
}
.side-panel .menu-point:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.side-panel .menu-point:not(:last-child) {
  border-bottom: 1px solid #000;
}
.side-panel .menu-point-disabled {
  color: #fff;
  background-size: 50px 50px;
  background-color: #ad6d6d;
  background-image: -webkit-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-image: -moz-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}

.side-panel .menu-point-disabled:hover {
  background-color: #9e3f3f;
}

.menu-point-active {
  font-weight: bold;
}

.main-panel {
  padding: 0.5rem 1rem;
  max-width: 80vw;
  overflow-y: auto;
  overflow-x: hidden;
}

.admin-transition-enter-active {
  transition: 0.1s all 0.1s ease;
}
.admin-transition-leave-active {
  transition: all 0.1s ease;
}
.admin-transition-enter,
.admin-transition-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.admin-transition-enter {
}
@media (max-width: 930px) {
  #admin-screen {
    display: flex;
    flex-direction: column;
  }
  .side-panel {
    display: flex;
    overflow-x: auto;
    max-width: 100vw;
    height: auto;
    border-bottom: 1px solid #000;
  }
  .side-panel .menu-point:not(:last-child) {
    border-bottom: unset;
  }
  .side-panel .menu-point {
    border-right: 1px solid #000;
    text-align: center;
  }
  .main-panel {
    max-width: 100vw;
  }
}
</style>
