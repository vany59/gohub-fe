<template>
  <v-autocomplete
    placeholder=" "
    required
    :multiple="multiple"
    :rules="rules"
    :items="list"
    v-model="select"
    @change="_fnChange"
    :clearable="!rules"
  >
    <template #label>
      {{ $t(`table.district`) }}
      <span class="red--text" v-if="rules">
        <strong>*</strong>
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  model: {
    prop: "selected",
    event: "change"
  },
  props: {
    selected: [String, Array],
    province: String,
    rules: Array,
    multiple: Boolean
  },
  data() {
    return {
      select: "",
      list: []
    };
  },
  created() {
    this._fnInit();
  },
  watch: {
    province: function() {
      this.select = "";
      this.$emit("change", "");
      this._fnInit();
    }
  },
  methods: {
    _fnInit() {
      this.District.filters = [{ key: "province", value: this.province }];
      this.District.limit = 100;
      this.fnGets({
        url: "/srv-constant/district/paging",
        model: "District"
      }).then(({ data }) => {
        data.forEach(e => {
          e.text = e.name;
          e.value = e.id;
        });
        this.list = data;
        this.select = this.selected || (this.multiple ? [] : "");
      });
    },
    _fnChange() {
      this.$emit("change", this.select);
    }
  }
};
</script>
