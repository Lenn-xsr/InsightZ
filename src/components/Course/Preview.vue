<template>
  <section class="preview" v-if="course">
    <Header />
    <article>
      <h2>{{ course.title }}</h2>
      <div class="infos">
        <div
          class="sub-infos"
          v-if="course.softwares[0] || course.requeriments[0] || course.level || duration"
        >
          <div class="requeriments" v-if="course.softwares[0] || course.requeriments[0]">
            <div v-if="course.softwares[0]">
              <small>Softwares</small>
              <ul>
                <li v-for="software in course.softwares" :key="software">
                  {{ software }}
                </li>
              </ul>
            </div>
            <div v-if="course.requeriments[0]">
              <small>Requisitos</small>
              <ul>
                <li v-for="requeriment in course.requeriments" :key="requeriment">
                  {{ requeriment }}
                </li>
              </ul>
            </div>
          </div>
          <div class="basic-infos" v-if="course.level || duration.value">
            <div v-if="course.level">
              <small>Nível</small>
              <span>{{ course.level }}</span>
            </div>
            <div v-if="duration">
              <small>Duração</small>
              <span>{{ duration.value }} {{ duration.type }}</span>
            </div>
          </div>
        </div>
        <div>
          <img
            :src="
              course.image && course.image.link
                ? course.image.link
                : require('@/assets/BackgroundC.jpeg')
            "
            :alt="course.title"
            v-if="course.image.link"
          />
          <p>{{ course.description }}</p>
          <router-link class="btn" :to="{ path: '/#planos' }" v-if="!planCheck"
            >Liberar Acesso</router-link
          >
        </div>
      </div>
    </article>
    <article class="course-grade" v-if="course.modules[0]">
      <h2>Grade do curso</h2>
      <div v-for="(md, key) in course.modules" :key="md.title" class="module-wrapper">
        <h4 class="module-title">{{ md.title }}</h4>
        <ul class="module-content">
          <router-link
            tag="li"
            v-for="video in md.videos"
            class="module-video"
            :title="video.title"
            :key="video.title"
            :to="{
              name: 'Lesson',
              params: { lid: `${key}-${normalizeString(video.title)}` },
            }"
          >
            <div>
              <div class="lesson-locked" v-if="!planCheck && !video.free">
                <i class="fas fa-lock"></i>
                <router-link class="btn-buy" :to="{ path: '/#planos' }"
                  >Comprar</router-link
                >
              </div>
              <small v-if="video.duration">{{
                formatTime(convertMilliseconds(video.duration))
              }}</small>
              <img
                :src="video.thumb ? video.thumb : require('@/assets/BackgroundC.jpeg')"
                :alt="video.title"
              />
            </div>
            <span>{{ video.title }}</span>
          </router-link>
        </ul>
      </div>
    </article>
  </section>
  <Loading v-else />
</template>

<script>
import Header from '@/components/Basics/Header.vue';
import { convertMilliseconds, formatTime, normalizeString } from '@/helpers.js';

export default {
  name: 'Preview',
  props: ['course', 'planCheck'],
  components: { Header },
  computed: {
    duration() {
      let total = 0,
        converted,
        result;
      this.course.modules.forEach(md => {
        md.videos.forEach(vd => {
          total += vd.duration;
        });
      });
      converted = convertMilliseconds(total);
      for (let item in converted) {
        if (converted[item]) return { type: item, value: converted[item] };
      }
      return result;
    },
  },
  methods: {
    normalizeString,
    convertMilliseconds,
    formatTime,
  },
};
</script>

<style scoped>
.preview {
  margin-top: 70px;
}

.preview h2 {
  text-align: center;
  padding: 1rem;
}

.preview article {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.infos {
  display: flex;
  margin-top: 1.8rem;
}

.infos p {
  margin-top: 2rem;
  word-break: break-word;
  white-space: break-spaces;
}

.preview h1 {
  padding-top: 1.8rem;
  font-size: 1.6rem;
}

.sub-infos {
  width: 100%;
  margin-right: 2rem;
}

.sub-infos > div > div {
  margin-bottom: 30px;
}

.sub-infos > div small {
  margin: 15px 0;
  display: block;
  border-bottom: 1px solid var(--lighted);
  font-weight: bold;
}

.sub-infos li,
.sub-infos span {
  position: relative;
  font-size: 1rem;
}

.sub-infos li::before,
.sub-infos span::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  background-image: linear-gradient(var(--text-lighted), var(--lighted));
  border-radius: 50%;
  border: 2px solid #0e1013;
  margin-right: 6px;
  margin-right: 15px;
  position: absolute;
  left: -15px;
  top: 3px;
}

.course-grade h2 {
  margin-top: 3rem;
}

.module-wrapper h4 {
  padding: 15px 0;
  font-weight: bold;
}

.module-content {
  margin-top: 0.3125rem;
  margin-bottom: 1.875rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.module-video {
  position: relative;
  cursor: pointer;
  width: 230px;
  margin: 10px 15px;
}

.module-video small {
  position: absolute;
  top: 5px;
  background-color: var(--text-secondary);
  font-size: 0.7rem;
  padding: 3px;
}

.module-video span {
  font-size: 0.625rem;
  margin-top: 7px;
  display: block;
  color: #cacaca;
}

.module-video img {
  border-radius: 5px;
}

.infos .btn {
  margin-top: 25px;
  font-size: 1.1rem;
  text-align: left;
}

.lesson-locked {
  position: absolute;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 5px;
  background-color: #282828a3;
  border-radius: 5px;
}

.lesson-locked i {
  color: var(--text-primary);
}

.btn-buy {
  background-color: #e8810c;
  padding: 5px;
  border-radius: 5px;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.btn-buy:hover {
  background-color: var(--text-primary);
  color: #e8810c;
}
.module-video > div {
  position: relative;
}

@media screen and (max-width: 964px) {
  .infos {
    display: flex;
    flex-direction: column;
  }

  .interactions-wrapper {
    flex-direction: column;
  }
}

@media screen and (max-width: 724px) {
  .module-video {
    width: 100%;
  }
}
</style>
