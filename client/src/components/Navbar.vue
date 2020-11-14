<template>
  <v-app-bar
    flat
    app
    fixed
    clipped-left
    color="primary white--text"
    dense
    v-if="IsLogin && !IsFirstLogin"
  >
    <v-app-bar-nav-icon
      color="white"
      @click.stop="drawer()"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>GOHUB</v-toolbar-title>
    <v-spacer></v-spacer>
    <div :style="{ cursor: `pointer` }" class="mr-4">
      <v-img v-if="lang === 'vi'" :src="vi" @click="_fnLocaleChange" />
      <v-img v-else :src="en" @click="_fnLocaleChange" />
    </div>

    <div class="text-center">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <div>
            <v-btn icon v-bind="attrs" v-on="on">
              <v-avatar class="avatar">
                <v-img v-if="Session.avatar" :src="Host + Session.avatar" />
                <v-icon v-else>person</v-icon>
              </v-avatar>
            </v-btn>
          </div>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="_fnEvent(item)"
            class="user-setting"
          >
            <v-icon :style="{ margin: '0px 12px 0px 0px' }">{{
              item.icon
            }}</v-icon>
            <span>{{ item.title }}</span>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import vi from "../assets/flag-vi.png";
import en from "../assets/flag-en.png";
export default {
  props: {
    drawer: Function
  },
  data() {
    return {
      lang: "en",
      vi,
      en,
      items: [
        {
          title: this.$t(`nav.profile`),
          path: "/profile",
          icon: "mdi-account-box"
        },
        {
          title: this.$t(`nav.logout`),
          path: "/logout",
          icon: "mdi-login-variant"
        }
      ]
    };
  },
  created() {
    this.$i18n.locale = localStorage.getItem("locale") || "en";
    this.lang = this.$i18n.locale;
  },
  methods: {
    _fnLocaleChange() {
      const lang = this.lang === "vi" ? "en" : "vi";
      localStorage.setItem("locale", lang);
      window.location.reload();
    },
    _fnEvent(item) {
      this.$router.push(item.path);
    }
  }
};
</script>

<style scoped>
.avatar {
  min-width: 36px !important;
  width: 36px !important;
  min-height: 36px !important;
  height: 36px !important;
}

.user-setting {
  min-height: 26px;
}
</style>
