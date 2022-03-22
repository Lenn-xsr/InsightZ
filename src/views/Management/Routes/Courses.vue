<template>
  <section class="courses" v-if="tempCourse">
    <CourseEdit :course="coursePre" />
    <div
      class="new-category"
      v-if="categoryPre.show"
      @click="closeMenu($event, 'categoryPre')"
    >
      <div class="new-category-content">
        <label for="new-category">Nome da categoria</label>
        <input
          type="text"
          name="new-category"
          id="new-category"
          v-model="categoryPre.category"
        />
        <div>
          <span @click="categoryPre.show = false">Cancelar</span>
          <button @click.prevent="newCategory" class="btn">Criar categoria</button>
        </div>
      </div>
    </div>

    <div
      class="new-category"
      v-if="categoryEdit.show && categoryEdit._id"
      @click="closeMenu($event, 'categoryEdit')"
    >
      <div class="new-category-content edit-category-content">
        <label for="new-category">Nome da categoria</label>
        <input
          type="text"
          name="new-category"
          id="new-category"
          v-model.lazy="tempCourse[categoryEdit._id].category"
          :placeholder="categoryEdit.category"
        />
        <div>
          <button class="btn" @click="removeCategory(tempCourse[categoryEdit._id])">
            Excluir
          </button>
          <span @click="categoryEdit.show = false">Cancelar</span>
        </div>
      </div>
    </div>

    <div class="courses-menu">
      <h2>Conteúdos</h2>
      <div class="colapse-wrapper">
        <button class="colapse-button" @click="menu.show = true">
          Adicionar <i class="fas fa-chevron-down"></i>
        </button>
        <div
          class="colapse-back"
          v-if="menu.show"
          @click="closeMenu($event, 'menu')"
        ></div>
        <div class="colapse-content" v-show="menu.show">
          <a @click="newCourse()">Novo curso</a>
          <a @click="categoryPre.show = true">Nova categoria</a>
        </div>
      </div>
    </div>

    <article
      v-for="(category, key) in courses"
      :key="category.category"
      class="category-wrapper"
    >
      <div class="category-infos">
        <h3>{{ category.category }}</h3>
        <div class="category-btns">
          <span @click="moveCategory(tempCourse, key, key - 1)" v-if="key > 0">
            <i class="fas fa-arrow-up"></i>
          </span>
          <span
            @click="moveCategory(tempCourse, key, key + 1)"
            v-if="key + 1 < tempCourse.length"
          >
            <i class="fas fa-arrow-down"></i>
          </span>
          <span
            @click="editCategory(key, category.category)"
            v-if="category.category != 'Sem categoria'"
            ><i class="fas fa-pencil-alt"></i
          ></span>
        </div>
      </div>
      <div class="category-content">
        <draggable
          v-if="tempCourse[key]"
          v-model="tempCourse[key].courses"
          group="courses"
          class="lock-width courses-wrapper"
          tag="ul"
        >
          <li
            v-for="course in courses[key].courses"
            :key="course._id + course.title"
            @click="viewCourse(course, category, $event)"
            class="course-wrapper"
          >
            <div class="edits">
              <span class="mini-icon icon-grab"><i class="fas fa-hand-paper"></i></span>
              <span class="mini-icon icon-edit" @click="editCourse(course, category._id)"
                ><i class="fas fa-pencil-alt"></i
              ></span>
              <span
                class="mini-icon icon-remove"
                @click="removeCourse(course, category._id)"
                ><i class="fas fa-trash"></i
              ></span>
            </div>
            <Course :course="course" />
          </li>
        </draggable>
      </div>
    </article>
  </section>
  <Loading v-else />
</template>

<script>
import Course from '@/components/Home/Course.vue';
import CourseEdit from '@/components/Management/CourseEdit.vue';

import draggable from 'vuedraggable';

import { api } from '@/services.js';
import { normalizeString } from '@/helpers.js';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Courses',
  components: { Course, CourseEdit, draggable },
  data() {
    return {
      menu: {
        show: false,
      },
      coursePre: null,
      categoryPre: {
        _id: null,
        category: null,
        show: false,
        courses: [],
      },
      categoryEdit: {
        show: false,
      },
      tempCourse: null,
    };
  },
  computed: {
    ...mapState(['courses']),
  },
  methods: {
    closeMenu({ target, currentTarget }, inTo) {
      if (target === currentTarget) {
        this[inTo].show = false;
      }
    },
    removeCourse(course, category) {
      if (window.confirm(`Deseja deletar o curso "${course.title}"?`)) {
        api
          .delete('/management/courses', {
            _id: course._id,
            image: course.image,
            category,
          })
          .then(response => {
            this.managementUpdate({ payload: response.data, route: 'COURSES' });
          });
      }
    },
    editCourse(course, category) {
      this.coursePre = {
        course,
        preview: true,
        category,
      };
    },
    newCourse() {
      const index = this.courses.findIndex(item => item.category == 'Sem categoria');
      this.coursePre = {
        course: null,
        preview: true,
        _id: Date.now(),
        category: index,
      };
    },
    moveCategory(arr, fromIndex, toIndex) {
      let element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    },
    editCategory(_id, category) {
      this.categoryEdit = {
        _id,
        category,
        show: true,
      };
    },
    removeCategory(category) {
      if (
        window.confirm(
          `Deseja deletar a categoria "${category.category}", que contém ${category.courses.length} cursos?`
        )
      ) {
        this.categoryEdit.show = false;
        api
          .delete('/management/courses', {
            _id: category._id,
            category: true,
          })
          .then(response => {
            this.managementUpdate({ payload: response.data, route: 'COURSES' });
          });
      }
    },
    newCategory() {
      this.categoryPre._id = Date.now();
      this.tempCourse.push(this.categoryPre);
      this.categoryPre.show = false;
      this.managementUpdateOne({ payload: this.categoryPre, route: 'COURSE' });
    },
    viewCourse(course, category, { target }) {
      if (target.localName == 'li') {
        const id = `${category._id}-${normalizeString(course.title)}`;

        this.$router.push({ path: `/dashboard/course/${id}` });
      }
    },
    ...mapActions(['managementGet', 'managementUpdate', 'managementUpdateOne']),
  },
  watch: {
    tempCourse: {
      handler(payload) {
        if (JSON.stringify(this.tempCourse) !== JSON.stringify(this.courses)) {
          let tempValue = JSON.parse(JSON.stringify(payload));
          tempValue.forEach(category => {
            category.courses.forEach(course => {
              if (course.category != category._id) course.category = category._id;
            });
          });
          this.managementUpdate({ payload: tempValue, route: 'COURSES' });
        }
      },
      deep: true,
    },
    courses: {
      handler(value) {
        if (JSON.stringify(this.tempCourse) !== JSON.stringify(value))
          this.tempCourse = JSON.parse(JSON.stringify(value));
      },
      deep: true,
    },
  },
  async created() {
    if (!this.courses) await this.managementGet({ route: 'COURSES' });
    if (!this.tempCourse) this.tempCourse = JSON.parse(JSON.stringify(this.courses));
  },
};
</script>

<style scoped>
.courses {
  position: relative;
}

.courses-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  margin: auto;
  width: auto;
  gap: 0;
}

.course-wrapper {
  width: clamp(120px, 100%, 300px);
  min-height: 120px;
  position: relative;
  height: min-content;
  margin: 0 5px 10px;
  break-inside: avoid;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
}

.course-wrapper .course {
  pointer-events: none;
  margin: 0;
  min-height: inherit;
}

.edits {
  position: absolute;
  right: 5px;
  top: 5px;
  display: grid;
  gap: 7px;
}

.icon-grab {
  cursor: grab;
}

.icon-edit:hover {
  background-color: var(--text-lighted);
}

.icon-remove:hover {
  background-color: #ff3434;
}

.courses-menu {
  display: flex;
  justify-content: space-between;
  border-bottom: 1.8px solid var(--lighted);
  padding: 5px 5px 10px;
  align-items: center;
  margin-bottom: 20px;
}

.courses-menu i {
  font-size: small;
}

.colapse-button {
  padding: 8px 15px;
  color: var(--text-primary);
  background-color: var(--lighted-secondary);
  border: 0;
  border-radius: 5px;
  font-size: 0.9rem;
}

.category-wrapper {
  margin-bottom: 15px;
}

.category-content {
  padding-top: 15px;
}

.category-infos {
  border-bottom: 1.8px solid var(--lighted);
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
}

.category-btns {
  padding: 5px 0;
  border-radius: 5px;
}

.category-btns > :not(:first-child) {
  margin-left: -1px;
}

.category-btns span {
  border: 1px solid #d4d4d4;
  padding: 6px;
  color: #d4d4d4;
  cursor: pointer;
}

.category-btns span:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.category-btns span:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.category-btns span:hover {
  background-color: var(--tertiary);
}

.category-infos h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.75rem;
}

.category-content > ul {
  width: 100%;
  min-height: 50px;
  justify-content: left;
}

.new-category {
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

.new-category-content {
  background-color: var(--secondary);
  display: grid;
  gap: 10px;
  width: clamp(100px, 600px, 90vw);
  padding: 20px;
  border-radius: 10px;
}

.new-category-content div {
  border-top: 1px solid var(--lighted);
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  align-items: center;
}

.new-category-content label {
  font-weight: normal;
  font-size: 0.9rem;
}

.new-category-content input {
  background-color: var(--primary);
  border-color: var(--lighted);
  color: var(--text-primary);
}

.new-category-content span {
  cursor: pointer;
}

.new-category-content .btn {
  padding: 7px 17px;
  margin-left: 20px;
}

.edit-category-content > div {
  position: relative;
}

.edit-category-content .btn:first-of-type {
  border: 1px solid #f41c1c;
  background-color: transparent;
  color: #f41c1c;
  position: absolute;
  left: 0;
  margin-left: 0;
}

.edit-category-content .btn:first-of-type:hover {
  background-color: #f41c1c !important;
  color: var(--text-primary);
}

@media screen and (max-width: 500px) {
  .course-wrapper {
    max-width: 100%;
  }
}
</style>
