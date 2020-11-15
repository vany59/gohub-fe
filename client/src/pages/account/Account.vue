<template>
  <v-card flat tile class="pa-2 text-no-wrap">
    <v-data-table
      :items="Account.list"
      :headers="cTableHeaders"
      item-key="id"
      :items-per-page="Account.limit"
      :footer-props="{ itemsPerPageOptions: Account.itemPages }"
      :server-items-length="Account.total"
      :options.sync="pagings"
      dense
      fixed-header
      must-sort
    >
      <template v-slot:top>
        <v-layout pa-2 justify-space-around align-end>
          <v-layout align-center>
            <h2>{{ $t("menu.account") }}</h2>
            <v-btnc
              :size="30"
              icon="mdi-plus"
              @click="
                fnCallCreateView(model);
                _fnLoadData();
              "
              v-if="fnCheckMission(Session, [{ m: M_ACCOUNT, p: P_CREATE }])"
            />
          </v-layout>
          <v-spacer />
          <div :style="{ width: '200px' }">
            <v-text-field
              v-model="Account.search"
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
      <template #[`item.action`]="{item}">
        <v-btnc
          color="success"
          icon="mdi-eye"
          @click="
            fnCallView({ model, item: item });
            _fnLoadData();
          "
          v-if="fnCheckMission(Session, [{ m: M_ACCOUNT, p: P_READ }])"
        />
        <v-btnc
          color="warning"
          icon="mdi-pencil"
          @click="
            fnCallUpdateView({ model, item: item });
            _fnLoadData();
          "
          v-if="fnCheckMission(Session, [{ m: M_ACCOUNT, p: P_UPDATE }])"
        />
        <v-btnc
          color="error"
          icon="mdi-delete"
          @click="fnCallDeleteView({ model, item: item })"
          v-if="fnCheckMission(Session, [{ m: M_ACCOUNT, p: P_DELETE }])"
        />
      </template>
      <template #[`item.firstName`]="{item}">
        {{ `${item.lastName} ${item.firstName}` }}
      </template>
      <template #[`item.updatedAt`]="{item}">
        {{ item.updatedAt | mDateTime }}
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
      model: "Account",
      pagings: {}
    };
  },
  computed: {
    cTableHeaders() {
      let table = [
        {
          text: this.$t(`table.action`),
          sortable: false,
          value: "action",
          width: "130px",
          align: "center"
        },
        {
          text: this.$t(`table.name`),
          sortable: true,
          value: "firstName"
        },
        {
          text: this.$t(`table.username`),
          sortable: true,
          value: "username"
        },
        {
          text: this.$t(`table.type`),
          sortable: true,
          value: "type"
        },
        {
          text: this.$t(`table.email`),
          sortable: true,
          value: "email"
        },
        {
          text: this.$t(`table.phone`),
          sortable: true,
          value: "phone"
        }
      ];
      return table;
    }
  },
  watch: {
    "Account.isRefresh": function(val) {
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
        this[this.model].obj = {};
      } else if (this[this.model].isUpdate || this[this.model].isView) {
        this[this.model].obj = {
          ...this[this.model].obj
        };
      }
    },
    _fnCallListView() {
      this.fnCallListView({
        url: "/account/paging",
        model: this.model
      }).then(() => {
        console.log(this[this.model]);
      });
    },
    _fnSearch({ target: { value } }) {
      this[this.model].filters = !value ? [] : [{ key: "search", value }];
      this._fnCallListView();
    },
    _fnBuild(roles) {
      let str = "";
      roles.forEach(role => {
        str += `- ${role.name} <br/>`;
      });
      return str;
    }
  }
};
</script>
