<template>
  <div class="add-art" v-if="view" @click="close">
    <div class="wrapper">
      <i class="far fa-times-circle close-icon" @click="close"></i>
      <div>
        <div>
          <h2>Selecione o link do projeto</h2>
          <p>
            Selecione o link do projeto no ArtStation inteiro ou apenas o id e cole abaixo
          </p>
          <img src="@/assets/artstation_artwork.png" />
        </div>
        <div>
          <input type="text" name="art-hash" id="art-hash" v-model="hash" required />
          <a
            class="btn"
            @click.prevent="
              validity(['#art-hash'])
                ? saveStationArt($event)
                : sendAlert('Preencha o campo.')
            "
            >Adicionar</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import alert from '@/mixins/alert.js';
import { api } from '@/services.js';

export default {
  name: 'AddArt',
  props: ['addArt'],
  mixins: [alert],
  data() {
    return {
      view: false,
      hash: '',
    };
  },
  methods: {
    close({ target, currentTarget }) {
      if (target === currentTarget) {
        this.view = false;
      }
    },
    validity(arr) {
      let result = [];
      arr.forEach(e => {
        result.push(document.querySelector(e).validity.valid);
      });
      return !result.includes(false);
    },
    async saveStationArt() {
      try {
        if (this.$store.state.user.artstation_arts.includes(this.hash))
          return this.sendAlert('Arte já inclusa em sua lista');

        await api
          .post('/artstation/project', { hash: this.hash })
          .then(async r => {
            if (r.data.user.username !== this.$store.state.user.artstation_user)
              return this.sendAlert(
                'Este projeto não pertence ao usuário do artstation cadastrado nesta conta.'
              );

            await this.$store.commit('UPDATE_USER', {
              artstation_arts: [this.hash, ...this.$store.state.user.artstation_arts],
            });
            this.$store.dispatch('updateUser', this.$store.state.user);

            this.view = false;
          })
          .catch(() => {
            return this.sendAlert('Projeto não encontrado.');
          });
      } catch (error) {
        return this.sendAlert('Ocorreu um erro no servidor, contate um administrador.');
      }
    },
  },
  watch: {
    addArt() {
      if (this.addArt) this.view = this.addArt;
    },
    hash(hash) {
      if (
        hash.includes('https') ||
        hash.includes('http') ||
        (hash.includes('artwork') && hash.match(/artwork\/(.*)/)[1])
      )
        this.hash = hash.match(/artwork\/(.*)/)[1];
    },
  },
};
</script>

<style scoped>
.add-art {
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

.add-art p {
  color: var(--activated);
  font-size: 0.9rem;
  white-space: unset;
}

.wrapper {
  width: clamp(200px, 500px, 100%);
  background-image: url('../../assets/BackgroundC.jpeg');
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

.wrapper > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffffe6;
  padding: 25px;
  border-radius: 20px 2px 20px 2px;
}

.wrapper > div > div:first-child {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrapper > div > div:last-child,
.wrapper form div,
.wrapper form {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 25px;
}

.wrapper form div {
  margin-top: 0;
}

.wrapper form {
  gap: 10px;
}

.wrapper .btn {
  height: max-content;
  margin-top: 15px;
  align-self: flex-end;
}

.wrapper img {
  border-radius: 5px;
}

.wrapper button {
  background-color: var(--primary);
  color: var(--text-primary);
  font-weight: bold;
  border: 0;
  border-radius: 15px 2px 15px 2px;
  margin: 5px;
  transition: all 0.3s;
  padding: 10px;
}

.wrapper button:hover {
  background-color: var(--secondary);
  transform: scale(1.05);
}

.close-icon {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
}
</style>
