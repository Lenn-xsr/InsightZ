<template>
  <article class="lesson-interactions" v-if="playing">
    <h3>Comentários</h3>
    <div class="interactions-wrapper">
      <form class="new-comment">
        <div>
          <img
            :src="
              user.avatar ? user.avatar.link : require('@/assets/default_avatar.webp')
            "
          />
          <textarea
            name="comment"
            id="comment"
            cols="30"
            rows="10"
            v-model="comment"
            maxlength="635"
            placeholder="Escreva seu comentário..."
            required
          ></textarea>
        </div>
        <button type="submit" class="btn" @click.prevent="addComment">Comentar</button>
      </form>
      <div class="complete-course">
        <div class="progress-wrapper">
          <div class="progress">
            <div class="progress-bar" :style="{ width: `${courseProgress || 0}%` }"></div>
          </div>
          <small>{{ (courseProgress.toFixed() || 0) + '%' }}</small>
        </div>
        <div class="complete-wrapper">
          <div class="avaliation">
            <h4>Avaliação</h4>
            <div class="stars-wrapper">
              <label
                v-for="n in 5"
                :key="n"
                :class="
                  playing.completed
                    ? 'fas fa-star disabled'
                    : n <= avaliation
                    ? 'fas fa-star active'
                    : 'fas fa-star'
                "
                :for="'star-' + n"
              >
                <input
                  type="radio"
                  name="avaliation-star"
                  :id="'star-' + n"
                  checked
                  v-model="avaliation"
                  :value="n"
                  :disabled="playing.completed"
                />
              </label>
            </div>
          </div>
          <div>
            <button
              class="btn"
              @click="playing.completed ? '' : completeLesson()"
              :disabled="playing.completed"
            >
              {{ playing.completed ? 'Concluído' : 'Marcar como concluído' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <ul class="comments-wrapper" v-if="playing.comments && playing.comments[0]">
      <li v-for="ct in playing.comments" :key="ct.id" class="comment-wrapper">
        <Comment
          :comment="ct"
          :course="course"
          :playing="playing"
          :getInteractions="getInteractions"
          :lid="lid"
          :allowReply="true"
        />
        <div class="replys-wrapper">
          <ul class="replys">
            <li v-for="reply in ct.replys" :key="reply.id">
              <Comment
                :comment="reply"
                :course="course"
                :playing="playing"
                :getInteractions="getInteractions"
                :lid="lid"
              />
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </article>
  <Loading v-else />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import course from '@/mixins/course.js';
import Comment from './Comment.vue';
import { api } from '@/services.js';

export default {
  name: 'Interactions',
  props: ['lid', 'cid', 'video'],
  components: { Comment },
  mixins: [course],
  data() {
    return {
      comment: '',
      playing: null,
      avaliation: 1,
    };
  },
  computed: {
    courseProgress() {
      let all = [];
      this.course.modules.forEach(md => {
        all = [
          ...all,
          ...md.videos.map(vd => !this.user.completed_lessons.includes(vd.hash)),
        ];
      });
      let filtered = all.filter(item => item);

      return ((all.length - filtered.length) * 100) / all.length;
    },
    ...mapState(['user']),
  },
  methods: {
    async completeLesson() {
      const tempComplete = [
        ...new Set([...this.user.completed_lessons, this.playing.hash]),
      ];
      this.updateVideo('ratings', {
        user: this.user.username,
        stars: this.avaliation,
      });

      if (this.video.next)
        this.$router.push({
          to: 'Lesson',
          params: { lid: this.video.next.normalizedTitle },
        });

      await this.$store.commit('UPDATE_USER', {
        completed_lessons: tempComplete,
      });
      this.updateUser(this.user);
    },
    addComment() {
      if (this.user._id && this.comment != '') {
        this.updateVideo('comments', {
          id: Date.now(),
          text: this.comment.slice(0, 635),
          username: this.user.username,
          full_name: this.user.full_name,
          replys: [],
        });
        this.comment = '';
        this.avaliation = 1;
      }
    },
    async updateVideo(arrName, object) {
      await this.getInteractions();
      const moduleIndex = Number(this.lid.split('-')[0]);
      const videoIndex = this.course.modules[moduleIndex].videos.findIndex(
        vd => vd.title == this.video.playing.title
      );

      if (!this.playing[arrName]) this.playing[arrName] = [];

      this.playing[arrName].push(object);
      this.course.modules[moduleIndex].videos[videoIndex] = this.playing;

      this.managementUpdateOne({ payload: this.course, route: 'COURSE' });
    },
    getInteractions() {
      return api.get(`/courses?ctg=${this.category._id}`).then(({ data }) => {
        const course = data.courses.find(cs => cs._id == this.course._id);
        let video = course.modules[this.lid.split('-')[0]].videos.find(
          vd => vd.title == this.video.playing.title
        );
        const completed = this.user.completed_lessons.includes(this.video.playing.hash);

        video.completed = completed;
        this.playing = video;
      });
    },
    ...mapActions(['managementUpdateOne', 'updateUser', 'localGet']),
  },
  async created() {
    await this.getCourse();
    this.getInteractions();
  },
  watch: {
    'video.playing': {
      handler() {
        this.getInteractions();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.lesson-interactions {
  margin-top: 30px !important;
}

.lesson-interactions h3 {
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 30px;
  display: block;
}

.interactions-wrapper {
  display: flex;
}

.new-comment {
  width: 100%;
  margin-right: 40px;
}

.new-comment img {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  margin-right: 15px;
}

.new-comment div {
  display: flex;
}

.new-comment textarea {
  background-color: var(--tertiary);
  border: none;
  color: var(--text-primary);
  padding: 15px;
  width: 100%;
  height: 197px;
}

.new-comment button {
  padding: 5px 15px;
  font-size: 0.8rem;
  margin: 10px 0;
  background-color: var(--tertiary);
  border: 1px solid var(--lighted);
  float: right;
}

.new-comment button:hover {
  background-color: var(--lighted) !important;
}

.progress-wrapper {
  display: flex;
}

.progress-wrapper small {
  font-size: 0.8rem;
  color: var(--activated);
}

.progress {
  width: 100%;
  background-color: #4d4d448a;
  height: 12px;
  margin-right: 10px;
  border-radius: 10px;
}

.progress-bar {
  background-color: #e8810c;
  border-radius: 10px;
}

.avaliation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avaliation h4 {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.75rem;
}

.avaliation input {
  display: none;
}

.avaliation label {
  color: var(--text-primary);
  cursor: pointer;
  font-size: 1rem;
}

.avaliation label.active {
  color: #e8810c;
}

.avaliation label.disabled {
  color: var(--activated);
}

.complete-wrapper {
  width: clamp(100px, 320px, 500px);
}

.complete-wrapper > div {
  border: 3px solid var(--primary);
  padding: 1rem 1.5rem;
  border-radius: 10px 10px 0 0;
  background-color: var(--tertiary);
}

.complete-wrapper > div:not(:first-child) {
  border-top: 0;
  border-radius: 0 0 10px 10px;
}

.complete-wrapper button {
  width: 100%;
}

.comments-wrapper {
  margin-top: 40px;
}

.comments-wrapper li:not(:first-child) {
  margin-top: 20px;
}

.comment-wrapper .replys-wrapper {
  margin-left: 25px;
}

@media screen and (max-width: 964px) {
  .interactions-wrapper {
    flex-direction: column;
  }

  .new-comment img {
    display: none;
  }

  .complete-course,
  .comments-wrapper {
    margin-top: 30px;
  }

  .complete-wrapper {
    width: 100%;
  }
}
</style>
