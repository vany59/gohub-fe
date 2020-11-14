<template>
  <v-btn
    :disabled="disabled"
    tile
    x-small
    color="primary"
    class="mx-1 fn-btn"
    @click="_fnClick"
  >
    <v-icon small>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: String,
    disabled: Boolean
  },
  methods: {
    _fnClick() {
      this.$emit("click");
    }
  }
};
</script>
