<template>
  <div class="profile-page">

  <div class="user-info">
    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <img :src="profiles.image" class="user-img" />
          <h4>{{profiles.username}}</h4>
          <p>
            {{profiles.bio}}
          </p>
          <template v-if="user.username === $route.params.username">
            <nuxt-link ui-sref="app.settings"
            class="btn btn-sm btn-outline-secondary action-btn"
            :to="{name:'settings'}">
              <i class="ion-gear-a"></i>
              Edit Profile Settings
            </nuxt-link>
          </template>
          <template v-else>
            <button
            @click="onFollow(profiles.username)"
            :disabled="followButtonDisable"
            class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              {{profiles.following ? `unFollow ${profiles.username}` : `Follow ${profiles.username}`}}
              &nbsp;
            </button>
          </template>
        </div>

      </div>
    </div>
  </div>

  <div class="container">
    <div class="row">

      <div class="col-xs-12 col-md-10 offset-md-1">
        <div class="articles-toggle">
          <ul class="nav nav-pills outline-active">
            <li class="nav-item">
              <nuxt-link class="nav-link"
              :class="{active: tab === 'myarticle'}"
              :to="{name:'profile'}"
              exact
              >
                My Articles
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link"
              :class="{active: tab === 'favArticle'}"
              :to="{name:'profile',query:{tab:'favArticle'}}"
              exact
              >
                Favorited Articles
              </nuxt-link>
            </li>
          </ul>
        </div>

        <div class="article-preview"
        v-for="article in articles" :key="article.slug">
          <div class="article-meta">
            <nuxt-link :to="{name: 'profile', params: {username:article.author.username}}">
              <img :src="article.author.image" />
            </nuxt-link>
            <div class="info">
              <nuxt-link :to="{name: 'profile', params: {username:article.author.username}}">
                {{article.author.username}}
              </nuxt-link>
              <span class="date">{{articles.createdAt | date('MMM DD, YYYY') }}</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right"
            :class="{active:article.favorited}"
            @click="onFavorite(article)"
            :disabled="favoriteDisabled"
            >
              <i class="ion-heart"></i> {{ article.favoritesCount }}
            </button>
          </div>
          <nuxt-link :to="{name: 'article', params: {slug:article.slug}}"
          class="preview-link">
            <h1>{{article.title}}</h1>
            <p>{{article.body}}</p>
            <span>Read more...</span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <nav>
      <ul class="pagination">
        <li class="page-item"
        v-for="(item) in totlePage" :key="item"
        :class="{active: item==page}"
        >
          <nuxt-link :to="{name:'profile',query:{page:item,tab:tab}}"
          class="page-link">
            {{item}}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </div>
</div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getProfile, followUser, unfollowUser } from '@/api/profile.js'
  import { deleteFavorite, addFavorite } from '@/api/article.js'
  import { getArticles } from '@/api/article.js'
  const limit = 10
  export default {
    computed: {
      ...mapState(['user']),
      tab () {
        return this.$route.query.tab || 'myarticle'
      },
      page () {
        return this.$route.query.page || 1
      },
      totlePage () {
        return Math.ceil(this.articlesCount / limit)
      }
    },
    data () {
      return {
        profiles: {},
        articles: [],
        articlesCount: 0,
        followButtonDisable: false,
        favoriteDisabled: false
      }
    },
    middleware: ['authenticated'],
    name: 'profile',
    methods: {
      async getProfile () {
        const { data } = await getProfile(this.$route.params.username)
        this.profiles = data.profile
      },
      async getArticles () {
        const params = this.tab === 'myarticle' ?
        {
          author: this.$route.params.username,
          limit: limit,
          offset: (this.page-1)*limit
        } : {
          favorited: this.$route.params.username,
          limit: limit,
          offset: (this.page-1)*limit
        }
        const {data: articless} = await getArticles(params)
        const {articles, articlesCount} = articless
        this.articles = articles
        this.articlesCount = articlesCount
      },
      async onFollow (name){
        this.followButtonDisable = true
        if (this.profiles.following) {
          const { data } = await unfollowUser(name)
          this.profiles.following = data.profile.following
        } else {
          const { data } = await followUser(name)
          this.profiles.following = data.profile.following
        }
        this.followButtonDisable = false
      },
      async onFavorite(article) {
        this.favoriteDisabled = true
        if(article.favorited) {
          await deleteFavorite(article.slug)
          article.favorited = false
          article.favoritesCount-=1
        } else {
          await addFavorite(article.slug)
          article.favorited = true
          article.favoritesCount+=1
        }
        this.favoriteDisabled = false
      }
    },
    mounted () {
      this.getProfile()
      this.getArticles()
    },
    watch: {
      '$route.params.username' () {
        this.getProfile()
        this.getArticles()
      },
      '$route.query.tab' () {
        this.getArticles()
      },
      '$route.query.page' () {
        this.getArticles()
      }
    }
  }
</script>

<style lang="sass" scoped>

</style>
