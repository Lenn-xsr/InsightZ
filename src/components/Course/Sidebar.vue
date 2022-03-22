<template>
  <div
    :class="menu ? 'sidenav-wrapper active' : 'sidenav-wrapper desactive'"
    v-if="course"
  >
    <div class="sidenav-title">
      <router-link tag="h2" :to="{ name: 'Course', params: { cid } }">{{
        course.title
      }}</router-link>
      <label class="side-btn" for="side-menu"></label>
      <input type="checkbox" name="menu" id="side-menu" v-model="menu" />
    </div>
    <div class="sidenav">
      <span v-if="course.modules[0]">Grade do curso</span>
      <div v-for="(md, key) in course.modules" :key="md.title" class="module-wrapper">
        <div class="module-title">
          <h4>{{ md.title }}</h4>
          <small>{{ getModuleTime(md.videos) }}</small>
        </div>
        <ul :class="hasFree ? 'module-content has-free' : 'module-content'">
          <router-link
            tag="li"
            v-for="video in md.videos"
            :key="video.title"
            :to="{
              name: 'Lesson',
              params: { lid: `${key}-${normalizeString(video.title)}` },
            }"
            :class="isCompleted(video.hash, video.free)"
          >
            <span>{{ video.title }}</span>
            <small v-if="video.duration">{{
              formatTime(convertMilliseconds(video.duration))
            }}</small>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { normalizeString, formatTime, convertMilliseconds } from '@/helpers.js';

export default {
  name: 'Sidebar',
  props: ['course', 'cid', 'planCheck'],
  data() {
    return {
      hasFree: false,
      menu: false,
    };
  },
  computed: {
    totalLessons() {
      let total = 0;
      this.course.modules.forEach(v => {
        total += v.videos.length;
      });
      return total;
    },
  },
  methods: {
    isCompleted(hash, free) {
      if (free) {
        this.hasFree = true;
        return 'lesson free';
      }
      if (!this.$store.state.user._id || !this.planCheck) return 'lesson';
      else
        return this.$store.state.user.completed_lessons.includes(hash)
          ? 'lesson completed'
          : 'lesson not-completed';
    },
    getModuleTime(videos) {
      let total = 0;
      videos.forEach(video => {
        total += video.duration;
      });
      return formatTime(convertMilliseconds(total));
    },
    normalizeString,
    formatTime,
    convertMilliseconds,
  },
  created() {
    this.course.modules = this.course.modules.filter(md => md.visible);
  },
};
</script>

<style scoped>
.sidenav-wrapper {
  background-color: var(--secondary);
}

.sidenav-title {
  padding: 1.5rem 1rem;
  background-image: linear-gradient(
    to bottom right,
    rgba(31, 2, 35, 0.9),
    rgba(6, 14, 31, 0.9)
  );
  border-bottom: 1px solid #151b32;
}

.sidenav-wrapper h2 {
  cursor: pointer;
  display: flex;
  color: var(--text-primary);
  font-weight: bold;
  font-size: 0.95rem;
}

.sidenav-wrapper h2::before {
  content: '';
  display: block;
  width: 3px;
  border-radius: 10px;
  background-color: var(--text-lighted);
  margin-right: 9px;
}

.sidenav-wrapper,
.sidenav-wrapper > div {
  transition: all 0.3s;
}

.sidenav-wrapper,
.sidenav {
  width: 100%;
  max-width: 19rem;
  position: fixed;
  box-shadow: 2px 0 10px 2px rgba(0, 0, 0, 0.2);
  z-index: 999999;
}

.sidenav {
  background-image: linear-gradient(
      to bottom right,
      rgba(6, 14, 31, 0.9),
      rgba(31, 2, 35, 0.9)
    ),
    url(../../assets/Barralateral.jpg);
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 9rem;

  scrollbar-width: thin;
  scrollbar-color: var(--lighted) transparent;
}

.sidenav > span {
  padding: 1rem;
  margin: 0;
  font-size: 0.89rem;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.sidenav > span > small {
  font-size: 0.7rem;
}

.sidenav .module-wrapper:not(:first-of-type) .module-title {
  margin-top: 2.5rem;
}

.module-title {
  background-color: rgba(2, 2, 2, 0.5);
  padding: 15px 20px;
  box-shadow: 5px 0 10px 2px rgba(0, 0, 0, 0.2);
  margin: 0;
  display: flex;
  align-items: center;
}

.module-title h4 {
  font-weight: normal;
  font-size: 0.95rem;
  width: 90%;
}

.module-title small {
  color: #3e3d3d;
  float: right;
  font-size: 0.7rem;
}

.lesson {
  padding: 0 10px 0 10px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
}

.lesson::after {
  display: inline-block;
  width: 5px;
  height: 5px;
  border: 0.5px solid #0e1013b3;
  margin: 15px;
  margin-right: 10px;
  aspect-ratio: 1;
  border-radius: 100%;
  position: absolute;
  right: 7px;
}

.lesson.not-completed::after {
  content: '';
  background: var(--activated);
}

.lesson.completed::after {
  content: '';
  background: var(--text-lighted);
}

.lesson.free::after {
  content: 'G';
  width: 10px;
  height: 10px;
  border-radius: 0;
  font-size: 0.6rem;
  line-height: 1.2;
  text-align: center;
  padding: 2px;
  color: var(--lighted-secondary);
  border: 2px solid var(--lighted-secondary);
  font-weight: bold;
  margin-right: 13px;
  position: absolute;
  right: 0;
}

.module-content.has-free li,
li.not-completed,
li.completed {
  padding-right: 40px;
}

.lesson span {
  display: block;
  width: 100%;
  font-size: 0.8rem;
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.2;
  text-decoration: none;
  color: #b0b2b3;
  padding: 10px;
}

.lesson small {
  color: #3e3d3d;
  float: right;
  font-size: 0.6rem;
}

.lesson span:hover {
  color: var(--text-primary);
}

.lesson.router-link-exact-active {
  background-color: #cdd0dd !important;
  box-shadow: var(--default-shadow);
}

.lesson.router-link-exact-active span {
  color: var(--tertiary);
}

.lesson:nth-child(2n) {
  background: #1c0d2b96;
}

#side-menu {
  display: none;
}

.side-btn {
  position: absolute;
  right: 0;
  background-color: rgb(65, 22, 87);
  margin-bottom: 0;
  width: 2.3rem;
  height: 100%;
  top: 0;
  display: grid;
  place-content: center;
  cursor: pointer;
}

.side-btn::after {
  content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjgiIHZpZXdCb3g9IjAgMCA5IDgiPgogIDxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTYuNDYsMy4xNDUgTDEuNTE4LDAuMTUzIEMxLjIwOTI2MjU0LC0wLjAzMzk2NDc2NTQgMC44MjM3MzE0MSwtMC4wNDAwNDg3NTQyIDAuNTA5MjQ4MjQ0LDAuMTM3MDgxMDkzIEMwLjE5NDc2NTA3NywwLjMxNDIxMDkzOSAwLjAwMDEzNzM2MjQ4MiwwLjY0NzA2NDIzNiAyLjY0Njk3Nzk2ZS0yMywxLjAwOCBMMi42NDY5Nzc5NmUtMjMsNi45OTIgQy0wLjAwMDIyMzcxMDI2NSw3LjM1MzExNDY0IDAuMTk0MjYyMTQ1LDcuNjg2Mjk4NTcgMC41MDg4MTI1NjUsNy44NjM2NzM1MSBDMC44MjMzNjI5ODYsOC4wNDEwNDg0NSAxLjIwOTEwOTUyLDguMDM1MDU3NDkgMS41MTgsNy44NDggTDYuNDYsNC44NTYgQzYuNzU5MzI4MTgsNC42NzQ4Mjc2MiA2Ljk0MjE5NzE5LDQuMzUwMzg2ODMgNi45NDIxOTcxOSw0LjAwMDUgQzYuOTQyMTk3MTksMy42NTA2MTMxNyA2Ljc1OTMyODE4LDMuMzI2MTcyMzggNi40NiwzLjE0NSBaIiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA0IDQuNSkiLz4KPC9zdmc+Cg==);
  width: 9px;
  height: 8px;
  position: relative;
  top: -4px;
  display: inline-block;
  transform: rotate(-30deg);
  transition: 0.3s;
}

.sidenav-wrapper.active .side-btn::after {
  transform: rotate(30deg);
}

.sidenav-wrapper.active,
.sidenav-wrapper.active > div {
  max-width: 3rem !important;
  overflow: hidden;
}

.sidenav-wrapper.active .module-wrapper {
  width: max-content;
}
</style>
