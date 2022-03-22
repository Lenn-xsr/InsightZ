<template>
  <div class="change-preview" v-if="view" @click="close">
    <div class="wrapper">
      <i class="far fa-times-circle close-icon" @click="close"></i>
      <div>
        <div>
          <h2>Escolha a imagem</h2>
          <ul class="choose-wrapper" v-if="arts[0]">
            <li
              v-for="art in arts"
              :key="art.hash_id"
              @click="changeImage(art.assets[0].image_url)"
              :style="
                adjust.url && art.assets[0].image_url == adjust.url
                  ? { border: '2px solid var(--text-lighted)' }
                  : ''
              "
            >
              <img :src="art.assets[0].image_url" v-if="art.assets[0]" />
            </li>
          </ul>
          <span class="no-art" v-else
            >Adicione uma nova arte para fazer esta modificação</span
          >
        </div>
        <div>
          <h2>Ajuste a imagem</h2>
          <p>Utilize o mouse para mover e o scroll para dar zoom.</p>
          <cropper
            class="cropper"
            :src="adjust.url"
            :stencil-props="{
              handlers: {},
              movable: false,
              scalable: false,
            }"
            :stencil-size="{
              width: 345,
              height: 160,
            }"
            image-restriction="stencil"
            @change="change"
          />
        </div>
        <button
          class="btn"
          @click.prevent="savePreview"
          :disabled="adjust.url && arts[0] ? false : true"
        >
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
  name: 'ChangePreview',
  props: ['changePreview', 'arts'],
  components: { Cropper },
  data() {
    return {
      view: false,
      adjust: {
        result: {
          coordinates: null,
          image: null,
        },
        url: '',
      },
    };
  },
  methods: {
    change({ coordinates, image }) {
      this.adjust.result = { coordinates, image };
    },
    close({ target, currentTarget }) {
      if (target === currentTarget) {
        this.view = false;
      }
    },
    changeImage(url) {
      this.adjust.url = url;
    },
    async savePreview() {
      try {
        await this.$store.commit('UPDATE_USER', {
          profile_preview: Object.assign({}, this.adjust),
        });
        this.$store.dispatch('updateUser', this.$store.state.user);

        this.view = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    changePreview() {
      if (this.changePreview) this.view = this.changePreview;
    },
  },
  created() {
    if (
      this.$store.state.user.profile_preview &&
      this.$store.state.user.profile_preview.url
    ) {
      this.adjust.url = this.$store.state.user.profile_preview.url.toString();
    }
  },
};
</script>

<style scoped>
.change-preview {
  position: fixed;
  left: 0;
  top: 0;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background-color: #4d4d44b0;
  z-index: 10000;
}

.cropper {
  width: clamp(200px, 345px, 100%);
  border-radius: 10px;
  margin: auto;
  overflow: hidden;
  height: 160px;
  background: #ddd;
}

.change-preview p {
  color: var(--activated);
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.wrapper {
  width: clamp(300px, 600px, 100%);
  background-image: url(/img/BackgroundC.aa857b92.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
  color: var(--text-secondary);
  padding: 7px;
  justify-self: center;
  display: grid;
  border-radius: 20px 2px 20px 2px;
  position: relative;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
}

.wrapper h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.wrapper > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffffe6;
  padding: 20px;
  border-radius: 20px 2px 20px 2px;
}

.wrapper > div > div:first-child {
  margin-bottom: 25px;
}

.wrapper .btn {
  height: max-content;
  margin-top: 15px;
  align-self: flex-end;
}

.close-icon {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
}

.choose-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.choose-wrapper li {
  width: 150px;
  height: 150px;
  overflow: hidden;
  display: grid;
  place-content: center;
  border-radius: 5px;
  margin: 0 5px 5px;
  cursor: pointer;
}

.choose-wrapper img {
  border-radius: 5px;
}

.no-art {
  padding: 5px;
  display: block;
  text-align: center;
  color: #d21d1d;
}

.move-buttons {
  display: grid;
  margin-right: 10px;
  grid-template-areas: 'blank0 up blank1' 'left blank2 right' 'blank3 down blank4';
  justify-content: center;
  font-size: 1.1rem;
}

.move-buttons .fas {
  cursor: pointer;
  padding: 5px;
}

.fa-arrow-up {
  grid-area: up;
}

.fa-arrow-down {
  grid-area: down;
}

.fa-arrow-left {
  grid-area: left;
}

.fa-arrow-right {
  grid-area: right;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 635px) {
  .choose-wrapper {
    justify-content: center;
  }

  .choose-wrapper li {
    width: 100%;
    height: 150px;
    place-content: baseline;
  }
}
</style>
