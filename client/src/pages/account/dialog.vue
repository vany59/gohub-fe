<template>
  <v-layout>
    <v-dialog
      v-if="Account.isForm"
      v-model="Account.isForm"
      persistent
      scrollable
      max-width="800"
    >
      <v-form v-model="Account.isValid" ref="form" :readonly="Account.isView">
        <v-card flat>
          <v-card-title dense class="primary headline"> </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols :sm="6" class="py-0">
                <v-text-field
                  color="primary"
                  placeholder=" "
                  required
                  :rules="[Rules.required]"
                  v-model="Account.obj.firstName"
                >
                  <template #label>
                    {{ $t(`table.firstName`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols :sm="6" class="py-0">
                <v-text-field
                  color="primary"
                  placeholder=" "
                  required
                  :rules="[Rules.required]"
                  v-model="Account.obj.lastName"
                >
                  <template #label>
                    {{ $t(`table.lastName`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols :sm="6" class="py-0">
                <v-text-field
                  color="primary"
                  placeholder=" "
                  required
                  :rules="[Rules.required]"
                  v-model="Account.obj.username"
                >
                  <template #label>
                    {{ $t(`table.username`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols :sm="6" class="py-0">
                <v-text-field
                  color="primary"
                  placeholder=" "
                  required
                  :rules="[Rules.required, Rules.phone]"
                  v-model="Account.obj.phone"
                >
                  <template #label>
                    {{ $t(`table.phone`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols :sm="6" class="py-0">
                <v-text-field
                  color="primary"
                  placeholder=" "
                  required
                  :rules="[Rules.required, Rules.email]"
                  v-model="Account.obj.email"
                >
                  <template #label>
                    {{ $t(`table.email`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols :sm="6" class="py-0">
                <v-autocomplete
                  :items="typeList"
                  :rules="[Rules.array]"
                  v-model="Account.obj.type"
                >
                  <template #label>
                    {{ $t(`table.type`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="!Account.isView"
              tile
              color="primary"
              :disabled="!Account.isValid"
              @click="Account.isCreate ? _fnCreate() : _fnUpdate()"
              >{{ Account.isCreate ? $t(`table.create`) : $t(`table.update`) }}
            </v-btn>
            <v-btn tile outlined color="primary" @click="_fnReset()">
              {{ $t(`table.cancel`) }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-if="Account.isDelete"
      v-model="Account.isDelete"
      persistent
      scrollable
      max-width="500"
    >
      <v-card flat>
        <v-card-title dense class="headline primary"> </v-card-title>
        <v-card-text>
          {{ $t(`table.deleteMess`) }}
          <b>{{ Account.obj.firstName }}</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn tile color="primary" @click="_fnDelete()">
            {{ $t(`table.delete`) }}
          </v-btn>
          <v-btn tile outlined color="primary" @click="_fnReset()">
            {{ $t(`table.cancel`) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    model: "Account",
    typeList: [
      {
        text: "student",
        value: "student"
      },
      {
        text: "teacher",
        value: "teacher"
      }
    ]
  }),
  methods: {
    _fnReset() {
      if (this.$refs.form) this.$refs.form.reset();
      this.fnResetFlagView(this.model);
    },
    _fnReFresh() {
      this._fnReset();
      this[this.model].isRefresh = true;
    },
    async _fnCreate() {
      const { code } = await this.fnPost({
        url: `/account/create`,
        model: this.model
      });
      if (code === 200) {
        this._fnReFresh();
      }
    },
    async _fnUpdate() {
      const { code } = await this.fnPut({
        url: `/account/${this[this.model].obj.id}`,
        model: this.model
      });
      if (code === 200) {
        this._fnReFresh();
      }
    },
    async _fnDelete() {
      const { code } = await this.fnDelete({
        url: `/account/${this[this.model].obj.id}`,
        model: this.model
      });
      if (code === 200) {
        this._fnReFresh();
      }
    }
  }
};
</script>
