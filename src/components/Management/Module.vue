<template>
  <div class="module">
    <input
      type="checkbox"
      name="expand-module"
      :id="'expand-module-' + md.title"
      class="expand-module"
      style="display: none"
    />
    <label :for="'expand-module-' + md.title" v-if="md.videos[0]">
      <i class="fas fa-chevron-right"></i>
    </label>

    <div class="edit-buttons">
      <i class="fas fa-pencil-alt edit-button" @click="show = true"></i>
      <i class="fas fa-hand-paper icon-grab"></i>
    </div>

    <div>
      <h2>{{ md.title }}</h2>
      <p v-if="md.description && md.description != ''">{{ md.description }}</p>
    </div>
    <div class="md-videos">
      <draggable v-model="md.videos" group="lessons" tag="ul">
        <li v-for="(video, key) in md.videos" :key="video.title" class="md-video">
          <i class="fas fa-play-circle"></i>
          <span>{{ video.title }}</span>
          <div class="lesson-menu">
            <span class="mini-icon icon-edit" @click="editLesson(key, md.title)"
              ><i class="fas fa-pencil-alt"></i
            ></span>
            <span class="mini-icon icon-grab"><i class="fas fa-hand-paper"></i></span>
          </div>
        </li>
      </draggable>
    </div>

    <transition mode="out-in">
      <div class="edit-module" v-if="show" @click="closeMenu">
        <div class="edit-module-content">
          <label for="title-module">Nome do módulo</label>
          <input
            type="text"
            name="title-module"
            id="title-module"
            v-model.lazy="mdTemp.title"
            placeholder="Módulo 1 - Introdução"
          />
          <label for="description-module">Descrição</label>
          <textarea
            name="description-module"
            id="description-module"
            v-model.lazy="mdTemp.description"
          />
          <label for="visible">Visível</label>
          <label class="switch">
            <input type="checkbox" v-model="mdTemp.visible" id="visible" />
            <span class="slider"></span>
          </label>
          <div>
            <button @click="deleteModule" class="btn">Excluir</button>
            <span @click="show = false">Cancelar</span>
            <button @click="saveModule" class="btn">Salvar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

import { mapActions } from 'vuex';
import { normalizeString } from '@/helpers.js';

export default {
  name: 'Module',
  props: ['md', 'course'],
  components: { draggable },
  data() {
    return {
      show: false,
      mdTemp: null,
    };
  },
  methods: {
    closeMenu({ target, currentTarget }) {
      if (target === currentTarget) {
        this.show = false;
      }
    },
    saveModule() {
      let course = JSON.parse(JSON.stringify(this.course));
      const index = course.modules.findIndex(md => md.title == this.md.title);

      if (index >= 0) {
        course.modules[index] = this.mdTemp;
        this.show = false;
        this.managementUpdateOne({ payload: course, route: 'COURSE' });
      }
    },
    deleteModule() {
      if (
        window.confirm(
          `Deseja deletar o módulo "${this.md.title}" que contém ${this.md.videos.length} videos?`
        )
      ) {
        let course = JSON.parse(JSON.stringify(this.course));
        course.modules = course.modules.filter(md => md.title !== this.md.title);

        this.show = false;
        this.managementUpdateOne({ payload: course, route: 'COURSE' });
      }
    },
    editLesson(lid, title) {
      this.$router.push({
        name: 'editLesson',
        params: { lid: `${lid}-${normalizeString(title)}` },
      });
    },
    ...mapActions(['managementUpdateOne', 'managementGet']),
  },
  created() {
    this.mdTemp = JSON.parse(JSON.stringify(this.md));
  },
};
</script>

<style scoped>
.module {
  background-color: var(--tertiary);
  border-radius: 10px;
  position: relative;
}

.module h2 {
  font-size: 1.2rem;
}

.module > label {
  position: absolute;
  left: 20px;
  top: 33px;
  width: 20px;
  font-size: 1.2rem;
  transform: rotate(90deg);
  transition: all 0.3s ease-in;
  margin: 0;
  cursor: pointer;
}

.module > div {
  padding: 2rem 3.3rem;
}

.md-videos {
  border-top: 1px solid var(--primary);
  margin: 10px;
  transition: all 0.25s ease-in;
  padding: 1.5rem !important;
}

.expand-module:checked ~ .md-videos {
  height: 0;
  padding: 0 1.5rem !important;
  overflow: hidden;
}

.expand-module:checked ~ label {
  transform: rotate(0deg);
  left: 30px;
  top: 32px;
}

.md-video {
  display: flex;
  position: relative;
}

.lesson-menu {
  display: none;
  position: absolute;
  right: 0;
  align-self: center;
}

.lesson-menu span:last-child {
  cursor: grab;
}

.md-video:hover .lesson-menu {
  display: flex;
}

.md-video:not(:first-child) {
  margin-top: 15px;
}

.md-video span {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

.module p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  max-width: 90%;
}

.module-menu {
  position: absolute;
  right: 25px;
  top: 32px;
  cursor: pointer;
}

.edit-module {
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

.edit-module-content {
  background-color: var(--secondary);
  display: grid;
  gap: 10px;
  width: clamp(100px, 600px, 90vw);
  padding: 20px;
  border-radius: 10px;
}

.edit-module-content div {
  border-top: 1px solid var(--lighted);
  padding: 20px 20px 5px;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}

.edit-module-content label {
  font-weight: normal;
  font-size: 0.9rem;
}

.edit-module-content input,
.edit-module-content textarea {
  background-color: var(--primary);
  border-color: var(--lighted);
  color: var(--text-primary);
}

.edit-module-content span {
  cursor: pointer;
}

.edit-module-content .btn {
  padding: 7px 17px;
  margin-left: 20px;
}

.edit-module-content > div {
  position: relative;
}

.edit-module-content .btn:first-of-type {
  border: 1px solid #f41c1c;
  background-color: transparent;
  color: #f41c1c;
  position: absolute;
  left: 0;
  margin-left: 0;
}

.edit-module-content .btn:first-of-type:hover {
  background-color: #f41c1c !important;
  color: var(--text-primary);
}

.edit-buttons {
  position: absolute;
  right: 33px;
  top: 33px;
  cursor: pointer;
  padding: 0 !important;
  display: flex;
  align-items: center;
}

.edit-buttons i:not(:first-child) {
  margin-left: 20px;
}
</style>
