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
          <h1>{{ this.$route.path }}</h1>
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
  name: "AdminPanel"
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
