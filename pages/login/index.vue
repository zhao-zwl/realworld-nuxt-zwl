<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{isLogin?'sign in':'sign up'}}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link v-if="isLogin"
                       to="register">Need an account?</nuxt-link>
            <nuxt-link v-else
                       to="login">Have an account?</nuxt-link>

          </p>

          <ul class="error-messages">
            <template v-for="(messages,field) in errors">
              <li v-for="(message,index) in messages"
                  :key="index">{{field }} {{message}}</li>
            </template>

          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group"
                      v-if="!isLogin">
              <input class="form-control form-control-lg"
                     type="text"
                     placeholder="Your Name"
                     v-model="username"
                     required>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg"
                     v-model="user.email"
                     type="email"
                     placeholder="Email"
                     required>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg"
                     v-model="user.password"
                     type="password"
                     minlength="8"
                     placeholder="Password"
                     required>
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{isLogin?'sign in':'sign up'}}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { login, register } from "@/api/user.js";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware:['notAuthenticated'],
  name: "login",
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user,
            })
          : await register({
              user: this.user,
            });
        this.$store.commit("setUser", data.user);
        Cookie.set("user", data.user);
        this.$router.push("/");
      } catch (error) {
        console.dir(error);
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>
