<template>
  <v-layout align-center justify-center fill-height>
    <v-col cols :sm="6">
      <v-layout justify-center>
        <v-col cols :sm="8">
          <v-form
            v-model="Login.isValid"
            @submit.prevent="_fnLogin()"
            ref="form"
          >
            <v-card>
              <v-card-text>
                <v-text-field
                  :label="$t(`loginPage.username`)"
                  name="username"
                  v-model="Login.obj.username"
                  required
                  :rules="[Rules.required]"
                  prepend-icon="person"
                />
                <v-text-field
                  :label="$t(`loginPage.password`)"
                  name="password"
                  v-model="Login.obj.password"
                  required
                  :rules="[Rules.required, Rules.minPass]"
                  prepend-icon="lock"
                  @click:append="() => (ePass = !ePass)"
                  :append-icon="`visibility${ePass ? '_off' : ''}`"
                  :type="ePass ? 'password' : ''"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <div
                  :style="{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                  }"
                  x-small
                  type="link"
                >
                  <v-btn
                    type="submit"
                    color="primary"
                    :disabled="!Login.isValid"
                    block
                    tile
                    >{{ $t(`loginPage.loginBtn`) }}</v-btn
                  >
                  <v-btn tile text link to="/forgot" color="primary" block>{{
                    $t(`loginPage.forgotPass`)
                  }}</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-col>
      </v-layout>
    </v-col>
  </v-layout>
</template>

<script>
import b2g from "../assets/b2g.png";
export default {
  data() {
    return {
      model: "Login",
      ePass: true,
      b2gImg: b2g
    };
  },
  methods: {
    async _fnLogin() {
      const { data } = await this.fnPost({ url: "/login", model: this.model });
      if (data) {
        await this.fnSetToken(data);
        this.$router.push("/");
      }
      this.$refs.form.reset();
    }
  }
};
</script>
