<template>
  <span v-if="IsLogin && !IsFirstLogin">
    <v-card class="mx-auto">
      <v-navigation-drawer
        app
        fixed
        clipped
        v-if="drawer"
        permanent
        width="200"
      >
        <v-list dense auto>
          <v-list-item
            v-for="item in menu"
            :to="item.path"
            :key="item.path"
            active-class="primary white--text"
          >
            <v-list-item-content>
              <div :style="{ dislay: `flex` }">
                <v-icon :style="{ fontSize: '18px', margin: `0px 12px` }">{{
                  item.icon
                }}</v-icon>
                <span>{{ item.title }}</span>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </span>
</template>

<script>
export default {
  props: {
    drawer: Boolean,
    showMenu: Function
  },
  computed: {
    menu() {
      let menu = [];
      if (
        this.fnCheckMission(this.Session, [
          { m: this.M_ACCOUNT, p: this.P_READ }
        ])
      ) {
        menu.push({
          title: this.$t("menu.account"),
          path: "/account",
          icon: "mdi-contacts"
        });
      }

      return menu;
    }
  }
};
</script>
