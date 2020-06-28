import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import Choose from "./components/Choose.vue";
import AdminRoomState from "./components/AdminRoomState.vue";
import AdminRooms from "./components/AdminRooms.vue";
import AdminStatistics from "./components/AdminStatistics.vue";
import AdminRoomsList from "./components/AdminRoomsList.vue";
import AdminGameConfig from "./components/AdminGameConfig.vue";
import store from "./store";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/choose");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: "/choose",
      name: "Choose",
      component: Choose,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/main",
      name: "Main",
      component: Main
    },
    {
      path: "/registration",
      name: "Registration",
      component: () =>
        import(
          /* webpackChunkName: "registration" */
          "./components/Registration.vue"
        )
    },
    {
      path: "/admin",
      name: "Admin",
      component: () =>
        import(
          /* webpackChunkName: "adminpanel" */ "./components/AdminPanel.vue"
        ),
      // component: AdminPanel,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: "rooms",
          component: AdminRooms,
          children: [
            {
              path: "",
              component: AdminRoomsList
            },
            {
              path: ":id",
              component: AdminRoomState
            }
          ]
        },
        {
          path: "statistics",
          component: AdminStatistics
        },
        {
          path: "config",
          component: AdminGameConfig
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/*",
      redirect: {
        name: "Home"
      }
    }
  ]
});
