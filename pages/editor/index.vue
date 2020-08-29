<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, feild) in errors">
              <li v-for="message in messages"
                  :key="feild+message">{{feild}} {{message}}</li>
            </template>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input :disabled="publishDisable"
                       v-model="article.title"
                       type="text"
                       class="form-control form-control-lg"
                       placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input :disabled="publishDisable"
                       v-model="article.description"
                       type="text"
                       class="form-control"
                       placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea :disabled="publishDisable"
                          v-model="article.body"
                          class="form-control"
                          rows="8"
                          placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input :disabled="publishDisable"
                       v-model="article.tagList"
                       type="text"
                       class="form-control"
                       placeholder="Enter tags">
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary"
                      type="button"
                      @click="updateArt"
                      :disabled="publishDisable">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, updateArticle, addArticle } from "@/api/article.js";
export default {
  data() {
    return {
      article: {},
      tagList: "",
      publishDisable: false,
      errors: {},
    };
  },
  middleware: ["authenticated"],
  methods: {
    async getArticle() {
      if (this.$route.query.slug) {
        const { data } = await getArticle(this.$route.query.slug);
        this.article = data.article;
        this.tagList = this.article.tagList.join(" ");
      }
    },
    async updateArt() {
      this.publishDisable = true;
      try {
        if (this.$route.query.slug) {
          const { data } = await updateArticle(this.article.slug, {
            article: {
              title: this.article.title || "",
              body: this.article.body || "",
              description: this.article.description || "",
              tagList: this.article.tagList || [],
            },
          });
          this.$router.push({
            name: "article",
            params: { slug: data.article.slug },
          });
        } else {
          const { data } = await addArticle({
            article: {
              title: this.article.title || "",
              body: this.article.body || "",
              description: this.article.description || "",
              tagList: this.article.tagList || [],
            },
          });
          this.$router.push({
            name: "article",
            params: { slug: data.article.slug },
          });
        }
      } catch (e) {
        this.errors = e.response.data.errors;
      }
      this.publishDisable = false;
    },
  },
  mounted() {
    this.getArticle();
  },
};
</script>

<style lang="sass" scoped>
</style>
