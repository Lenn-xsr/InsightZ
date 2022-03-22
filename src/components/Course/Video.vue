<template>
  <section class="lesson" v-if="video && planCheck">
    <article class="lesson-content">
      <div class="lesson-title">
        <h1>{{ video.playing.title }}</h1>
        <small
          ><router-link :to="{ name: 'Courses' }">Cursos</router-link> >
          <router-link :to="{ name: 'Course', params: { cid } }">{{
            course.title
          }}</router-link>
          >
          <router-link :to="{ name: 'Lesson', params: { lid } }">{{
            video.playing.title
          }}</router-link></small
        >
      </div>
      <div
        class="video"
        v-if="video.playing.hash != '' && videoSources && videoSources[0]"
      >
        <Player
          :sources="videoSources"
          :markers="video.playing.markers || []"
          :resetPlayer="resetPlayer"
          :next="video.next && video.next.normalizedTitle"
          :playing="video.playing"
          v-if="loaded"
        />
        <div class="video-control">
          <router-link
            :to="
              video.previos
                ? {
                    name: 'Lesson',
                    params: { lid: video.previos.normalizedTitle },
                  }
                : ''
            "
            tag="button"
            :title="video.previos ? video.previos.video.title : ''"
            :disabled="!video.previos"
            ><i class="fas fa-caret-left"></i> Anterior</router-link
          >
          <router-link
            :to="
              video.next
                ? {
                    name: 'Lesson',
                    params: { lid: video.next.normalizedTitle },
                  }
                : ''
            "
            tag="button"
            :title="video.next ? video.next.video.title : ''"
            :disabled="!video.next"
            >Próxima <i class="fas fa-caret-right"></i
          ></router-link>
        </div>
        <div
          class="video-content"
          v-if="
            (video.playing.archives && video.playing.archives[0]) ||
            (video.playing.description && video.playing.description != '')
          "
        >
          <p
            class="video-description"
            v-if="video.playing.description && video.playing.description != ''"
            v-html="urlify(video.playing.description)"
          ></p>
          <ul
            class="video-archives"
            v-if="video.playing.archives && video.playing.archives[0]"
          >
            <li v-for="archive in video.playing.archives" :key="archive.name">
              <a :href="archive.link" target="_blank">
                <i class="fas fa-file-alt"></i>
                {{ archive.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="only-resources" v-else>
        <ul
          class="video-archives"
          v-if="video.playing.archives && video.playing.archives[0]"
        >
          <li v-for="archive in video.playing.archives" :key="archive.name">
            <a :href="archive.link" target="_blank">
              <i class="fas fa-file-alt"></i>
              {{ archive.name }}
            </a>
          </li>
        </ul>
      </div>
    </article>
    <Interactions
      :lid="lid"
      :cid="cid"
      :video="video"
      v-if="user._id && video.playing.hash != ''"
    />
  </section>
  <Preview v-else-if="!planCheck || !user._id" :course="course" :planCheck="planCheck" />
  <Loading v-else />
</template>

<script>
import Interactions from './Interactions.vue';
import Preview from './Preview.vue';
import Player from './Player.vue';
import { normalizeString, urlify } from '@/helpers.js';
import { mapState } from 'vuex';
import { api } from '@/services.js';

export default {
  name: 'Video',
  props: ['modules', 'lid', 'cid', 'course'],
  components: { Interactions, Preview, Player },
  data() {
    return {
      loaded: true,
      videoSources: null,
    };
  },
  computed: {
    md() {
      const moduleIndex = this.lid.split('-')[0];
      return this.modules[Number(moduleIndex)];
    },
    video() {
      const moduleIndex = this.lid.split('-')[0];
      const videoTitle = this.lid.replace(`${moduleIndex}-`, '');
      let playing = this.findVideo(videoTitle);
      if (!playing) return false;
      const next = this.findVideo(null, playing.index + 1);
      const previos = this.findVideo(null, playing.index - 1, true);

      this.getSources(playing.video.hash);

      return {
        playing: playing.video,
        next,
        previos,
      };
    },
    planCheck() {
      if (!this.user._id && this.video.playing.free) return true;
      else if (!this.user._id && !this.video.playing.free) return false;
      else
        return this.course.plan.toLowerCase() == 'anual' && !this.video.playing.free
          ? this.user._id && this.user.plan
            ? this.anualTags.includes(this.user.plan)
            : false
          : true;
    },
    ...mapState(['user', 'anualTags']),
  },
  methods: {
    resetPlayer() {
      this.loaded = false;
      this.$nextTick(() => {
        this.loaded = true;
      });
    },
    findVideo(title, index, previos) {
      let data;

      if (!this.md) return null;

      if (title) {
        const videoIndex = this.md.videos.findIndex(
          video => normalizeString(video.title) == title
        );
        data =
          videoIndex >= 0
            ? {
                index: videoIndex,
                video: this.md.videos[videoIndex],
              }
            : null;
      } else if (index != undefined) {
        let video = this.md.videos[index];
        if (video) {
          data = {
            normalizedTitle: `${this.lid.split('-')[0]}-${normalizeString(video.title)}`,
            video,
          };
        } else if (index == this.md.videos.length || previos) {
          const toModuleIndex = previos
            ? Number(this.lid.split('-')[0]) - 1
            : Number(this.lid.split('-')[0]) + 1;
          const toModule = this.modules[toModuleIndex];
          if (toModule) video = toModule.videos[previos ? toModule.videos.length - 1 : 0];
          data = video
            ? {
                normalizedTitle: `${toModuleIndex}-${normalizeString(video.title)}`,
                video,
              }
            : null;
        }
      }

      return data;
    },
    getSources(hash) {
      this.videoSources = null;
      return api.get(`/video/v2/${hash}`).then(r => {
        this.videoSources = r.data.map(video => {
          const qlt = video.public_name.split(' ')[1];

          return {
            src: video.link,
            type: video.type,
            label: qlt,
            size: Number(qlt.replace('p', '')),
          };
        });
      });
    },
    urlify,
  },
  created() {
    if (!this.video) return this.$router.push({ path: `/curso/${this.cid}` });
  },
};
</script>

<style scoped>
.lesson article {
  max-width: calc(300vh / 2);
  margin: 0 auto;
  width: 100%;
}

.lesson-title {
  margin: 1rem 0;
  position: relative;
}

.lesson-title h1 {
  font-size: 1.3rem;
}

.lesson-title small {
  font-size: 0.8rem;
  font-style: italic;
  color: #7b7b78;
  margin-top: 8px;
  display: block;
}

.lesson-title a {
  color: #7b7b78;
}

.lesson-title a:hover {
  color: var(--text-primary);
}

.video-control {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--tertiary);
}

.video-control button {
  padding: 10px 23px;
  font-size: 0.8rem;
  color: var(--text-primary);
  background-color: var(--tertiary);
  border: 1px solid var(--lighted);
  border-radius: 4px;
}

.video-control button:disabled {
  cursor: not-allowed;
  background-color: var(--lighted);
  color: var(--tertiary);
}

.video-control button:hover {
  background-color: var(--lighted);
}

.video-description {
  margin-top: 1.6rem;
  max-width: 80%;
}

.video-content {
  display: flex;
  justify-content: space-between;
}

.video-archives {
  margin-top: 1.6rem;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  align-items: flex-end;
}

.video-archives li {
  background-color: var(--text-primary);
  padding: 10px;
  border-radius: 5px;
  width: max-content;
  margin: 10px;
  margin-left: 0;
}

.video-archives li:hover {
  background-color: var(--text-lighted);
}

.video-archives a {
  color: var(--secondary);
}

.only-resources .video-archives {
  align-items: flex-start;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
}

@media screen and (max-width: 964px) {
  .video-content {
    flex-direction: column;
  }
}
</style>
