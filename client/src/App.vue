<template>
  <v-app>
    <v-navbar :drawer="_fnSetDrwer" />
    <v-sideMenu :drawer="drawer" :showMenu="_fnShowMenu" />
    <v-main :style="{ background: '#EEEEEE', height: '100%' }">
      <router-view :style="{ margin: '8px 8px', maxHeight: '100%' }" />
    </v-main>
    <v-notification />
  </v-app>
</template>

<script>
import Navbar from "@components/Navbar";
import SideMenu from "@components/SideMenu";
export default {
  components: {
    "v-navbar": Navbar,
    "v-sideMenu": SideMenu
  },
  data() {
    return {
      drawer: true,
      langs: ["en", "vi"]
    };
  },
  computed: {
    menus() {
      return [...this.Menu];
    }
  },
  created() {
    this.fnSocket();
    this.$i18n.locale = localStorage.getItem("locale") || "en";
    this._fnShowMenu();
  },
  watch: {
    "$vuetify.breakpoint.name": function() {
      this._fnShowMenu();
    }
  },
  methods: {
    _fnSetDrwer() {
      this.drawer = !this.drawer;
    },
    _fnShowMenu() {
      if (this.$vuetify.breakpoint.xs) {
        this.drawer = false;
      } else {
        this.drawer = true;
      }
    }
  }
};
</script>

<style>
* {
  text-transform: none !important;
}

::-webkit-scrollbar {
  width: 5px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

#app {
  margin: 0px;
}

.v-input__slot {
  margin-bottom: 0px !important;
}

.v-application {
  font-size: 14px;
}

.v-list--dense .v-list-item,
.v-list-item--dense {
  min-height: 32px !important;
  height: 32px !important;
}

.v-list--dense .v-list-item .v-list-item__icon,
.v-list-item--dense .v-list-item__icon {
  height: 24px !important;
  margin-top: auto !important;
  margin-bottom: auto !important;
}

.text-start {
  font-size: 12px !important;
}

.v-icon {
  font-size: 20px;
}

.column-fixed,
tr.abc > td:nth-last-child(1) {
  position: sticky;
  width: 100px;
  min-width: 100px;
  max-width: 100px;
  right: 4px;
}

.v-input--selection-controls {
  margin: 0px !important;
}

.v-badge__badge {
  min-width: 17px !important;
  height: 17px !important;
  font-size: 10px !important;
}

.fn-btn {
  min-width: 24px !important;
  width: 24px;
  min-height: 24px;
  height: 24px;
}

.theme--light.v-select .v-select__selection--disabled {
  color: black !important;
}
</style>
