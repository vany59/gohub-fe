<template>
  <v-menu
    ref="dateMenu"
    v-model="dateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        placeholder=" "
        v-model="currentValue"
        v-bind="attrs"
        v-on="on"
        required
        :rules="rules"
        readonly
      >
        <template #label>
          {{ $t(`table.dateRange`) }}
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      color="primary"
      v-if="!readonly"
      v-model="date"
      no-title
      @input="_fnDateInput"
      range
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: Array,
    rules: Array,
    readonly: Boolean
  },
  data() {
    return {
      dateMenu: false,
      date: [],
      currentValue: ""
    };
  },
  created() {
    if (this.value && this.value.length === 2) {
      let s = this.$moment.unix(this.value[0]).format("YYYY-MM-DD");
      let e = this.$moment.unix(this.value[1]).format("YYYY-MM-DD");
      this.date = [s, e];
      this.currentValue = `${this._fnFormatDate(s)} ~ ${this._fnFormatDate(e)}`;
    }
  },
  methods: {
    _fnFormatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    _fnDateInput(date) {
      if (date.length && date.length == 2) {
        this.currentValue = `${this._fnFormatDate(
          date[0]
        )} ~ ${this._fnFormatDate(date[1])}`;
        let start = this.$moment(`${date[0]} 00:00:00`, "YYYY-MM-DD hh:mm:ss")
          .utc(true)
          .unix();
        let end = this.$moment(`${date[1]} 23:59:59`, "YYYY-MM-DD hh:mm:ss")
          .utc(true)
          .unix();
        if (start > end) {
          this.currentValue = `${this._fnFormatDate(
            date[1]
          )} ~ ${this._fnFormatDate(date[0])}`;
          this.$emit("change", [end, start]);
        } else {
          this.$emit("change", [start, end]);
        }
      }
    }
  }
};
</script>
