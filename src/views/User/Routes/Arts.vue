<template>
  <section class="lock-width" v-if="user.artstation_user && user.artstation_user != ''">
    <div>
      <h2>Seus trabalhos</h2>
      <p>
        Aqui são os trabalhos que irão aparecer no seu Portfolio, aqueles com símbolo do
        ArtStation <i class="fab fa-artstation"></i> são atualizados automaticamente.
      </p>
    </div>
    <div class="arts">
      <AddArt :addArt="addArt" />
      <transition-group tag="ul" name="list" mode="out-in" v-if="isAnual">
        <li v-for="art in artstation.arts" :key="art.hash_id">
          <div class="showIn" @click="showIn(art.hash_id)">
            <div>
              <small>Ver no portfolio</small>
            </div>
          </div>
          <a :href="'https://www.artstation.com/artwork/' + art.hash_id" target="_blank">
            <i class="fab fa-artstation"></i>
          </a>
          <i class="fas fa-trash" @click="delFromStation(art.hash_id)"></i>
          <img :src="art.assets[0].image_url" />
        </li>
        <li
          class="button-add-art"
          key="addArt"
          @click="showAdd"
          v-if="user.artstation_arts.length < 3"
        >
          <small>Você tem {{ 3 - user.artstation_arts.length }} projeto's restante</small>
        </li>
      </transition-group>
      <div class="locked" key="locked" v-else>
        <div>
          <i class="fas fa-lock"></i>
          <small>Este recurso é exclusivo para assinantes do community anual.</small>
        </div>
      </div>
    </div>
    <div
      class="portf-preview"
      v-if="user.artstation_arts && user.artstation_arts[0] && isAnual"
    >
      <div>
        <h2>Imagem perfil de portfólio</h2>
        <p>Escolha um de seus trabalhos para aparecer na busca do seu perfil</p>
      </div>
      <div>
        <PortfPreview :user="user" @click.native="showChange">
          <i class="far fa-edit cp-icon"></i>
        </PortfPreview>
        <ChangePreview :arts="artstation.arts" :changePreview="changePreview" />
      </div>
    </div>
  </section>
  <section v-else>
    <div class="error">
      <h2>
        Insira o link do seu ArtStation em
        <router-link to="/user/edit">Conta</router-link> para continuar
      </h2>
      <p>
        Pegamos os seus trabalhos diretamente do ArtStation, assim facilitamos a sua vida
        para não ter que ficar atualizando em dois lugares :)
      </p>
    </div>
  </section>
</template>

<script>
import AddArt from '@/components/User/AddArt.vue';
import PortfPreview from '@/components/User/PortfPreview.vue';
import ChangePreview from '@/components/User/ChangePreview.vue';

import { mapState } from 'vuex';

import artstation from '@/mixins/artstation.js';

export default {
  name: 'Arts',
  mixins: [artstation],
  props: ['isAnual'],
  components: { AddArt, PortfPreview, ChangePreview },
  data() {
    return {
      addArt: false,
      changePreview: false,
    };
  },
  computed: {
    ...mapState(['user', 'anualTags']),
  },
  methods: {
    async delFromStation(art_hash) {
      try {
        const tempArts = [...this.user.artstation_arts].filter(i => i !== art_hash);

        await this.$store.commit('UPDATE_USER', {
          artstation_arts: tempArts,
        });
        this.$store.dispatch('updateUser', this.$store.state.user);
      } catch (error) {
        console.log(error);
      }
    },
    showAdd() {
      this.addArt = true;
      setTimeout(() => (this.addArt = false), 100);
    },
    showChange() {
      this.changePreview = true;
      setTimeout(() => (this.changePreview = false), 100);
    },
    showIn(art) {
      const routeData = this.$router.resolve({
        name: 'Portfolio',
        params: { id: this.user.username },
        query: { art },
      });
      window.open(routeData.href, '_blank');
    },
  },
  watch: {
    '$store.state.user.artstation_arts': function (newHashes, oldHashes) {
      const removed = oldHashes.filter(i => !newHashes.includes(i));
      const added = newHashes.filter(i => !oldHashes.includes(i));
      if (removed[0])
        this.artstation.arts = this.artstation.arts.filter(a => a.hash_id !== removed[0]);
      else if (added[0]) this.getArtInfo(added);
      else {
        this.getArtInfo(newHashes);
      }
    },
  },
  created() {
    this.getArtInfo(this.user.artstation_arts);
  },
};
</script>

<style scoped>
section > div:first-child,
.portf-preview > div:first-child {
  max-width: 90%;
  margin-bottom: 30px;
}

section > div:first-child p,
.portf-preview > div:first-child p {
  margin-top: 5px;
}

.arts ul {
  column-count: 3;
  gap: 0;
}

.arts li,
.arts ul {
  width: auto;
}

.arts li {
  overflow: hidden;
  border-radius: 5px;
  margin: 0 10px 10px 0;
  transition: all 0.3s;
  position: relative;
  break-after: avoid;
  break-before: avoid;
  break-inside: avoid;
  display: block;
}

.arts li > a > i {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 1;
  cursor: pointer;
}

.arts li > i {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
  cursor: pointer;
  color: #ff2525;
}

.arts img {
  transition: all 0.3s;
}

.locked {
  background-color: rgba(79, 79, 75, 0.34901960784313724);
  height: 130px;
  border: 1px solid var(--activated);
  position: relative;
  border-radius: 5px;
}

.locked div {
  position: absolute;
  display: grid;
  place-content: center;
  font-size: small;
  padding: 0 5px;
  width: 100%;
  height: 100%;
  text-align: center;
  gap: 10px;
}

.button-add-art {
  background-color: rgba(79, 79, 75, 0.34901960784313724);
  height: 130px;
  border: 1px solid var(--activated);
  cursor: pointer;
}

.button-add-art small {
  position: absolute;
  z-index: 2;
  color: var(--tertiary);
  bottom: 0;
  right: 0;
  font-size: small;
  padding: 0 5px;
}

.button-add-art::before {
  content: '+';
  display: grid;
  place-content: center;
  height: 100%;
  font-size: 30px;
  color: var(--primary);
  font-weight: bold;
}

.button-add-art:hover {
  transform: scale(1.05);
}

.portf-preview {
  margin-top: 50px;
}

.cp-icon {
  position: absolute;
  z-index: 1;
  font-size: 1.4rem;
  bottom: 8px;
  right: 5px;
  padding: 0;
}

.showIn {
  padding: 5px;
  position: absolute;
  height: 100%;
  width: 100%;
  display: none;
  transition: all 0.3s;
}

.showIn div {
  background-color: rgba(79, 79, 75, 0.34901960784313724);
  height: 100%;
  border: 1px solid var(--activated);
  cursor: pointer;
  width: 100%;
  display: grid;
  place-content: center;
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
}

.arts li:hover .showIn {
  display: block;
}

.error a {
  font-style: oblique;
  text-decoration: underline;
}

@media (max-width: 735px) {
  .arts ul {
    column-count: 2;
  }
}

@media (max-width: 635px) {
  .arts ul {
    column-count: 1;
  }
}
</style>
