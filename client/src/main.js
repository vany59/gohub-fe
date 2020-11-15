import Vue from "vue";
import Vuetify from "vuetify";
import VueMoment from "vue-moment";
import { VueEditor } from "vue2-editor";
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import { fnCopy, fnCheckMission, fnCheckTeam } from "./utils";
import router from "./router";
import store, { actions, state } from "./store";
import App from "./App.vue";
import colors from "vuetify/es5/util/colors";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import i18n from "./i18n";
import Notification from "./components/Notification";
import Button from "./components/Button";
import Upload from "./components/Upload";

Vue.prototype._ = _;
Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueMoment);

Vue.component("v-editor", VueEditor);
Vue.component("v-notification", Notification);
Vue.component("v-btnc", Button);
Vue.component("v-upload", Upload);

Vue.filter("mDateTime", v => Vue.moment.unix(v).format("HH:mm DD/MM/YYYY"));
Vue.filter("mDate", v => Vue.moment.unix(v).format("DD/MM/YYYY"));

Vue.mixin({
  computed: mapState(Object.keys(state)),
  methods: {
    fnCopy,
    fnCheckMission,
    fnCheckTeam,
    ...mapActions(Object.keys(actions))
  }
});

new Vue({
  router,
  store,
  vuetify: new Vuetify({
    theme: {
      themes: {
        light: {
          primary: "#00897B",
          secondary: colors.grey
        },
        dark: {
          primary: "#fb8c00",
          secondary: colors.grey
        }
      }
    }
  }),
  i18n,
  render: h => h(App)
}).$mount("#app");
