<template>
  <section class="lesson">
    <h1>{{ lid ? 'Editar' : 'Nova' }} aula</h1>
    <article>
      <label for="title">Título</label>
      <input type="text" name="title" id="title" v-model.lazy="lesson.title" required />

      <label for="module">Módulo</label>
      <select name="module" id="module" v-if="modules[0]" v-model="md" required>
        <option v-for="md in modules" :key="md.key" :value="md.key">
          {{ md.title }}
        </option>
      </select>
      <span class="alert-error" v-else
        >É preciso criar ao menos um módulo para inserir a aula, crie um e volte
        aqui.</span
      >

      <label for="video">Video URL (vimeo)</label>
      <input type="text" name="video" id="video" v-model.lazy="lesson.hash" required />

      <div class="free-wrapper">
        <label class="switch">
          <input type="checkbox" v-model="lesson.free" id="free" />
          <span class="slider"></span>
        </label>
        <label for="free">Aula gratuita</label>
      </div>
    </article>
    <article>
      <div class="tabs">
        <div class="tab">
          <button
            :class="activeTab.section1 == 'add' ? 'tablinks active' : 'tablinks'"
            @click="activeTab.section1 = 'add'"
          >
            Adicionar arquivo
          </button>
          <button
            :class="activeTab.section1 == 'uploads' ? 'tablinks active' : 'tablinks'"
            @click="activeTab.section1 = 'uploads'"
          >
            Uploads
          </button>
        </div>

        <div
          class="tabcontent"
          :style="activeTab.section1 == 'add' ? { display: 'block' } : ''"
        >
          <div class="archives-wrapper">
            <div class="redirect-wrapper">
              <label class="switch">
                <input type="checkbox" v-model="archive.redirect" id="redirect" />
                <span class="slider"></span>
              </label>
              <label for="redirect">Download sem redirecionar</label>
            </div>
            <label for="archive-name">Nome do arquivo</label>
            <input
              type="text"
              name="archive-name"
              id="archive-name"
              v-model="archive.name"
            />
            <label for="archive">Arquivo</label>
            <input
              id="archive"
              name="archive"
              type="file"
              ref="archive"
              enctype="multipart/form-data"
            />
            <button @click="uploadArchive" class="btn">Upload</button>
          </div>
        </div>

        <div
          class="tabcontent uploads"
          :style="activeTab.section1 == 'uploads' ? { display: 'block' } : ''"
        >
          <div>
            <label for="archiveQuery">Procurar Arquivo</label>
            <input
              type="text"
              name="archiveQuery"
              id="archiveQuery"
              v-model="archiveQuery"
            />
          </div>
          <ul v-if="archives && archivesQuery && archivesQuery[0]" class="archives">
            <li v-for="arq in archivesQuery" :key="arq.name" class="archive-item">
              <a :href="arq.link" target="_blank">{{ arq.name.split('+').join(' ') }}</a>
              <span class="mini-icon" @click="pushArchive(arq)">
                <i class="fas fa-plus-circle"></i>
              </span>
              <span class="mini-icon icon-remove" @click="removeArchive(arq, true)"
                ><i class="fas fa-trash"></i
              ></span>
            </li>
          </ul>
          <small v-else-if="archives && archivesQuery && !archivesQuery[0]"
            >Nenhum arquivo encontrado</small
          >
          <Loading v-else />
        </div>
      </div>
      <label>Arquivos da aula</label>
      <ul class="archives" v-if="lesson.archives && lesson.archives[0]">
        <li v-for="arq in lesson.archives" :key="arq.name" class="archive-item">
          <a :href="arq.link" target="_blank">
            <i class="fas fa-download"></i>
            {{ arq.name }}
          </a>
          <span class="mini-icon icon-remove" @click="removeArchive(arq, false)"
            ><i class="fas fa-minus-circle"></i
          ></span>
        </li>
      </ul>
    </article>
    <article>
      <div class="tabs">
        <div class="tab">
          <button
            :class="activeTab.section2 == 'description' ? 'tablinks active' : 'tablinks'"
            @click="activeTab.section2 = 'description'"
          >
            Descrição
          </button>
          <button
            :class="activeTab.section2 == 'markers' ? 'tablinks active' : 'tablinks'"
            v-if="lesson.hash && lesson.duration"
            @click="activeTab.section2 = 'markers'"
          >
            Markers
          </button>
          <button
            :class="activeTab.section2 == 'vimeo' ? 'tablinks active' : 'tablinks'"
            @click="activeTab.section2 = 'vimeo'"
          >
            Videos
          </button>
        </div>

        <div
          class="tabcontent"
          :style="activeTab.section2 == 'description' ? { display: 'block' } : ''"
        >
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            v-model.lazy="lesson.description"
          ></textarea>
        </div>

        <div
          class="tabcontent"
          :style="activeTab.section2 == 'vimeo' ? { display: 'block' } : ''"
        >
          <div class="vimeo-wrapper">
            <input
              type="text"
              name="vimeo-query"
              id="vimeo-query"
              placeholder="Busque pelo título do vídeo"
              v-model.lazy="vimeoQuery.query"
            />
            <transition-group
              name="list"
              mode="out-in"
              v-if="vimeoVideos && vimeoVideos.data[0]"
              tag="ul"
            >
              <li v-for="(video, key) in vimeoVideos.data" :key="video.hash">
                <input
                  type="radio"
                  name="vimeo-video"
                  class="radio-video"
                  :id="'video-' + video.hash"
                  :value="key"
                  v-model="vimeoSelected"
                  style="display: none"
                />
                <label :for="'video-' + video.hash" class="vimeo-video">
                  <img :src="video.pictures[2].link" />
                  <span>
                    {{ video.name }}
                  </span>
                </label>
              </li>
            </transition-group>
            <span
              class="vimeo-not-found"
              v-else-if="vimeoVideos && vimeoVideos.data && !vimeoVideos.data[0]"
            >
              Nenhum vídeo correspondente a este titulo foi encontrado.
            </span>
            <Loading v-else />
          </div>
        </div>

        <div
          class="tabcontent markers-wrapper"
          v-if="lesson.hash && lesson.duration"
          :style="activeTab.section2 == 'markers' ? { display: 'block' } : ''"
        >
          <div class="video-marker">
            <Player
              v-if="lesson.hash && lesson.duration && loaded"
              :resetPlayer="resetPlayer"
              :sources="[
                {
                  src: `https://insightz3d.com.br/api/video/${lesson.hash}`,
                  type: 'video/mp4',
                },
              ]"
              :markers="lesson.markers"
            />
          </div>
          <div class="markers-content">
            <div class="new-marker">
              <h3>Novo Marker</h3>
              <div class="inputs-marker">
                <p>
                  Defina o tempo em que a marcação termina
                  <small>( formato HH:MM:SS )</small>
                </p>
                <div>
                  <input type="number" min="0" v-model="tempMarker.hours" />:<input
                    type="number"
                    min="0"
                    max="60"
                    v-model="tempMarker.minutes"
                  />:<input type="number" min="0" max="60" v-model="tempMarker.seconds" />
                </div>
                <p>Defina o titulo da marcação</p>
                <div>
                  <input
                    type="text"
                    v-model="tempMarker.text"
                    placeholder="Ex.: Introdução"
                  />
                </div>
              </div>
              <button class="btn" @click="addMarker">Adicionar</button>
            </div>
            <div class="markers">
              <h3>Markers</h3>
              <draggable
                v-if="lesson.markers"
                v-model="lesson.markers"
                group="markers"
                tag="ul"
              >
                <li v-for="marker in lesson.markers" :key="marker.endTime">
                  <span>{{ marker.text }}</span>
                  <div>
                    <small>{{ formatMarkerTime(marker.endTime) }}</small>
                    <i class="fas fa-trash mini-icon" @click="removeMarker(marker)"></i>
                    <i class="fas fa-hand-paper mini-icon icon-grab"></i>
                  </div>
                </li>
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </article>

    <div class="lessons-btns">
      <button class="btn btn-delete" v-if="lid" @click="remove">Excluir</button>
      <span class="btn-cancel" @click="backRoute">Cancelar</span>
      <button
        class="btn btn-save-new"
        @click="
          validity(['#title', '#module'])
            ? save(false)
            : sendAlert('Preencha todos os campos')
        "
        :disabled="modules[0] ? false : true"
      >
        Salvar e criar outra
      </button>
      <button
        class="btn btn-save"
        @click="
          validity(['#title', '#module'])
            ? save(true)
            : sendAlert('Preencha todos os campos')
        "
        :disabled="modules[0] ? false : true"
      >
        Salvar
      </button>
    </div>
  </section>
</template>

<script>
import Player from '@/components/Course/Player.vue';

import draggable from 'vuedraggable';

import { mapActions, mapState } from 'vuex';
import { normalizeString, convertToSeconds, convertMilliseconds } from '@/helpers.js';
import { api } from '@/services.js';
import alert from '@/mixins/alert.js';

const lessonTemplate = {
  title: '',
  description: '',
  duration: '',
  comments: [],
  ratings: [],
  archives: [],
  markers: [],
  qualities: [],
  free: false,
  hash: '',
};

export default {
  name: 'Lesson',
  props: ['lid', 'course', 'id'],
  components: { Player, draggable },
  mixins: [alert],
  data() {
    return {
      md: 0,
      vimeo: null,
      vimeoQuery: {
        query: '',
        data: null,
      },
      tempMarker: {
        text: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      videoMarkers: [],
      archive: {
        redirect: true,
        name: '',
      },
      archiveQuery: '',
      archives: null,
      vimeoSelected: null,
      activeTab: {
        section1: 'add',
        section2: 'description',
      },
      loaded: true,
      lesson: { ...lessonTemplate },
    };
  },
  computed: {
    vimeoVideos() {
      return this.vimeoQuery.query != '' ? this.vimeoQuery.data : this.vimeo;
    },
    archivesQuery() {
      const query = this.archives.filter(arc => arc.name.match(this.archiveQuery));
      return query ? query : this.archives;
    },
    modules() {
      return this.course.modules.map(({ title }, key) => {
        return { title, key };
      });
    },
    ...mapState(['courses']),
  },
  methods: {
    resetPlayer() {
      this.loaded = false;
      this.$nextTick(() => {
        this.loaded = true;
      });
    },
    addMarker() {
      const { hours, minutes, seconds, text } = this.tempMarker;
      const endTime = convertToSeconds(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
          seconds
        ).padStart(2, '0')}`
      );

      if (endTime > this.lesson.duration / 1000) return;

      if (!text) return;

      if (this.lesson.markers.findIndex(mk => mk.endTime === endTime) >= 0) return;

      this.videoMarkers.push({
        endTime,
        text,
      });

      this.lesson.markers = [
        ...JSON.parse(JSON.stringify(this.lesson.markers)),
        {
          endTime,
          text,
        },
      ];

      this.tempMarker = {
        text: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    },
    removeMarker(marker) {
      this.lesson.markers = this.lesson.markers.filter(
        mk => mk.endTime != marker.endTime
      );
      this.tempMarker = JSON.parse(JSON.stringify(this.tempMarker));
    },
    formatMarkerTime(endTime) {
      let time = convertMilliseconds(endTime * 1000);

      for (let key in time) {
        time[key] = String(time[key]).padStart(2, '0');
      }

      return `${time.horas}:${time.minutos}:${time.segundos}`;
    },
    async uploadArchive(event) {
      if (this.archive.name == '' || !this.$refs.archive.files[0]) return;

      if (!this.lesson.archives) this.lesson.archives = [];

      if (
        this.lesson.archives.findIndex(aq => {
          aq.name == this.archive.name;
        }) >= 0
      )
        return;

      const button = event.currentTarget;
      button.innerText = 'Fazendo upload...';
      button.setAttribute('disabled', '');
      try {
        const form = new FormData();
        const file = this.$refs.archive.files;

        for (let key in this.user) {
          form.append(key, JSON.stringify(this.user[key]));
        }

        form.append('redirect', this.archive.redirect);
        form.append('name', this.archive.name);

        form.append(file[0].name, file[0]);

        await api
          .post('/management/archive', form)
          .then(res => {
            this.lesson.archives.push(res.data);
            this.getArchives();
            button.removeAttribute('disabled');
            button.innerText = 'Upload';
          })
          .catch(err => {
            console.log(err);
            button.removeAttribute('disabled');
            button.innerText = 'Upload';
          });
      } catch (err) {
        console.log(err);
      }
    },
    async removeArchive(archive, deleteArchive = false) {
      if (
        window.confirm(
          deleteArchive
            ? `Deseja deletar o arquivo "${archive.name}"?`
            : `Deseja remover o arquivo da aula?`
        )
      ) {
        const path = `/${
          archive.link.replace(/\?dl=./g, '').split('/')[
            archive.link.split('/').length - 1
          ]
        }`;

        if (deleteArchive) {
          await api.delete('/management/archive', { path });
          this.getArchives();
        }

        this.lesson.archives = this.lesson.archives.filter(
          arq => arq.link != archive.link
        );
      }
    },
    pushArchive(archive) {
      if (!this.lesson.archives) this.lesson.archives = [];
      let newArchive = {
        name: archive.name
          .split('+')
          .join(' ')
          .replace(/\.(.*)/g, ''),
        link: archive.link,
      };

      if (this.lesson.archives.findIndex(arq => arq.name == newArchive.name) < 0)
        this.lesson.archives.push(newArchive);
    },
    getArchives() {
      api.get('/management/archives').then(res => {
        this.archives = res.data;
      });
    },
    searchVimeoVideo(query) {
      api.get('/management/vimeo', { params: { query } }).then(r => {
        this.vimeoSelected = null;
        this.vimeoQuery.data = r.data;
      });
    },
    getVimeoVideos() {
      api.get('/management/vimeo').then(r => {
        this.vimeo = r.data;
      });
    },
    getVimeoVideo(hash, isEdit) {
      api
        .get('/management/vimeo', { params: { hash } })
        .then(r => {
          const { name, duration, pictures, qualities } = r.data;
          this.lesson.thumb = pictures[3].link;

          if (isEdit) {
            this.lesson = {
              thumb: pictures[3].link,
              duration,
              qualities,
              ...this.lesson,
            };
          } else {
            this.lesson = {
              title: name,
              thumb: pictures[3].link,
              duration,
              qualities:
                this.lesson.qualities && this.lesson.qualities[0]
                  ? this.lesson.qualities
                  : qualities,
              hash: this.lesson.hash,
              description: this.lesson.description,
              ratings: this.lesson.ratings,
              free: false,
              archives: this.lesson.archives,
              comments: this.lesson.comments,
            };
          }
        })
        .catch(err => {
          if (err.response) this.sendAlert(err.response.data.message);
        });
    },
    async save(back) {
      if (this.lid)
        this.course.modules[Number(this.md)].videos[
          Number(this.lid.split('-')[0])
        ] = this.lesson;
      else this.course.modules[Number(this.md)].videos.push(this.lesson);

      await this.managementUpdateOne({ payload: this.course, route: 'COURSE' });

      if (back) this.backRoute();

      this.vimeoSelected = null;
      this.lesson = { ...lessonTemplate };
      this.lesson.archives = [];
      this.loaded = false;
    },
    remove() {
      this.course.modules[Number(this.md)].videos = this.course.modules[
        Number(this.md)
      ].videos.filter(lesson => lesson.hash != this.lesson.hash);

      this.lesson = { ...lessonTemplate };

      this.backRoute();
    },
    backRoute() {
      this.loaded = false;
      this.$router.push({ path: `/dashboard/course/${this.id}` });
    },
    ...mapActions(['managementUpdateOne']),
  },
  watch: {
    vimeoSelected: {
      handler(value) {
        if (value != null || value != undefined) {
          const { hash, name, duration, pictures, qualities } = this.vimeoVideos.data[
            value
          ];

          this.lesson = {
            title: name,
            hash,
            duration,
            qualities:
              this.lesson.qualities && this.lesson.qualities[0]
                ? this.lesson.qualities
                : qualities,
            description: this.lesson.description,
            thumb: pictures[3].link,
            ratings: this.lesson.ratings,
            free: false,
            comments: this.lesson.comments,
            archives: this.lesson.archives,
            markers: this.lesson.markers,
          };
        }
      },
    },
    'lesson.hash': {
      handler(value, old) {
        if (value != old) {
          this.lesson.hash = value.replace(/[^0-9]*/, '');
          value = value.replace(/[^0-9]*/, '');
          if (value && value != '' && value != old)
            this.getVimeoVideo(value, this.lid ? true : false);
        }
      },
      deep: true,
    },
    'vimeoQuery.query': {
      handler(value) {
        if (value && value != '') this.searchVimeoVideo(value);
      },
      deep: true,
    },
  },
  created() {
    if (this.lid) {
      const lid = Number(this.lid.split('-')[0]);
      const moduleTitle = this.lid.replace(`${lid}-`, '');
      const moduleIndex = this.course.modules.findIndex(
        md => normalizeString(md.title) == moduleTitle
      );
      const video = this.course.modules[moduleIndex].videos[lid];

      this.md = moduleIndex;
      this.lesson = JSON.parse(JSON.stringify(video));

      if (!this.lesson.markers) this.lesson.markers = [];

      this.videoMarkers = JSON.parse(JSON.stringify(this.lesson.markers));
    }
    if (!this.vimeo) this.getVimeoVideos();
    this.getArchives();
  },
};
</script>

<style scoped>
.lesson {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: var(--text-primary);
  color: var(--text-secondary);
  max-width: inherit !important;
}

.lesson h1 {
  font-size: 1.5rem;
  border-bottom: 1px solid #24242429;
  height: min-content;
  padding-bottom: 15px;
}

.lesson article {
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: auto;
}

.lesson label:not(:first-child) {
  margin-top: 20px;
}

.lessons-btns {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  align-items: center;
  position: relative;
}

.lessons-btns * {
  padding: 8px 24px;
  cursor: pointer;
}

.lessons-btns *:not(:last-child) {
  margin-right: 0.6rem;
}

.btn-delete {
  border: 1px solid #f41c1c;
  background-color: transparent;
  color: #f41c1c;
  position: absolute;
  left: 0;
  margin-left: 0;
}

.btn-delete:hover {
  background-color: #f41c1c !important;
  color: var(--text-primary);
}

.btn.btn-save-new {
  border: 2px solid #e8810c;
  background-color: transparent;
  color: #e8810c;
  font-weight: bold;
}

.btn.btn-save-new:hover {
  background-color: #e8810c !important;
  color: var(--text-primary);
}

.tabs {
  display: block;
  position: relative;
}

.tab {
  overflow: hidden;
  margin: 20px 0;
}

.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 0.9rem;
  color: #918e8e;
  border-bottom: 1px solid #ccc;
}

.tab button.active,
.tab button:hover {
  font-weight: bold;
  color: var(--text-secondary);
  border-bottom-color: var(--text-lighted);
}

.tabcontent {
  display: none;
  margin-bottom: 20px;
}

.tabcontent textarea {
  width: 100%;
}

.vimeo-wrapper ul {
  display: flex;
  flex-wrap: wrap;
  max-height: 450px;
  overflow-y: hidden;
  overflow-y: scroll;
  scrollbar-width: thin;
}

.vimeo-video {
  width: 280px;
  margin: 2px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.vimeo-video img {
  border-radius: 5px;
}

.vimeo-video span {
  font-size: 0.9rem;
  margin-top: 10px;
  display: block;
  font-weight: normal;
}

#vimeo-query {
  width: 100%;
  margin-bottom: 10px;
}

.vimeo-not-found {
  text-align: center;
  display: block;
  padding: 10px;
}

.radio-video:checked + label {
  background-color: var(--text-secondary);
  color: var(--text-primary);
}

.archives-wrapper {
  display: flex;
  flex-direction: column;
}

.archives-wrapper span {
  font-size: 0.9rem;
  padding: 0 10px;
}

.archives-wrapper .btn {
  float: left;
  width: max-content;
  margin-top: 20px;
}

.archives {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  max-height: 245px;
  overflow-y: scroll;
}

.archive-item {
  display: flex;
  height: 30px;
  align-items: center;
  background-color: var(--text-secondary);
  color: var(--text-primary);
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
  padding: 20px 5px 20px 15px;
  border-radius: 5px;
  margin: 10px;
  margin-left: 0;
}

.archive-item span:first-of-type {
  margin-left: 20px;
}

.archive-item span:not(:first-of-type) {
  margin-left: 7px;
}

.archive-item .mini-icon {
  background-color: white;
  color: #242424;
  height: 30px;
}

.archive-item .mini-icon:hover {
  background-color: rgb(126, 158, 240);
  color: white;
}

.archive-item .icon-remove:hover {
  background-color: rgb(241, 50, 50);
  color: white;
}

.free-wrapper label:not(label.switch),
.redirect-wrapper label:not(label.switch) {
  margin-left: 10px;
  font-weight: normal;
  cursor: pointer;
  font-style: oblique;
}

.video-marker {
  min-height: 400px;
}

.video-marker iframe {
  width: 100%;
  min-width: 100%;
  max-width: 90vw;
  height: 100%;
  aspect-ratio: 16/9;
}

.new-marker h3,
.markers h3 {
  font-size: 1.3rem;
  font-weight: bold;
  text-align: left;
}

.new-marker .btn {
  margin-top: 15px;
  float: left;
}

.new-marker p {
  color: var(--activated);
  text-align: left;
  white-space: nowrap;
}

.new-marker p:not(:first-child) {
  margin-top: 15px;
}

.new-marker p small {
  font-weight: bold;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-left: 3px;
}

.inputs-marker input[type='number'] {
  width: 70px;
  margin: 5px;
}

.inputs-marker input[type='text'] {
  width: 100%;
  margin: 5px;
}

.inputs-marker {
  margin-top: 20px;
}

.markers-content {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.markers {
  border-left: 1px solid rgba(61, 61, 61, 0.693);
  margin-left: 50px;
  padding: 0px 20px;
  min-width: 40%;
}

.markers li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.markers li:not(:first-child) {
  margin-top: 10px;
}

.uploads > div:first-child {
  display: grid;
  margin-bottom: 15px;
}

.uploads small {
  text-align: center;
  display: block;
  font-weight: bold;
}

.markers li small {
  font-size: 0.9rem;
  padding: 5px 10px;
  background-color: var(--text-secondary);
  color: var(--text-primary);
  border-radius: 6px;
  margin-left: 7px;
  user-select: none;
}

.markers li div {
  display: flex;
}

.markers li i {
  color: var(--text-primary);
  margin-left: 5px;
}

@media (max-width: 1174px) {
  .markers-content {
    flex-direction: column;
  }

  .markers {
    padding: 0;
    border: 0;
    margin: 0;
    margin-top: 50px;
  }
}
</style>
