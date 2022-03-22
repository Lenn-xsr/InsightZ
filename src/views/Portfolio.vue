<template>
  <main class="portfolio" v-if="user">
    <div class="user-wrapper">
      <div>
        <img :src="user.avatar.link" v-if="user.avatar && user.avatar.link" />
      </div>
      <div class="user-infos">
        <div>
          <h1>{{ user.full_name || 'Anônimo' }}</h1>
          <span v-if="user.headline">{{ user.headline }}</span>
          <small v-if="user.city && user.country"
            ><i class="far fa-compass"></i> {{ user.city }}, {{ user.country }}</small
          >
        </div>
        <div class="menu">
          <span v-if="arts[0]">PROJETOS</span>
          <div v-if="arts[0]">
            <a @click="changeView('all')" :class="view == 'all' ? 'activated' : ''"
              >Todos</a
            >
            <a
              @click="changeView(project.hash_id, true)"
              v-for="project in arts"
              :key="project.hash_id"
              :class="view == project.hash_id ? 'activated' : ''"
              >{{ project.title }}</a
            >
          </div>
          <a @click="changeView('about')" :class="view == 'about' ? 'activated' : ''"
            >RESUME</a
          >
        </div>
      </div>
    </div>
    <transition-group class="view-content" tag="section" name="list" mode="out-in">
      <ArtPreview
        :art="project.art"
        v-if="project.art && arts.length == user.artstation_arts.length && project.show"
        key="ArtPreview"
      />
      <div class="images-wrapper" v-else-if="view == 'all'" key="images-wrapper">
        <transition-group tag="ul" name="list" mode="out-in">
          <li
            v-for="project in arts"
            :key="project.hash_id"
            :title="project.title"
            :style="{
              'background-image': `url(${project.assets[0].image_url})`,
            }"
            @click="changeView(project.hash_id, true)"
          ></li>
        </transition-group>
      </div>
      <div v-else-if="view == 'about'" class="about lock-width" key="about">
        <div class="resume" v-if="user.summary">
          <small>Resume</small>
          <p>{{ user.summary }}</p>
        </div>
        <div class="tags-wrapper">
          <div class="tags interests" v-if="user.interests[0]">
            <small>Interesses</small>
            <ul>
              <li v-for="interest in user.interests" :key="interest">
                {{ interest }}
              </li>
            </ul>
          </div>

          <div class="tags" v-if="user.tags[0]">
            <small>Habilidades</small>
            <ul>
              <li v-for="tag in user.tags" :key="tag">
                {{ tag }}
              </li>
            </ul>
          </div>

          <div class="tags softwares" v-if="user.softwares[0]">
            <small>Programas</small>
            <ul>
              <li v-for="software in user.softwares" :key="software">
                {{ software }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition-group>
    <div class="footer">
      <div class="social" v-if="social">
        <a
          v-for="(info, key) in social"
          :href="
            info.link.includes('https') || info.link.includes('http')
              ? info.link
              : info.pre + info.link
          "
          target="_blank"
          :key="key"
        >
          <i :class="info.icon"></i>
        </a>
      </div>
    </div>
  </main>
  <Loading v-else />
</template>

<script>
import ArtPreview from '@/components/User/ArtPreview.vue';
import { api } from '@/services.js';
import { mapActions } from 'vuex';

const icons = {
  artstation_url: {
    icon: 'fab fa-artstation',
    pre: 'https://artstation.com/',
  },
  public_email: {
    icon: 'fa fa-envelope',
    pre: 'mailto:',
  },
  linkedin_url: {
    icon: 'fab fa-linkedin',
    pre: 'https://www.linkedin.com/in/',
  },
  instagram_url: {
    icon: 'fab fa-instagram',
    pre: 'https://www.instagram.com/',
  },
  youtube_url: {
    icon: 'fab fa-youtube',
    pre: 'https://youtube.com/',
  },
  behance_url: {
    icon: 'fab fa-behance',
    pre: 'https://www.behance.net/',
  },
};

export default {
  name: 'Portfolio',
  props: ['id'],
  components: { ArtPreview },
  data() {
    return {
      user: null,
      arts: [],
      view: 'all',
      project: {
        show: false,
        art: null,
      },
    };
  },
  computed: {
    social() {
      let arr = [];
      for (let icon in icons) {
        if (this.user[icon]) {
          arr.push({
            link: this.user[icon],
            ...icons[icon],
          });
        }
      }
      return arr[0] ? arr : null;
    },
  },
  methods: {
    changeView(option, isProject) {
      if (isProject)
        this.project.art = this.arts.find(project => project.hash_id == option);

      this.project.show = isProject ? true : false;
      this.view = option;
    },
    async getArts() {
      if (this.user.artstation_arts[0]) {
        this.user.artstation_arts.forEach(hash => {
          api.post('/artstation/project', { hash }).then(r => {
            delete r.data.user;
            this.arts.push(r.data);

            if (
              this.user.artstation_arts.length == this.arts.length &&
              this.user.artstation_arts.includes(this.$route.query.art)
            )
              this.changeView(this.$route.query.art, true);
          });
        });
      } else this.changeView('about');
    },
    ...mapActions(['getUser']),
  },
  created() {
    this.getUser(this.id)
      .then(res => {
        this.user = res.data;
        this.getArts();
      })
      .catch(() => this.$router.push({ name: 'Mercado3D' }));
  },
};
</script>

<style scoped>
.portfolio {
  display: grid;
  grid-template-areas: 'user-wrapper view-content' 'user-wrapper footer';
  grid-template-columns: 230px;
  grid-template-rows: 85% 15%;
  max-height: calc(100vh - 60px);
  min-height: calc(100vh - 60px);
  background-color: var(--primary);
  padding: 10px;
  margin-top: 70px;
  max-width: 100vw;
  overflow: hidden;
}

.view-content {
  grid-area: view-content;
  position: relative;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.images-wrapper {
  height: 100%;
  overflow: hidden;
  min-width: 100%;
  max-width: 100%;
}

.images-wrapper ul {
  display: flex;
  height: 100%;
  gap: 12px;
  padding: 12px;
}

.images-wrapper li {
  overflow: hidden;
  position: relative;
  width: clamp(50%, 100%, 100%);
  height: 100%;
  border-radius: 5px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.2s;
  cursor: pointer;
}

.images-wrapper li:hover {
  transform: scale(1.02);
}

.user-wrapper,
.footer {
  background-color: var(--tertiary);
}

.about {
  display: grid;
  place-content: center;
  padding: 25px;
  margin: 5px;
  text-align: center;
}

.footer {
  grid-area: footer;
  display: grid;
  place-content: center;
}

.social {
  display: flex;
}

.social a {
  margin: 0 10px;
}

.social i {
  font-size: 1.5rem;
  color: #959594;
}

.social i:hover {
  color: var(--text-primary);
}

.menu {
  padding: 12%;
  display: grid;
  gap: 10px;
  height: min-content;
  overflow: hidden;
  text-align: center;
}

.menu > div {
  display: grid;
  gap: 8px;
  padding: 5px;
  margin-bottom: 5px;
}

.menu span,
.menu > a {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: bold;
}

.menu a {
  font-size: 0.8rem;
  color: #c9c9c9;
  cursor: pointer;
}

.menu a.activated,
.menu a:hover {
  color: var(--text-lighted);
}

.user-wrapper {
  grid-area: user-wrapper;
  display: flex;
  flex-direction: column;
}

.user-wrapper > div:first-of-type {
  padding: 12px;
  width: clamp(100px, 100%, 230px);
}

.user-wrapper img {
  overflow: hidden;
  object-fit: contain;
  border-radius: 5px;
  max-width: 200px;
  max-height: 200px;
  margin: auto;
}

.user-wrapper h1 {
  font-size: 1.5rem;
}

.user-wrapper span {
  font-size: 0.8rem;
  color: #e1e1e1;
}

.user-wrapper small {
  text-align: center;
  margin-top: 10px;
}

.user-infos > div:first-of-type {
  display: grid;
  padding: 15px;
  gap: 9px;
  text-align: center;
}

.no-content {
  display: grid;
  place-content: center;
  padding: 10px;
  text-align: left;
}

.tags {
  margin-top: 35px;
  text-align: center;
}

.tags.interests {
  margin-top: 0;
}

.tags-wrapper {
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
}

.tags small,
.resume small {
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  color: #ffffffc9;
  margin: 10px;
  display: block;
}

.resume {
  margin-bottom: 35px;
}

.resume p {
  word-break: break-word;
  white-space: break-spaces;
}

.tags ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.tags li {
  border: 1px solid #8b70ac;
  background-color: #403152;
  padding: 3px;
  margin: 0 6px 5px 0;
  border-radius: 5px;
  font-size: small;
  text-transform: capitalize;
}

@media screen and (max-width: 864px) {
  .portfolio {
    grid-template-areas: 'user-wrapper' 'view-content' 'footer';
    grid-template-columns: unset;
    grid-template-rows: max-content minmax(300px, 70%) 100px;
    max-height: unset;
  }

  .user-wrapper {
    flex-direction: row;
  }

  .user-wrapper img {
    max-width: 200px;
    max-height: 200px;
  }

  .user-wrapper h1 {
    font-size: 2.4vmax;
  }

  .user-wrapper span {
    font-size: 1.8vmax;
  }

  .menu {
    padding: 15px;
  }

  .footer {
    padding-right: 0;
  }

  .user-infos {
    margin: auto;
  }
}

@media screen and (max-width: 500px) {
  .user-wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
