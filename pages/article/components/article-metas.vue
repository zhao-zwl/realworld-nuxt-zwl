<template>
  <div class="article-meta">
    <nuxt-link :to="{name:'profile',params:{username:article.author.username}}">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link class="author"
                 :to="{name:'profile',params:{username:article.author.username}}">
        {{article.author.username}}
      </nuxt-link>
      <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>
    <template v-if="article.author.username === user.username">
      <nuxt-link class="btn btn-outline-secondary btn-sm"
                 :to="{name:'editor',query:{slug:article.slug}}">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button class="btn btn-outline-danger btn-sm"
              @click="deleteMyAtricle(article.slug)"
              :disabled="deleteDisable">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button :class="{active: article.author.following}"
              class="btn btn-sm btn-outline-secondary"
              @click="onFollow(article.author.username)"
              :disabled="followButtonDisable">
        <i class="ion-plus-round"></i>
        {{article.author.following ? `unFollow ${article.author.username}` : `Follow ${article.author.username}`}}
        &nbsp;
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary"
              @click="onFavorite(article)"
              :disabled="favoriteDisabled"
              :class="{active:article.favorited}">
        <i class="ion-heart"></i>
        &nbsp;
        {{article.favorited ? "unFavorite Post" : "Favorite Post "}}
        <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addFavorite, deleteFavorite, deleteArticle } from "@/api/article.js";
import { followUser, unfollowUser } from "@/api/profile.js";
export default {
  name: "ArticlesMetas",
  computed: {
    ...mapState(["user"]),
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      followButtonDisable: false,
      favoriteDisabled: false,
      deleteDisable: false,
    };
  },
  methods: {
    async deleteMyAtricle(slug) {
      this.deleteDisable = true;
      const { data } = await deleteArticle(slug);
      this.deleteDisable = false;
      this.$router.replace("/");
    },
    async onFollow(name) {
      this.followButtonDisable = true;
      if (this.article.author.following) {
        const { data } = await unfollowUser(name);
        this.article.author.following = data.profile.following;
      } else {
        const { data } = await followUser(name);
        this.article.author.following = data.profile.following;
      }
      this.followButtonDisable = false;
    },
    async onFavorite(article) {
      this.favoriteDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      this.favoriteDisabled = false;
    },
  },
};
</script>

<style lang="css" scoped>
</style>
