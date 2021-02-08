import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Main from "./views/Main.vue";
import Choose from "./components/Choose/Choose.vue";
import AdminRoomState from "./components/AdminPanel/AdminRoomState.vue";
import AdminRooms from "./components/AdminPanel/AdminRooms.vue";
import AdminStatistics from "./components/AdminPanel/AdminStatistics.vue";
import AdminRoomsList from "./components/AdminPanel/AdminRoomsList.vue";
import AdminGameConfig from "./components/AdminPanel/AdminGameConfig.vue";
import AdminUsers from "./components/AdminPanel/AdminUsers.vue";
import AdminCards from "./components/AdminPanel/AdminCards.vue";
import AdminCardsEdit from "./components/AdminPanel/AdminCardsEdit.vue";
import AdminCardsList from "./components/AdminPanel/AdminCardsList.vue";
import AdminEvents from "./components/AdminPanel/AdminEvents/AdminEvents.vue";
import AdminEventsEdit from "./components/AdminPanel/AdminEvents/AdminEventsEdit.vue";
import AdminEventsList from "./components/AdminPanel/AdminEvents/AdminEventsList.vue";
import AdminReviews from "./components/AdminPanel/AdminReviews/AdminReviews.vue";

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
          /* webpackChunkName: "adminpanel" */ "./components/AdminPanel/AdminPanel.vue"
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
          path: "reviews",
          component: AdminReviews
        },
        {
          path: "statistics",
          component: AdminStatistics
        },
        {
          path: "config",
          component: AdminGameConfig
        },
        {
          path: "users",
          component: AdminUsers
        },
        {
          path: "cards",
          component: AdminCards,
          children: [
            {
              path: "/",
              component: AdminCardsList
            },
            {
              path: "edit/:id",
              component: AdminCardsEdit
            }
          ]
        },
        {
          path: "events",
          component: AdminEvents,
          children: [
            {
              path: "/",
              component: AdminEventsList
            },
            {
              path: "edit/:id",
              component: AdminEventsEdit
            }
          ]
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
