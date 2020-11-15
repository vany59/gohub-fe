import Vue from "vue";
import Vuex from "vuex";
// import io from "socket.io-client";
import * as uuid from "uuid";
import * as _ from "lodash";
import * as Api from "../api";
import router from "../router";
import { fnCopy } from "../utils";
import i18n from "../i18n";

Vue.use(Vuex);

const pages = [
  "Login",
  "Forgot",
  "Profile",

  //page
  "Account",

  //component
  "Gender",
  "Mission",
  "Privilege",
  "Province",
  "District",
  "Ward",
  "Career",
  "Source"
];

const opt = {
  obj: {},
  total: 0,
  list: [],
  isForm: false,
  isValid: false,
  isView: false,
  isCreate: false,
  isUpdate: false,
  isDelete: false,
  isRefresh: false,
  isMember: false,
  isUpload: false,
  page: 1,
  limit: 50,
  sorts: [],
  filters: [],
  itemPages: [10, 20, 50, 100],
  search: "",
  selected: []
};

const assignPage = _.reduce(
  pages,
  function(obj, param) {
    obj[param] = fnCopy(opt);
    return obj;
  },
  {}
);

const rules = {
  required: v => !!v || i18n.messages[i18n.locale].rule.required,
  number: v => Number(v) >= 0 || i18n.messages[i18n.locale].rule.number,
  phone: v =>
    /^(09[0|1|2|3|4|6|7|8|9]|08[1|2|3|4|5|6|8|9]|07[0|6|7|8|9]|05[6|8|9]|03[2|3|4|5|6|7|8|9])+([0-9]{7})$\b/.test(
      v
    ) || i18n.messages[i18n.locale].rule.phone,
  minPass: v => (!!v && v.length >= 5) || "Must be minimum 5 characters",
  array: v => (v && !!v.length) || i18n.messages[i18n.locale].rule.required,
  email: v => /.+@.+/.test(v) || i18n.messages[i18n.locale].rule.email,
  date: v =>
    /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(v) ||
    i18n.messages[i18n.locale].rule.date,
  dateFormat: v =>
    v === "" ||
    /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(v) ||
    i18n.messages[i18n.locale].rule.date,
  identityNumber: v =>
    /^(\d{9}|\d{12})$/.test(v) || i18n.messages[i18n.locale].rule.indentity
};

const missions = {
  M_STOCK: "4e106670-1875-11eb-95f6-8d165ade4f8c",
  M_STUDENT: "45c00aa0-261e-11eb-8167-65016ef15f6e",
  M_TEACHER: "33c82080-261e-11eb-8167-65016ef15f6e",
  M_ACCOUNT: "931b42f0-263d-11eb-8bd1-bbfd3a1828e6"
};
const privileges = {
  P_DELETE: "f3dffae0-1873-11eb-95f6-8d165ade4f8c",
  P_UPDATE: "f1fff040-1873-11eb-95f6-8d165ade4f8c",
  P_CREATE: "efed3ce0-1873-11eb-95f6-8d165ade4f8c",
  P_READ: "eda34ce0-1873-11eb-95f6-8d165ade4f8c"
};

export const state = {
  Api,
  Host: process.env.VUE_APP_API,
  Socket: undefined,
  Token: {},
  Session: {},
  Teams: [],
  Notifications: [],
  IsLogin: false,
  IsFirstLogin: false,
  Rules: { ...rules },
  ...assignPage,
  ...missions,
  ...privileges,
  Tabs: {
    assign: 0,
    search: 0,
    check: 0,
    waiting: 0,
    processing: 0,
    done: 0
  }
};

export const actions = {
  fnSocket: ({ state }) => {
    console.log(state);
    // state.Socket = io.connect(process.env.VUE_APP_API, {
    //   transports: ["websocket"],
    //   query: { token: state.Token.access_token }
    // });
    // state.Socket.on("connect", () => console.log("connected"));
    // state.Socket.on("disconnect", () => console.log("disconnect"));
    // state.Socket.on("error", error => console.log(error));
  },
  fnGetToken: async ({ state }) => {
    if (!state.IsLogin && localStorage.getItem("token")) {
      state.Token = JSON.parse(localStorage.getItem("token"));
    }
  },
  fnSetToken: async ({ state, dispatch }, data) => {
    state.Token = data;
    localStorage.setItem("token", JSON.stringify(data));
    await dispatch("fnGetMe");
  },
  fnGetMe: async ({ state, dispatch }) => {
    await dispatch("fnGetToken");
    console.log("getme");
    if (!state.Token.access_token) return;
    const { data, code } = await Api.get({
      url: "/account/me",
      token: state.Token.access_token
    });
    if (code === 200) {
      state.IsLogin = true;
      state.Session = data;
      state.IsFirstLogin = data.isFirstLogin;
      state.Teams = data.teams;
    } else if (code === 401) {
      await dispatch("fnLogout");
    }
  },
  fnLogout: async ({ state }) => {
    state.Session = {};
    state.Token = {};
    state.IsLogin = false;
    localStorage.clear();
    router.push("/login");
  },
  fnGets: async ({ state, dispatch }, { url, model }) => {
    const { code, total, data } = await Api.post({
      url,
      page: state[model].page,
      limit: state[model].limit,
      sorts: state[model].sorts,
      filters: state[model].filters,
      token: state.Token.access_token
    });
    if (code === 200) {
      state[model].list = data;
      state[model].total = total;
    } else if (code === 401) {
      await dispatch("fnLogout");
      await dispatch("fnGets", { url, model });
    }
    return { code, total, data };
  },
  fnPost: async ({ state, dispatch }, { url, model, showNoti = true }) => {
    const { code, message, data, fail } = await Api.post({
      url,
      body: _.pickBy(state[model].obj),
      token: state.Token.access_token
    });
    if (code === 401) {
      dispatch("fnOpenNotification", {
        type: code === 200 ? "success" : "error",
        message
      });
      await dispatch("fnLogout");
      await dispatch("fnPost", { url, model });
    } else if (showNoti) {
      dispatch("fnOpenNotification", {
        type: code === 200 ? "success" : "error",
        message
      });
    }
    return { data, code, fail };
  },
  fnPut: async ({ state, dispatch }, { url, model, showNoti = true }) => {
    const { code, message, data } = await Api.put({
      url,
      body: _.pickBy(state[model].obj),
      token: state.Token.access_token
    });
    if (code === 401) {
      await dispatch("fnLogout");
      await dispatch("fnPut", { url, model, showNoti });
    } else if (showNoti) {
      dispatch("fnOpenNotification", {
        type: code === 200 ? "success" : "error",
        message
      });
    }

    return { data, code };
  },
  fnDelete: async ({ state, dispatch }, { url }) => {
    const { code, message, data } = await Api.del({
      url,
      token: state.Token.access_token
    });
    if (code === 401) {
      await dispatch("fnLogout");
      await dispatch("fnDelete", { url });
    } else {
      dispatch("fnOpenNotification", {
        type: code === 200 ? "success" : "error",
        message
      });
    }
    return { data, code };
  },
  fnResetFlagView: ({ state }, model) => {
    state[model] = {
      ...state[model],
      obj: {},
      selected: [],
      isForm: false,
      isValid: false,
      isView: false,
      isCreate: false,
      isUpdate: false,
      isDelete: false,
      isRefresh: false,
      isMember: false,
      isUpload: false
    };
  },
  fnCallListView: ({ dispatch }, { url, model }) => {
    dispatch("fnResetFlagView", model);
    dispatch("fnGets", { url, model });
  },
  fnCallView: ({ dispatch, state }, { model, item }) => {
    dispatch("fnResetFlagView", model);
    state[model].isForm = true;
    state[model].isView = true;
    state[model].obj = fnCopy(item);
  },
  fnCallCreateView: ({ dispatch, state }, model) => {
    dispatch("fnResetFlagView", model);
    state[model].isForm = true;
    state[model].isCreate = true;
  },
  fnCallUpdateView: ({ dispatch, state }, { model, item }) => {
    dispatch("fnResetFlagView", model);
    state[model].isForm = true;
    state[model].isUpdate = true;
    state[model].obj = fnCopy(item);
  },
  fnCallDeleteView: ({ dispatch, state }, { model, item }) => {
    dispatch("fnResetFlagView", model);
    state[model].isDelete = true;
    state[model].obj = fnCopy(item);
  },
  fnCallMemberView: ({ dispatch, state }, { model, item }) => {
    dispatch("fnResetFlagView", model);
    state[model].isMember = true;
    state[model].obj = fnCopy(item);
  },
  fnCallUploadView: ({ dispatch, state }, { model }) => {
    dispatch("fnResetFlagView", model);
    state[model].isUpload = true;
  },
  fnOpenNotification({ state }, { type, message }) {
    let noti = state.Notifications;
    const notification = {
      type,
      message,
      key: uuid.v4()
    };
    noti.push(notification);
    setTimeout(() => {
      state.Notifications = state.Notifications.filter(
        item => !_.isEqual(item, notification)
      );
    }, 3000);
  },
  fnSelect: async ({ state }, { items, item, value, model }) => {
    if (item) {
      value
        ? state[model].selected.push(item)
        : state[model].selected.splice(
            state[model].selected.findIndex(e => e.id == item.id),
            1
          );
    } else {
      state[model].selected = value ? fnCopy(items) : [];
    }
  }
};

export default new Vuex.Store({ actions, state });
