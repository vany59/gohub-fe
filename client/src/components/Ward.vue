<template>
  <v-autocomplete
    placeholder=" "
    :items="list"
    v-model="select"
    required
    :multiple="multiple"
    :rules="rules"
    @change="_fnChange"
    :clearable="!rules"
  >
    <template #label>
      {{ $t(`table.ward`) }}
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
    district: String,
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
    district: function() {
      this.select = "";
      this.$emit("change", "");
      this._fnInit();
    }
  },
  methods: {
    _fnInit() {
      this.Ward.filters = [{ key: "district", value: this.district }];
      this.Ward.limit = 100;
      this.fnGets({
        url: "/srv-constant/ward/paging",
        model: "Ward"
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
