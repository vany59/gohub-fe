<template>
  <v-layout>
    <v-dialog
      v-if="Role.isForm"
      v-model="Role.isForm"
      persistent
      scrollable
      max-width="700"
    >
      <v-form v-model="Role.isValid" ref="form" :readonly="Role.isView">
        <v-card>
          <v-card-title class="primary headline" />
          <v-card-text>
            <v-text-field
              color="primary"
              placeholder=" "
              v-model="Role.obj.name"
              required
              :rules="[Rules.required]"
            >
              <template #label>
                {{ $t(`table.name`) }}
                <span class="red--text">
                  <strong>*</strong>
                </span>
              </template>
            </v-text-field>
            <v-row class="pa-2" v-for="mission in roles" :key="mission.id">
              <v-col class="pa-1 body-1" :sm="3">
                {{ mission.name }}
              </v-col>
              <v-col class="pa-0" :sm="9">
                <v-row v-if="mission.privileges.length">
                  <v-col
                    cols
                    class="pa-0"
                    :sm="3"
                    v-for="privileges in mission.privileges"
                    :key="`${mission.id}-${privileges.id}`"
                  >
                    <v-checkbox
                      color="primary"
                      :label="privileges.name"
                      hide-details
                      v-model="Role.obj.selected"
                      :value="`${mission.id}-${privileges.id}`"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn tile outlined color="primary" @click="_fnReset()">
              {{ $t(`table.cancel`) }}
            </v-btn>
            <v-btn
              v-if="!Role.isView"
              tile
              color="primary"
              :disabled="!Role.isValid || !Role.obj.selected.length"
              @click="Role.isCreate ? _fnCreate() : _fnUpdate()"
            >
              {{ Role.isCreate ? $t(`table.create`) : $t(`table.update`) }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-if="Role.isDelete"
      v-model="Role.isDelete"
      persistent
      scrollable
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline primary" />
        <v-card-text>
          {{ $t(`table.deleteRoleMess`) }}
          <b>{{ _.isArray(Role.obj) && Role.obj.map(e => e.name).join() }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn tile outlined color="primary" @click="_fnReset()">
            {{ $t(`table.cancel`) }}
          </v-btn>
          <v-btn tile color="primary" @click="_fnDelete()">
            {{ $t(`table.delete`) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    model: "Role"
  }),
  computed: {
    roles: function() {
      return this.Mission.list.map(mission => ({
        ...mission,
        privileges: mission.privileges.map(privilege =>
          this.Privilege.list.find(p => p.id === privilege)
        )
      }));
    }
  },
  methods: {
    _fnReset() {
      if (this.$refs.form) this.$refs.form.reset();
      this.fnResetFlagView(this.model);
    },
    _fnReFresh() {
      this._fnReset();
      this[this.model].isRefresh = true;
    },
    _fnConvert() {
      const missionList = this[this.model].obj.selected.map(select => {
        const value = select.split("-");
        return { [value[0]]: value[1] };
      });
      const missionObject = this._.groupBy(missionList, Object.keys);
      const data = [];
      this._.forEach(missionObject, (value, key) => {
        data.push({ mission: key, privileges: value.map(v => v[key]) });
      });
      this[this.model].obj.missions = data;
    },
    async _fnCreate() {
      this._fnConvert();
      const { code } = await this.fnPost({
        url: `/srv-account/role`,
        model: this.model
      });
      if (code === 200) {
        this._fnReFresh();
      }
    },
    async _fnUpdate() {
      this._fnConvert();
      const { code } = await this.fnPut({
        url: `/srv-account/role/${this[this.model].obj.id}`,
        model: this.model
      });
      if (code === 200) {
        this._fnReFresh();
      }
    },
    async _fnDelete() {
      for (const item of this[this.model].obj) {
        await this.fnDelete({
          url: `/srv-account/role/${item.id}`
        });
      }
      this._fnReFresh();
    }
  }
};
</script>
