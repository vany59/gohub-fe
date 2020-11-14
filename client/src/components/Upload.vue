<template>
  <div class="avatar-container">
    <v-avatar
      v-if="link"
      tile
      size="80"
      @click="!readonly && $refs.input.click()"
    >
      <v-img :src="Host + link" />
      <div class="img-icon">
        <v-icon color="grey">mdi-camera</v-icon>
      </div>
    </v-avatar>
    <div v-else class="avatar-frame" @click="!readonly && $refs.input.click()">
      <v-icon color="primary">mdi-camera</v-icon>
    </div>
    <input
      class="file-upload"
      type="file"
      accept="image/*"
      ref="input"
      @change="_fnUpload"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: "link",
    event: "change"
  },
  props: {
    link: String,
    readonly: Boolean
  },
  methods: {
    async _fnUpload() {
      const file = this.$refs.input.files[0];
      const { code, message, data } = await this.Api.upload({
        url: "/srv-cdn/image",
        file,
        token: this.Token.access_token
      });
      if (code === 401) {
        this.fnRefreshToken();
        this._fnUpload();
      } else if (code == 200) {
        this.$emit("change", data.link);
      } else {
        this.fnOpenNotification({ type: "error", message });
      }
    }
  }
};
</script>

<style scoped>
.avatar-container {
  padding: 10px 0px;
}

.avatar-container:hover {
  cursor: pointer;
}

.avatar-frame {
  border: 2px dashed #009688;
  display: flex;
  justify-content: center;
  height: 80px;
  width: 80px;
}

.file-upload {
  display: none;
}

.img-icon {
  position: absolute;
}
</style>
