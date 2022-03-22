<template>
  <div
    class="preview"
    v-if="preview && curso && curso._id != 'default'"
    @click="closePreview"
  >
    <div class="wrapper lock-width">
      <i class="far fa-times-circle close-icon" @click="closePreview"></i>
      <div class="content">
        <div>
          <Loading v-if="imageLoading" class="imageLoading" />
          <img :src="curso.image.link" class="preview-image" />
          <input
            id="course"
            name="course"
            type="file"
            ref="course"
            @change="previewImage"
            accept="image/*"
            style="display: none"
          />
          <label for="course" class="label-upload"
            ><i class="far fa-edit cp-icon"></i
          ></label>
        </div>

        <div class="infos">
          <small>Titulo</small>
          <input
            type="text"
            name="title"
            v-model.lazy="curso.title"
            :placeholder="curso.title || 'Titulo'"
          />
          <small>Subtitulo</small>
          <input
            type="text"
            name="subtitle"
            v-model.lazy="curso.subtitle"
            :placeholder="curso.subtitle || 'Subtitulo'"
          />
          <small>Descrição</small>
          <textarea
            v-model.lazy="curso.description"
            :placeholder="curso.description || 'Descrição'"
          />
          <div class="sub-infos">
            <div class="requeriments">
              <div>
                <small>Softwares</small>
                <transition-group tag="ul" name="list">
                  <li v-for="(software, key) in curso.softwares" :key="software">
                    <i
                      class="fas fa-minus-circle remove-button"
                      @click="removeIn('softwares', software)"
                    ></i>
                    <input
                      type="text"
                      name="software"
                      :placeholder="software"
                      v-model.lazy="curso.softwares[key]"
                    />
                  </li>
                  <li key="add">
                    <i
                      class="fas fa-plus-circle add-button"
                      @click="addIn('softwares', 'software')"
                    ></i
                    ><input
                      type="text"
                      placeholder="Adicionar software"
                      v-model.lazy="temp.software"
                    />
                  </li>
                </transition-group>
              </div>
              <div>
                <small>Requisitos</small>
                <transition-group tag="ul" name="list">
                  <li v-for="(requeriment, key) in curso.requeriments" :key="requeriment">
                    <i
                      class="fas fa-minus-circle remove-button"
                      @click="removeIn('requeriments', requeriment)"
                    ></i>
                    <input
                      type="text"
                      name="requeriment"
                      :placeholder="requeriment"
                      v-model.lazy="curso.requeriments[key]"
                    />
                  </li>
                  <li key="add">
                    <i
                      class="fas fa-plus-circle add-button"
                      @click="addIn('requeriments', 'requeriment')"
                    ></i
                    ><input
                      type="text"
                      placeholder="Adicionar requisito"
                      v-model.lazy="temp.requeriment"
                    />
                  </li>
                </transition-group>
              </div>
            </div>
            <div class="basic-infos">
              <div>
                <small>Nível</small>
                <input
                  type="text"
                  name="level"
                  v-model.lazy="curso.level"
                  :placeholder="curso.level || 'Nível'"
                />
              </div>
              <div class="plans">
                <small>Plano</small>
                <div>
                  <input
                    type="radio"
                    name="plan"
                    id="anual"
                    value="Anual"
                    v-model="curso.plan"
                  />
                  <label for="anual">Anual</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="plan"
                    id="mensal"
                    value="Mensal"
                    v-model="curso.plan"
                  />
                  <label for="mensal">Mensal</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { api } from '@/services.js';

const courseBase = {
  _id: 'default',
  title: null,
  modules: [],
  visible: true,
  image: { link: '' },
  subtitle: null,
  tags: [],
  requeriments: [],
  link: null,
  softwares: [],
  plan: 'Mensal',
  level: null,
  item: null,
  description: null,
};

export default {
  name: 'CourseEdit',
  props: ['course'],
  data() {
    return {
      curso: {
        _id: 'default',
      },
      preview: false,
      imageLoading: false,
      temp: {
        requeriment: null,
        software: null,
      },
    };
  },
  methods: {
    addIn(where, key) {
      if (!this.curso[where].includes(this.temp[key]) && this.temp[key]) {
        const tempArr = [...this.curso[where]];
        tempArr.push(this.temp[key]);
        this.curso[where] = tempArr;
      }
    },
    removeIn(where, key) {
      this.curso[where] = this.curso[where].filter(value => value != key);
    },
    closePreview({ target, currentTarget }) {
      if (target === currentTarget) {
        this.preview = false;
        this.curso = { ...courseBase };
        document.body.style.overflow = '';
      }
    },
    async updateCourseImage() {
      this.imageLoading = true;
      const form = new FormData();
      const file = this.$refs.course.files;

      if (file[0]) form.append(file[0].name, file[0]);

      form.append('_id', this.curso._id);
      form.append('type', 'Courses');
      form.append('field', 'image');
      form.append('category', this.curso.category);

      api.post('/management/image', form).then(response => {
        this.imageLoading = false;
        this.managementUpdateOne({ payload: response.data, route: 'COURSE' });
      });
    },
    previewImage() {
      const reader = new FileReader();
      const preview = document.querySelector('.preview-image');
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(this.$refs.course.files[0]);

      this.updateCourseImage();
    },
    ...mapActions(['managementUpdateOne']),
  },
  watch: {
    course({ course, preview, _id, category }) {
      if (course) {
        this.curso = { ...course, category };
      } else if (_id && !course) {
        this.curso = { ...courseBase, _id, category };
      }

      this.preview = preview;
      document.body.style.overflow = 'hidden';
    },
    curso: {
      handler(newObject, oldObject) {
        if (oldObject._id === newObject._id && newObject._id != 'default')
          this.managementUpdateOne({ payload: newObject, route: 'COURSE' });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.preview {
  position: fixed;
  left: 0;
  top: 0;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background-color: #4d4d44b0;
  z-index: 10000;
  overflow-y: scroll;
  scrollbar-color: var(--text-lighted) transparent;
  scrollbar-width: thin;
}

.preview input,
.preview textarea {
  background-color: transparent;
  color: var(--text-primary);
  border: 0;
  width: 100%;
}

.preview textarea {
  min-height: 120px;
}

li,
.add-lesson {
  font-size: smaller;
  display: flex;
  align-items: center;
}

li i,
.add-lesson i {
  height: 30px;
  width: 30px;
  display: grid;
  place-content: center;
}

.close-icon {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 22px;
  cursor: pointer;
}

.close-icon:hover {
  color: var(--activated);
}

.wrapper {
  margin: 10px 30px 10px 30px;
  display: flex;
  height: max-content;
  gap: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  position: relative;
}

.infos {
  margin-top: 10px;
}

.infos h3 {
  font-weight: bold;
  font-size: 17px;
  margin-top: 0;
}

.infos p {
  font-size: 15px;
  padding: 5px;
}

.infos > input {
  margin-bottom: 15px;
}

.sub-infos {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.requeriments,
.basic-infos {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.requeriments > div,
.basic-infos > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sub-infos small,
.infos > small {
  color: var(--text-lighted);
}

.sub-infos ul,
span {
  padding: 5px;
  font-size: 15px;
  list-style-type: disclosure-closed;
}

.content {
  height: -moz-available;
  width: clamp(200px, 800px, 1000px);
}

.content img {
  width: 100%;
  border-radius: 10px;
  min-height: 300px;
  background-color: var(--lighted-secondary);
}

.content > div:first-child {
  position: relative;
}

.label-upload {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 22px;
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.grid {
  max-height: inherit;
  transition: all 0.2s;
}

.grid > div:first-of-type {
  height: 93%;
}

.grid ul {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #cecece;
  max-height: 99%;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--lighted) transparent;
  padding-left: 0;
}

.grid,
.infos {
  background-color: var(--secondary);
  border-radius: 10px;
  padding: 15px;
}

.remove-button,
.add-button {
  cursor: pointer;
}

.remove-button:hover {
  color: red;
}

.add-button:hover {
  color: green;
}

.plans div {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.plans input {
  height: 13px;
  max-width: 13px;
  display: inline-block;
  margin: 5px;
}

.plans label {
  margin: 0;
  font-weight: normal;
  padding-top: 3px;
}

.imageLoading {
  position: absolute;
  margin: 0 !important;
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  grid-template-columns: repeat(4, auto);
  background-color: #5e5e5e59;
  border-radius: 10px;
}

@media (max-width: 625px) {
  .preview {
    place-content: baseline;
  }

  .wrapper {
    flex-direction: column;
  }

  .content {
    width: inherit;
  }

  .grid,
  .grid ul {
    height: inherit;
  }

  .grid ul {
    max-height: 70vh;
  }
}
</style>
