<template>
  <v-card flat tile class="pa-2 text-no-wrap">
    <v-data-table
      :items="Role.list"
      :headers="cTableHeaders"
      item-key="id"
      :items-per-page="Role.limit"
      :footer-props="{ itemsPerPageOptions: Role.itemPages }"
      :server-items-length="Role.total"
      :options.sync="pagings"
      dense
      fixed-header
      must-sort
      show-select
      :value="Role.selected"
      @toggle-select-all="v => fnSelect({ ...v, model })"
      @item-selected="v => fnSelect({ ...v, model })"
    >
      <template v-slot:top>
        <v-layout pa-2 justify-space-around align-end>
          <v-layout align-center>
            <h2>{{ $t("menu.role") }}</h2>
            <v-btnc
              icon="mdi-plus"
              @click="
                fnCallCreateView(model);
                _fnLoadData();
              "
              v-if="
                Role.selected.length == 0 &&
                  fnCheckMission(Session, [{ m: M_ROLE, p: P_CREATE }])
              "
            />
            <v-btnc
              icon="mdi-eye"
              @click="
                fnCallView({ model, item: Role.selected[0] });
                _fnLoadData();
              "
              v-if="
                Role.selected.length == 1 &&
                  fnCheckMission(Session, [{ m: M_ROLE, p: P_READ }])
              "
            />
            <v-btnc
              icon="mdi-pencil"
              @click="
                fnCallUpdateView({ model, item: Role.selected[0] });
                _fnLoadData();
              "
              v-if="
                Role.selected.length == 1 &&
                  fnCheckMission(Session, [{ m: M_ROLE, p: P_UPDATE }])
              "
            />
            <v-btnc
              icon="mdi-delete"
              @click="fnCallDeleteView({ model, item: Role.selected })"
              v-if="
                Role.selected.length >= 1 &&
                  fnCheckMission(Session, [{ m: M_ROLE, p: P_DELETE }])
              "
            />
          </v-layout>
          <v-spacer />
          <div :style="{ width: '200px' }">
            <v-text-field
              v-model="Role.search"
              :placeholder="$t(`table.search`)"
              single-line
              hide-details
              @keydown.enter="_fnSearch"
              dense
              append-outer-icon=""
            />
          </div>
        </v-layout>
      </template>
      <template #[`item.privilege`]="{item}">
        <span v-html="_fnBuildRole(item.missions)"></span>
      </template>
      <template #[`item.updatedBy`]="{item}">
        {{ item.updatedBy.lastName + " " + item.updatedBy.firstName }}
      </template>
      <template #[`item.updatedAt`]="{item}">
        {{ item.updatedAt | mDateTime }}
      </template>
      <template #[`header.data-table-select`]="{props, on}">
        <v-simple-checkbox
          color="primary"
          :value="props.value"
          @input="on.input($event)"
        />
      </template>
      <template #[`item.data-table-select`]="{isSelected, select}">
        <v-simple-checkbox
          color="primary"
          :value="isSelected"
          @input="select($event)"
        />
      </template>
    </v-data-table>
    <v-dialog />
  </v-card>
</template>

<script>
import Dialog from "./dialog.vue";

export default {
  components: {
    "v-dialog": Dialog
  },
  data() {
    return {
      model: "Role",
      pagings: {}
    };
  },
  created() {
    this.fnCallListView({
      url: "/srv-constant/mission/paging",
      model: "Mission"
    });
    this.fnCallListView({
      url: "/srv-constant/privilege/paging",
      model: "Privilege"
    });
  },
  computed: {
    cTableHeaders() {
      return [
        {
          text: this.$t(`table.name`),
          sortable: true,
          value: "name"
        },
        {
          text: this.$t(`table.privilege`),
          sortable: false,
          value: "privilege",
          show: false
        },
        {
          text: this.$t(`table.updatedBy`),
          sortable: false,
          value: "updatedBy",
          width: "130px"
        },
        {
          text: this.$t(`table.updatedAt`),
          sortable: false,
          value: "updatedAt",
          width: "130px"
        }
      ];
    },
    oMission() {
      const obj = {};
      this.Mission.list.forEach(e => (obj[e.id] = e.name));
      return obj;
    },
    oPrivilege() {
      const obj = {};
      this.Privilege.list.forEach(e => (obj[e.id] = e.name));
      return obj;
    }
  },
  watch: {
    "Role.isRefresh": function(val) {
      if (val) {
        this._fnCallListView();
      }
    },
    pagings: {
      handler(value) {
        const { itemsPerPage, page, sortBy, sortDesc } = value;
        this[this.model].limit = itemsPerPage;
        this[this.model].page = page;
        if (sortBy.length) {
          this[this.model].sorts = [
            {
              key: sortBy[0],
              value: sortDesc[0] ? "desc" : "asc"
            }
          ];
        }
        this._fnCallListView();
      },
      deep: true
    }
  },
  methods: {
    _fnLoadData() {
      if (this[this.model].isCreate) {
        this[this.model].obj = { selected: [] };
      } else if (this[this.model].isUpdate || this[this.model].isView) {
        this[this.model].obj = {
          ...this[this.model].obj,
          selected: this[this.model].obj.missions
            .map(m => m.privileges.map(p => `${m.mission}-${p}`))
            .flat()
        };
      }
    },
    _fnCallListView() {
      this.fnCallListView({
        url: "/srv-account/role/paging",
        model: this.model
      });
    },
    _fnSearch({ target: { value } }) {
      this[this.model].filters = !value ? [] : [{ key: "search", value }];
      this._fnCallListView();
    },
    _fnBuildRole(missions) {
      let str = "";
      missions.forEach(e => {
        str += `- <b>${this.oMission[e.mission]}</b>: ${e.privileges
          .map(p => this.oPrivilege[p])
          .join(", ")} <br />`;
      });
      return str;
    }
  }
};
</script>
