<template>
  <div>
    <v-row justify="center">
      <v-col :sm="6" :md="6">
        <v-form v-model="valid" @submit.prevent="_fnReset()">
          <v-card>
            <v-card-text class="primary--text text-xs-center display-1">
              FORGOT PASSWORD
            </v-card-text>
            <v-card-text>
              <div class="forgot-content">
                <v-text-field
                  :label="$t(`forgotPage.phone`)"
                  name="phone"
                  prepend-icon="mdi-phone"
                  v-model="Forgot.obj.phone"
                />
                <div :style="{ padding: '10px' }">
                  <v-btn
                    tile
                    :disabled="
                      !/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(
                        Forgot.obj.phone
                      ) || timer
                    "
                    width="64px"
                    color="primary"
                    @click="_fnSendOtp"
                    >{{ !timer ? $t(`forgotPage.sendOtp`) : resendTime }}</v-btn
                  >
                </div>
              </div>
              <div v-if="sendOtp">
                <v-text-field
                  :label="$t(`forgotPage.otp`)"
                  name="otp"
                  prepend-icon="mdi-shield"
                  v-model="Forgot.obj.code"
                />
                <v-text-field
                  :label="$t(`forgotPage.password`)"
                  name="phone"
                  prepend-icon="lock"
                  v-model="Forgot.obj.password"
                  @click:append="() => (ePass = !ePass)"
                  :append-icon="`visibility${ePass ? '_off' : ''}`"
                  :type="ePass ? 'password' : ''"
                  required
                  :rules="[Rules.minPass]"
                />
                <v-text-field
                  :label="$t(`forgotPage.confirmPassword`)"
                  name="confirmPassword"
                  @click:append="() => (eConfirm = !eConfirm)"
                  :append-icon="`visibility${eConfirm ? '_off' : ''}`"
                  prepend-icon="mdi-lock-outline"
                  :type="eConfirm ? 'password' : ''"
                  required
                  :rules="[confirmRule]"
                />
                <v-btn
                  tile
                  block
                  color="primary"
                  :disabled="!valid"
                  @click="_fnCreatePwd"
                  >{{ $t(`forgotPage.createBtn`) }}</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      model: "Forgot",
      phoneNumber: "",
      verified: false,
      sendOtp: false,
      otpCode: "",
      ePass: true,
      eConfirm: true,
      password: "",
      confirmRule: v =>
        v === this[this.model].obj.password || this.$t(`rule.confirmFail`),
      resendTime: "",
      timer: false
    };
  },
  methods: {
    _fnSendOtp() {
      this.sendOtp = true;
      this._fnRunTimer();
      this.fnPost({
        url: "/srv-auth/forgot-password",
        model: this.model
      });

      // this.Api.post({
      //   url: "/srv-auth/forgot-password",
      //   body: { phone: this.phoneNumber }
      // });
    },
    _fnRunTimer() {
      const second2Time = input => {
        const minutes = Math.floor(input / 60);
        const seconds =
          Math.floor(input - minutes * 60).toString() +
          `${this.$t(`time.seconds`)}`;
        return minutes > 0
          ? minutes.toString() + `${this.$t(`time.minute`)}` + seconds
          : seconds;
      };
      this.timer = true;
      var time = 300;
      this.resendTime = second2Time(time);
      var reSend = setInterval(() => {
        time--;
        this.resendTime = second2Time(time);
        if (time === -1) {
          clearInterval(reSend);
          this.timer = false;
        }
      }, 1000);
    },
    _fnCreatePwd() {
      this.fnPost({ url: "/srv-auth//forgot-password/otp", model: this.model });
      this.$router.push("/login");
      // this.Api.post({
      //   url: "/srv-auth//forgot-password/otp",
      //   body: {
      //     phone: this.phoneNumber,
      //     code: this.otpCode,
      //     password: this.password
      //   }
      // }).then(() => {
      //   this.$router.push("/login");
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.forgot-content {
  display: flex;
  align-items: center;
  text-transform: none;
}
</style>
