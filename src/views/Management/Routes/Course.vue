<template>
  <transition
    mode="out-in"
    v-if="['newLesson', 'editLesson'].includes($route.name) && course"
  >
    <router-view :course="course"></router-view>
  </transition>
  <section v-else-if="course" class="course">
    <article>
      <div class="course-infos">
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
      </div>
      <div class="course-manage">
        <h3>Gerenciamento de Conteúdo</h3>
        <div class="manage-btns">
          <span @click="tempModule.show = true">Novo<br />módulo</span>
          <span @click="$router.push({ name: 'newLesson' })">Novo<br />conteúdo</span>
        </div>
        <div v-if="comments[0]">
          <h3>Comentários</h3>
          <ul class="comments">
            <li v-for="comment in comments" :key="comment.id" class="comment">
              <div class="user-comment">
                <span class="mini-icon icon-remove" @click="removeComment(comment)"
                  ><i class="fas fa-trash"></i
                ></span>
                <router-link :to="{ path: `/${comment.username}` }" target="_blank">{{
                  comment.full_name ? comment.full_name : comment.username
                }}</router-link>
                <div>
                  <p>{{ comment.text }}</p>
                  <small>{{ comment.video.title }}</small>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <transition mode="out-in">
        <div
          class="new-module"
          v-if="tempModule.show"
          @click="closeMenu($event, 'tempModule')"
        >
          <div class="new-module-content">
            <label for="title-module">Nome do módulo</label>
            <input
              type="text"
              name="title-module"
              id="title-module"
              v-model.lazy="tempModule.title"
              placeholder="Módulo 1 - Introdução"
            />
            <label for="description-module">Descrição</label>
            <textarea
              name="description-module"
              id="description-module"
              v-model.lazy="tempModule.description"
            />
            <label for="visible">Visível</label>
            <label class="switch">
              <input type="checkbox" v-model="tempModule.visible" id="visible" />
              <span class="slider"></span>
            </label>
            <div>
              <span @click="tempModule.show = false">Cancelar</span>
              <button class="btn" @click="newModule">Criar módulo</button>
            </div>
          </div>
        </div>
      </transition>
    </article>
    <article class="modules">
      <draggable v-model="course.modules" group="modules">
        <Module
          v-for="(md, key) in course.modules"
          :md="md"
          :course="course"
          :key="md.title + key"
        />
      </draggable>
    </article>
  </section>
  <Loading v-else />
</template>

<script>
import Module from '@/components/Management/Module.vue';
import draggable from 'vuedraggable';

import { mapState, mapActions } from 'vuex';
import { normalizeString } from '@/helpers.js';
import alert from '@/mixins/alert.js';

export default {
  name: 'Course',
  props: ['id'],
  mixins: [alert],
  components: {
    Module,
    draggable,
  },
  data() {
    return {
      course: null,
      category: null,
      tempModule: {
        title: '',
        description: '',
        visible: true,
        videos: [],
        show: false,
      },
      editModule: {
        show: false,
      },
    };
  },
  computed: {
    comments() {
      let comments = [];
      this.course.modules.forEach((md, mdIndex) => {
        md.videos.forEach((vd, vdIndex) => {
          if (vd.comments && vd.comments[0]) {
            vd.comments.forEach(comment => {
              comments.push({
                module: {
                  title: md.title,
                  index: mdIndex,
                },
                video: {
                  title: vd.title,
                  index: vdIndex,
                },
                ...comment,
              });
            });
          }
        });
      });
      return comments;
    },
    ...mapState(['courses']),
  },
  methods: {
    closeMenu({ target, currentTarget }, inTo) {
      if (target === currentTarget) {
        this[inTo].show = false;
      }
    },
    newModule() {
      if (this.tempModule.title === '')
        return this.sendAlert('O título do módulo é obrigatório');

      let temp = { ...this.tempModule };
      delete temp.show;

      if (!this.course.modules) this.course.modules = [];

      this.course.modules.push(temp);
      this.managementUpdateOne({ payload: this.course, route: 'COURSE' });

      this.tempModule = {
        title: '',
        description: '',
        videos: [],
        show: false,
      };
    },
    getCourse() {
      const categoryId = this.id.split('-')[0];
      const courseTitle = this.id.replace(`${categoryId}-`, '');
      const category = this.courses.find(categ => categ._id == categoryId);
      const course = category.courses.find(
        cs => normalizeString(cs.title) == courseTitle
      );
      this.category = { ...category };
      this.course = JSON.parse(JSON.stringify(course));
      if (course.category != Number(categoryId)) {
        this.course.category = Number(categoryId);
        this.managementUpdateOne({ payload: this.course, route: 'COURSE' });
      }
    },
    removeComment(ct) {
      if (
        window.confirm(
          `Deseja deletar o comentário do(a) ${
            ct.full_name && ct.full_name != '' ? ct.full_name : ct.username
          }?`
        )
      ) {
        this.course.modules[ct.module.index].videos[
          ct.video.index
        ].comments = this.course.modules[ct.module.index].videos[
          ct.video.index
        ].comments.filter(cts => cts.id != ct.id);
      }
    },
    ...mapActions(['managementGet', 'managementUpdateOne']),
  },
  watch: {
    course: {
      handler(payload, old) {
        const categoryIndex = this.courses.findIndex(
          categ => categ._id == this.category._id
        );
        const courseIndex = this.courses[categoryIndex].courses.findIndex(
          course => course._id == payload._id
        );
        if (
          old &&
          JSON.stringify(this.courses[categoryIndex].courses[courseIndex]) !==
            JSON.stringify(this.course)
        ) {
          this.managementUpdateOne({ payload, route: 'COURSE' });
        }
      },
      deep: true,
    },
    courses: {
      handler(payload, old) {
        if (old) this.getCourse();
      },
      deep: true,
    },
  },
  async created() {
    if (!this.courses) await this.managementGet({ route: 'COURSES' });
    this.getCourse();
  },
};
</script>

<style scoped>
.course {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding-top: 7rem !important;
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
}

.course h3 {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: bold;
}

.course-infos h2 {
  font-size: 1.125rem;
}

.course-infos p {
  margin-top: 0.5rem;
  font-size: 0.93rem;
}

.course-manage {
  margin-top: 1.25rem;
  border-top: 1px solid var(--lighted);
}

.manage-btns {
  padding: 5px 0;
  border-radius: 5px;
}

.manage-btns > :not(:first-child) {
  margin-left: -1px;
}

.manage-btns span {
  border: 1px solid #d4d4d4;
  padding: 9px 25px;
  color: #d4d4d4;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
  text-align: center;
}

.manage-btns span:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.manage-btns span:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.manage-btns span:hover {
  background-color: var(--tertiary);
  color: var(--default-shadow);
}

.new-module {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #4d4d4457;
  top: 0;
  left: 0;
  z-index: 9999;
  display: grid;
  place-content: center;
}

.new-module-content {
  background-color: var(--secondary);
  display: grid;
  gap: 10px;
  width: clamp(100px, 600px, 90vw);
  padding: 20px;
  border-radius: 10px;
}

.new-module-content div {
  border-top: 1px solid var(--lighted);
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}

.new-module-content label {
  font-weight: normal;
  font-size: 0.9rem;
}

.new-module-content input,
.new-module-content textarea {
  background-color: var(--primary);
  border-color: var(--lighted);
  color: var(--text-primary);
}

.new-module-content span {
  cursor: pointer;
}

.new-module-content .btn {
  padding: 7px 17px;
  margin-left: 20px;
}

.modules > div {
  margin-bottom: 20px;
}

.comments li {
  margin-top: 35px;
}

.comment {
  border-radius: 5px 20px;
  max-width: 300px;
}

.comment small {
  font-size: 0.8rem;
  padding: 7px 15px;
  margin-top: 5px;
  display: block;
  border-radius: 20px;
  border-top-right-radius: 0;
  background-color: var(--tertiary);
  color: #8e8e8d;
}

.user-comment {
  position: relative;
}

.user-comment .mini-icon {
  position: absolute;
  right: 0;
}

.user-comment .mini-icon:hover {
  background-color: rgb(250, 21, 21);
}

.comment a {
  background-color: var(--tertiary);
  width: max-content;
  padding: 10px 15px;
  margin-bottom: 5px;
  display: block;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  font-size: 0.9rem;
}

.comment p {
  padding: 10px 15px;
  background-color: var(--lighted);
  border-radius: 0 20px;
  word-break: break-word;
}

@media (max-width: 930px) {
  .course {
    grid-template-columns: auto;
    padding-top: 4rem !important;
  }
}
</style>
