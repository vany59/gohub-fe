<template>
  <v-menu
    color="primary"
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
        readonly
        :rules="rules"
      >
        <template #label>
          {{ label || $t(`table.birthday`) }}
          <span v-if="rules" class="red--text">
            <strong>*</strong>
          </span>
        </template>
      </v-text-field>
    </template>
    <v-date-picker
      color="primary"
      v-if="!readonly"
      v-model="date"
      no-title
      @input="_fnDateInput"
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
    label: String,
    value: [String, Number],
    rules: Array,
    readonly: Boolean,
    birthday: Boolean
  },
  data() {
    return {
      dateMenu: false,
      date: "",
      currentValue: ""
    };
  },
  created() {
    this.currentValue = this.value || "";
    if (this.value && !this.birthday) {
      this.currentValue = this.$moment.unix(this.value).format("DD/MM/YYYY");
    }
  },
  methods: {
    _fnFormatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    _fnDateInput(date) {
      this.date = date;
      this.dateMenu = false;
      this.currentValue = this._fnFormatDate(date);
      this.$emit(
        "change",
        !this.birthday
          ? this.$moment(`${date} 00:00:00`, "YYYY-MM-DD hh:mm:ss")
              .utc(true)
              .unix()
          : this.currentValue
      );
    }
  }
};
</script>
