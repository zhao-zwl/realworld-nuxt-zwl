<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{article.title}}</h1>
        <articles-metas :article="article"></articles-metas>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12"
             v-html="article.body">
        </div>
      </div>
    </div>
    <div class="article-actions">
      <articles-metas :article="article"></articles-metas>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-8 offset-md-2">
        <articles-comments :article="article"></articles-comments>
      </div>
    </div>
  </div>
</template>

<script>
import ArticlesMetas from "./components/article-metas";
import ArticlesComments from "./components/article-comments";
import { getArticle } from "@/api/article";
import MarkdownIt from "markdown-it";
export default {
  name: "articles",
  components: {
    ArticlesMetas,
    ArticlesComments,
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article,
    };
  },
};
</script>
