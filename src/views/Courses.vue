<template>
  <main class="community">
    <section class="top-content">
      <div class="top-text lock-width">
        <h1>
          Quando se trata de <span>3D para Jogos</span>, nossos cursos tem tudo o que você
          precisa.
        </h1>
        <img src="@/assets/Telas.webp" />
        <p>
          Nossos conteúdos são 100% explicados, não escondemos nada, não tem truques nem
          mágica, não mostramos só o lado bonito, ensinamos realmente como as coisas
          funcionam de forma clara e direta para que todos consigam entender.
        </p>
      </div>
      <div class="background-video">
        <video
          role="presentation"
          crossorigin="anonymous"
          playsinline=""
          preload="auto"
          muted=""
          loop=""
          autoplay=""
          tabindex="-1"
          src="@/assets/Background-video.mp4"
        ></video>
      </div>
    </section>
    <section class="courses lock-width">
      <article
        v-for="(category, key) in courses"
        :key="category.category"
        class="category-wrapper"
      >
        <div class="category-infos">
          <h3>{{ category.category }}</h3>
        </div>
        <div class="category-content courses-wrapper lock-width">
          <Course
            v-for="course in courses[key].courses"
            :course="course"
            :unlock="unlockCourses"
            @click.native="viewCourse(category._id, course.title)"
            :key="course._id + course.title"
          />
        </div>
      </article>
    </section>
    <section class="depositions">
      <h2>O que o pessoal da <span>CommunityZ</span> tem a dizer?</h2>
      <div>
        <Deposition
          v-for="deposition in depositions"
          :key="deposition._id"
          :deposition="deposition"
        />
      </div>
    </section>
    <Plans />
    <Faq />
  </main>
</template>

<script>
import Course from '@/components/Home/Course.vue';
import Deposition from '@/components/Home/Deposition.vue';
import Plans from '@/components/Home/Plans.vue';
import Faq from '@/components/Home/Faq.vue';

import { mapActions, mapState } from 'vuex';
import { normalizeString } from '@/helpers.js';

export default {
  name: 'Courses',
  components: {
    Course,
    Deposition,
    Plans,
    Faq,
  },
  computed: {
    courses() {
      return this.$store.state.courses
        ? this.$store.state.courses.filter(item => item.category != 'Sem categoria')
        : [];
    },
    unlockCourses() {
      return this.$store.state.user && this.$store.state.user.plan
        ? this.$store.state.anualTags.includes(this.$store.state.user.plan)
        : false;
    },
    ...mapState(['depositions']),
  },
  methods: {
    viewCourse(categoryId, title) {
      const categoryIndex = this.$store.state.courses.findIndex(
        cs => cs._id == categoryId
      );
      this.$router.push({
        path: `/curso/${categoryIndex}-${normalizeString(title)}`,
      });
    },
    ...mapActions(['localGet']),
  },
  created() {
    if (!this.courses[0]) this.localGet({ route: 'COURSES' });
    if (!this.depositions) this.localGet({ route: 'DEPOSITIONS' });
  },
};
</script>

<style scoped>
main {
  margin-top: 70px;
}

.background-video {
  max-height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  position: absolute;
  background-color: var(--lighted);
  background-image: url('https://static.wixstatic.com/media/0da768_8fae2cc5b7bf477fb13faa1f2582dbd2.png/v1/crop/x_0,y_0,w_4,h_6,q_85/0da768_8fae2cc5b7bf477fb13faa1f2582dbd2.webp');
  background-size: auto;
  background-repeat: repeat;
  background-position: center center;
  max-width: 100%;
  top: 0;
  z-index: 1;
}

.background-video video {
  min-width: 100vw;
  position: relative;
  top: 0;
  opacity: 0.4;
  pointer-events: none;
}

.top-content {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-bottom: 2px solid var(--text-lighted);
}

.top-text {
  display: flex;
  padding: 40px;
  height: 100vh;
  justify-content: flex-end;
  align-items: baseline;
  max-height: 700px;
  flex-direction: column;
  position: relative;
  padding-bottom: 6rem;
  z-index: 2;
}

.top-text img {
  width: 40%;
  position: absolute;
  right: 100px;
  top: 75px;
  min-width: 240px;
}

h1 {
  font-size: 32px;
  margin-bottom: 50px;
  max-width: 350px;
  text-align: start;
}

h1 span,
h2 span {
  color: var(--text-lighted);
}

p {
  font-size: 18px;
  max-width: 75%;
}

.courses {
  position: relative;
  display: flex;
  justify-content: center;
  margin: auto;
  margin-bottom: 35px;
  flex-direction: column;
}

.courses-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.category-infos {
  border-bottom: 1.8px solid var(--lighted);
  padding: 12px 0;
  margin: 15px;
}

.category-infos h3 {
  padding: 0;
  margin: 0;
  letter-spacing: -0.025em;
  font-weight: bold;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.depositions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  padding-bottom: 50px;
}

.depositions h2 {
  margin-bottom: 20px;
  text-align: center;
  max-width: 90%;
}

.depositions > div:first-of-type {
  display: flex;
  align-items: flex-end;
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--secondary) transparent;
}

@media (max-width: 920px) {
  .courses-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }

  .top-text {
    padding-bottom: 0;
    padding-top: 0;
    justify-content: center;
  }

  .top-text img {
    position: unset;
    margin: 30px;
  }

  h1 {
    font-size: 25px;
    margin-bottom: 0;
    margin-top: 15px;
  }

  p {
    font-size: 16px;
    max-width: 90%;
  }
}

@media (max-width: 624px) {
  .courses-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 450px) {
  .courses-wrapper {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
