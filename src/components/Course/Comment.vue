<template>
  <div class="comment">
    <span>{{ comment.full_name ? comment.full_name : comment.username }}</span>
    <p>{{ comment.text }}</p>
    <div class="reply-comment" v-if="allowReply">
      <label :for="comment.id" @click="closeAnothers(comment.id)"
        ><i class="fas fa-reply"></i> Responder</label
      >
      <input type="checkbox" :id="comment.id" style="display: none" />
      <form>
        <textarea
          name="comment"
          id="comment"
          cols="30"
          rows="10"
          v-model.lazy="reply"
          maxlength="635"
          placeholder="Escreva sua resposta..."
          required
        ></textarea>
        <button type="submit" class="btn" @click.prevent="addReply">Responder</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Comment',
  props: ['comment', 'playing', 'getInteractions', 'course', 'lid', 'allowReply'],
  data() {
    return {
      reply: '',
    };
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    closeAnothers(id) {
      const comments = document.querySelectorAll('.comment input[type=checkbox]');
      for (let inp of comments) {
        if (inp.checked && inp.id != id) inp.checked = false;
      }
    },
    addReply() {
      if (this.user._id && this.reply != '') {
        this.updateComment({
          id: Date.now(),
          text: this.reply.slice(0, 635),
          username: this.user.username,
          full_name: this.user.full_name,
        });
        this.reply = '';
      }
    },
    async updateComment(object) {
      await this.getInteractions();
      const moduleIndex = Number(this.lid.split('-')[0]);
      const videoIndex = this.course.modules[moduleIndex].videos.findIndex(
        vd => vd.title == this.playing.title
      );
      const commentIndex = this.playing.comments.findIndex(c => c.id == this.comment.id);

      if (!this.playing.comments[commentIndex].replys)
        this.playing.comments[commentIndex].replys = [];

      this.playing.comments[commentIndex].replys.push(object);
      this.course.modules[moduleIndex].videos[videoIndex].comments[
        commentIndex
      ] = this.playing.comments[commentIndex];

      this.managementUpdateOne({ payload: this.course, route: 'COURSE' });
    },
    ...mapActions(['managementUpdateOne']),
  },
};
</script>

<style scoped>
.comment {
  border-radius: 5px 20px;
  max-width: 900px;
}

.comment span {
  background-color: var(--tertiary);
  padding: 10px 15px;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 5px;
}

.comment p {
  padding: 10px 15px;
  background-color: var(--lighted);
  border-radius: 0 20px 20px;
}

.reply-comment label {
  font-size: 0.8rem;
  margin-left: 12px;
  cursor: pointer;
  user-select: none;
}

.reply-comment label:hover {
  color: var(--text-lighted);
}

.reply-comment label i {
  transform: rotate(180deg);
}

.comment form {
  flex-direction: column;
  opacity: 0;
  height: 0;
  display: flex;
  overflow: hidden;
  animation-name: reverse;
  animation-duration: 0.3s;
  padding: 5px;
}

.comment input[type='checkbox']:checked ~ form {
  animation-name: formanim;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

.comment form button {
  padding: 5px 15px;
  font-size: 0.8rem;
  margin: 10px 0;
  background-color: var(--tertiary);
  border: 1px solid var(--lighted);
  align-self: flex-end;
}

.comment form button:hover {
  background-color: var(--lighted) !important;
}

.comment form textarea {
  background-color: var(--tertiary);
  border: none;
  color: var(--text-primary);
  padding: 15px;
  width: 100%;
  height: 197px;
}

@keyframes formanim {
  from {
    opacity: 0;
    height: 0;
    transform: translate3d(0, -20px, 0);
  }
  to {
    height: max-content;
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }
}

@keyframes reverse {
  from {
    height: max-content;
    opacity: 1;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 0;
    height: 0;
    transform: translate3d(0, -20px, 0);
  }
}
</style>
