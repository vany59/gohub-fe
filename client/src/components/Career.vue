<template>
  <v-autocomplete
    placeholder=" "
    :items="list"
    v-model="select"
    :multiple="multiple"
    required
    :rules="rules"
    @change="_fnChange"
    :clearable="!rules"
  >
    <template #label>
      {{ $t(`table.career`) }}
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
    this.Career.limit = 100;
    this.fnGets({
      url: "/srv-constant/type/career/paging",
      model: "Career"
    }).then(({ data }) => {
      data.forEach(e => {
        e.text = e.name;
        e.value = e.id;
      });
      this.list = data;
      this.select = this.selected || (this.multiple ? [] : "");
    });
  },
  methods: {
    _fnChange() {
      this.$emit("change", this.select);
    }
  }
};
</script>
