import Vue from "vue";
import Router from "vue-router";
import store from "./store";

import { fnCheckMission } from "./utils";

import Home from "@pages/Home";
import Login from "@pages/Login";
import Logout from "@pages/Logout";
import Forgot from "@pages/Forgot";
import Profile from "@pages/Profile";
import Account from "./pages/account/Account.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      props: {
        auth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      props: {
        auth: false
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
      props: {
        auth: true
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      props: {
        auth: true
      }
    },
    {
      path: "/forgot",
      name: "forgotPassword",
      component: Forgot,
      props: {
        auth: false
      }
    },
    {
      path: "*",
      redirect: "/",
      props: {
        auth: true
      }
    },
    {
      path: "/account",
      name: "account",
      component: Account,
      props: {
        auth: true,
        mission: [{ m: store.state.M_ACCOUNT, p: store.state.P_READ }]
      }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("fnGetMe");
  const { auth, mission } = to.matched[0].props.default;
  if (auth) {
    if (!store.state.IsLogin) return store.dispatch("fnLogout");

    if (mission && !fnCheckMission(store.state.Session, mission)) {
      return next("/");
    }

    if (store.state.IsFirstLogin && to.matched[0].path != "/profile")
      return next("/profile");
  } else if (store.state.IsLogin) {
    return next("/");
  }
  next();
});

export default router;
