<template>
  <div>
    <v-form ref="form">
      <v-card flat>
        <v-card-title class="headline font-weight-bold">
          {{ $t(`nav.profile`) }}
        </v-card-title>
        <v-card-text>
          <div :style="{ textAlign: 'center' }" v-if="IsFirstLogin">
            <span class="error--text">
              {{ $t(`profilePage.firstLoginMess`) }}
            </span>
          </div>
          <v-row>
            <v-col cols :sm="6">
              <v-upload v-model="Session.avatar" @change="_fnUpload" />
              <v-layout justify-center align-center>
                <span class="black--text">{{
                  `${Session.lastName} ${Session.firstName}`
                }}</span
                ><br />
                <span class="black--text">{{ Session.phone }}</span>
              </v-layout>
            </v-col>
            <v-col cols :sm="6">
              <v-layout justify-center align-center>
                <h2 class="black--text">
                  {{ $t(`profilePage.changePass`) }}
                </h2>
              </v-layout>
              <v-form class="mt-5" v-model="isValid" ref="form">
                <v-text-field
                  required
                  :rules="[Rules.minPass]"
                  placeholder=" "
                  :append-icon="`visibility${showOldPass ? '_off' : ''}`"
                  :type="showOldPass ? 'password' : ''"
                  @click:append="() => (showOldPass = !showOldPass)"
                  v-model="Profile.obj.oldPassword"
                >
                  <template #label>
                    {{ $t(`profilePage.oldPass`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
                <v-text-field
                  required
                  :rules="[Rules.minPass]"
                  placeholder=" "
                  :append-icon="`visibility${showNewPass ? '_off' : ''}`"
                  :type="showNewPass ? 'password' : ''"
                  @click:append="() => (showNewPass = !showNewPass)"
                  v-model="Profile.obj.newPassword"
                >
                  <template #label>
                    {{ $t(`profilePage.newPass`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
                <v-text-field
                  required
                  :rules="[confirmNewPass]"
                  placeholder=" "
                  :append-icon="`visibility${showConfirmNewPass ? '_off' : ''}`"
                  :type="showConfirmNewPass ? 'password' : ''"
                  @click:append="
                    () => (showConfirmNewPass = !showConfirmNewPass)
                  "
                >
                  <template #label>
                    {{ $t(`forgotPage.confirmPassword`) }}
                    <span class="red--text">
                      <strong>*</strong>
                    </span>
                  </template>
                </v-text-field>
                <v-layout justify-end>
                  <v-btn
                    class="primary"
                    tile
                    :disabled="!isValid"
                    @click="_fnChangePass()"
                  >
                    {{ $t(`profilePage.change`) }}
                  </v-btn>
                </v-layout>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: "Profile",
      newAvatar: "",
      showOldPass: true,
      showNewPass: true,
      showConfirmNewPass: true,
      isValid: false,
      avatar: {},
      confirmNewPass: v =>
        v === this[this.model].obj.newPassword || this.$t(`rule.confirmFail`)
    };
  },
  created() {
    this.newAvatar = this.Avatar;
    this.user = this.Username;
  },
  methods: {
    _fnUpload() {
      this[this.model].obj = {
        avatar: this.Session.avatar
      };
      this.fnPut({
        url: "/srv-auth/me",
        model: this.model
      }).then(() => {
        this.fnGetMe();
      });
    },

    async _fnChangePass() {
      await this.fnPost({
        url: "/srv-auth/change-password",
        model: this.model
      });
      this.$refs.form.reset();
    }
  }
};
</script>

<style scoped>
.avatar-container {
  padding: 10px 10px;
  display: flex;
  justify-content: center;
}

.avatar-container:hover {
  cursor: pointer;
}

.avatar-frame {
  border: 2px dashed #009688;
  display: flex;
  justify-content: center;
}

.avatar-img,
.avatar-frame {
  height: 80px;
  width: 80px;
}

.avatar-uploaded {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.file-upload {
  display: none;
}

.img-icon {
  position: absolute;
}
</style>
