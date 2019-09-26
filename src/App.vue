<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Вход</router-link>|
      <router-link to="/choose">Создать игру</router-link>|
      <router-link to="/main">Главный экран</router-link>|
      <router-link to="/about">Об игре</router-link>
    </div>
    <div id="view">
      <transition name="slide" mode="out-in" appear>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<style>
body {
  overflow-x: hidden;
  padding: 0;
  margin: 0;
}

#nav {
  box-sizing: border-box;
  padding: 8px;
  height: 40px;
}
#view {
  height: calc(100vh - 50px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-leave-active {
  transform: translateX(110%);
}
.slide-enter {
  transform: translateX(-110%);
}
</style>
