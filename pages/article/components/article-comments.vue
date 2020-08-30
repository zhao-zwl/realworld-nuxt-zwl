<template>
  <div>
    <form @submit.prevent="onAddComment"
          class="card comment-form">
      <div class="card-block">
        <textarea v-model="comment"
                  class="form-control"
                  placeholder="Write a comment..."
                  rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image"
             class="comment-author-img" />
        <button :disabled="addComDisabled"
                class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
    <template v-if="comments && comments.length">
      <div class="card"
           v-for="comment in comments"
           :key="comment.id">
        <div class="card-block">
          <p class="card-text">{{comment.body}}</p>
        </div>
        <div class="card-footer">
          <nuxt-link :to="{name: 'profile',params:{username:comment.author.username}}"
                     class="comment-author">
            <img :src="comment.author.image"
                 class="comment-author-img" />
          </nuxt-link>
          &nbsp;
          <nuxt-link :to="{name: 'profile',params:{username:comment.author.username}}"
                     class="comment-author">
            {{comment.author.username}}
          </nuxt-link>
          <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
          <span class="mod-options" v-if="comment.author.username === user.username">
            <i class="ion-trash-a" @click="delComment(comment)"></i>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getComments, addCommet,delCommet} from "@/api/article.js";
import { mapState } from "vuex";
export default {
  name: "ArticlesComments",
  props: {
    article: Object,
    reuqired: true,
  },
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      comments: [],
      comment: "",
      addComDisabled: false,
    };
  },
  async mounted() {
    this.getComments();
  },
  methods: {
    async onAddComment() {
      this.addComDisabled = true;
      if (this.comment !== "") {
        await addCommet(this.article.slug, {
          comment: {
            body: this.comment,
          },
        });
      }
      this.getComments();
      this.addComDisabled = false;
    },
    async getComments() {
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
      this.comment = "";
    },
    async delComment(item){
      await delCommet(this.article.slug,item.id);
      this.getComments();
    }
  },
};
</script>

<style lang="css" scoped>
</style>
