<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, feild) in errors">
              <li v-for="(message, index) in messages"
                  :key="index">{{feild}} {{message}}</li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="image"
                       class="form-control"
                       type="text"
                       placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="username"
                       class="form-control form-control-lg"
                       type="text"
                       placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="bio"
                          class="form-control form-control-lg"
                          rows="8"
                          placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="email"
                       class="form-control form-control-lg"
                       type="text"
                       placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="password"
                       class="form-control form-control-lg"
                       type="password"
                       placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
      <button class="btn btn-outline-danger"
              @click="logout">
        Or click here to logout.
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateUser } from "@/api/user.js";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  computed: {
    ...mapState(["user"]),
  },
  middleware: ["authenticated"],
  data() {
    return {
      email: "",
      username: "",
      password: "",
      image: "",
      bio: "",
      errors: {},
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = await updateUser({
          user: {
            email: this.email || null,
            username: this.username || null,
            password: this.password || null,
            image: this.image || null,
            bio: this.bio || null,
          },
        });
        this.$store.commit("setUser", data.user);
        Cookie.set("user", data.user);
        this.$router.push({
          name: "profile",
          params: { username: data.user.username },
        });
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
    logout() {
      this.$store.commit("setUser", null);
      Cookie.remove("user");
      this.$router.push({ name: "home" });
    },
  },
  mounted() {
    this.email = this.user.email;
    this.username = this.user.username;
    this.image = this.user.image;
    this.bio = this.user.bio;
  },
};
</script>

<style lang="sass" scoped>
</style>
