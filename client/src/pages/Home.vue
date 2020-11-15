<template>
  <v-img :src="bg" />
</template>

<script>
import bg from "../assets/bg.jpg";
export default {
  data() {
    return {
      bg: bg
    };
  }
};
</script>
