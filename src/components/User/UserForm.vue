<template>
  <form :style="isAnual ? '' : { 'column-count': 1 }">
    <div class="personal">
      <h2>Informações pessoais</h2>
      <div>
        <label for="full_name">Nome</label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          v-model.lazy="user.full_name"
        />
      </div>

      <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" :value="user._id" disabled />
      </div>

      <div>
        <label for="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model.lazy="user.password"
        />
        <i class="fas fa-eye" @click="showPassword"></i>
      </div>

      <div>
        <label for="headline">Descrição</label>
        <input type="text" name="headline" id="headline" v-model.lazy="user.headline" />
      </div>

      <div>
        <label for="summary">Sumário</label>
        <textarea type="text" name="summary" id="summary" v-model.lazy="user.summary" />
      </div>

      <div>
        <label for="city">Cidade</label>
        <input type="text" name="city" id="city" v-model.lazy="user.city" />
      </div>

      <div>
        <label for="country">País</label>
        <input type="text" name="country" id="country" v-model.lazy="user.country" />
      </div>
    </div>
    <div class="others" v-if="isAnual">
      <h2>Outras informações</h2>

      <div>
        <label>Tags</label>
        <InputTag
          v-model.lazy="user.tags"
          placeholder="Adicionar tag"
          :add-tag-on-blur="true"
          :before-adding="tag => tag.trim()"
        />
      </div>

      <div>
        <label>Disponibilidade de contratação</label>
        <div class="checkbox-wrapper">
          <div class="checkbox-content">
            <label for="full_time">
              <input
                type="checkbox"
                name="full_time"
                id="full_time"
                v-model="user.interests"
                value="full time"
              />
              Full-time
            </label>
          </div>
          <div class="checkbox-content">
            <label for="contrato">
              <input
                type="checkbox"
                name="contrato"
                id="contrato"
                v-model="user.interests"
                value="contrato"
              />
              Contrato
            </label>
          </div>
          <div class="checkbox-content">
            <label for="freelance">
              <input
                type="checkbox"
                name="freelance"
                id="freelance"
                v-model="user.interests"
                value="freelance"
              />
              Freelance
            </label>
          </div>
        </div>
      </div>

      <div>
        <label>Programas</label>
        <InputTag
          v-model.lazy="user.softwares"
          placeholder="Adicionar programa"
          :add-tag-on-blur="true"
          :before-adding="tag => tag.trim()"
        />
      </div>
    </div>
    <div class="contact" v-if="isAnual">
      <h2>Informações de contato</h2>
      <div>
        <label for="public_email">Email Público</label>
        <input
          type="text"
          name="public_email"
          id="public_email"
          v-model.lazy="user.public_email"
        />
      </div>

      <div>
        <label for="artstation_url">ArtStation</label>
        <input
          type="text"
          name="artstation_url"
          id="artstation_url"
          v-model.lazy="user.artstation_url"
        />
      </div>

      <div>
        <label for="linkedin_url">Linkedin</label>
        <input
          type="text"
          name="linkedin_url"
          id="linkedin_url"
          v-model.lazy="user.linkedin_url"
        />
      </div>

      <div>
        <label for="behance_url">Behance</label>
        <input
          type="text"
          name="behance_url"
          id="behance_url"
          v-model.lazy="user.behance_url"
        />
      </div>

      <div>
        <label for="sketchfab_url">Sketchfab</label>
        <input
          type="text"
          name="sketchfab_url"
          id="sketchfab_url"
          v-model.lazy="user.sketchfab_url"
        />
      </div>

      <div>
        <label for="twitter_url">Twitter</label>
        <input
          type="text"
          name="twitter_url"
          id="twitter_url"
          v-model.lazy="user.twitter_url"
        />
      </div>

      <div>
        <label for="youtube_url">YouTube</label>
        <input
          type="text"
          name="youtube_url"
          id="youtube_url"
          v-model.lazy="user.youtube_url"
        />
      </div>

      <div>
        <label for="facebook_url">Facebook</label>
        <input
          type="text"
          name="facebook_url"
          id="facebook_url"
          v-model.lazy="user.facebook_url"
        />
      </div>

      <div>
        <label for="instagram_url">Instagram</label>
        <input
          type="text"
          name="instagram_url"
          id="instagram_url"
          v-model.lazy="user.instagram_url"
        />
      </div>

      <div>
        <label for="discord_url">Discord (ID)</label>
        <input
          type="text"
          name="discord_url"
          id="discord_url"
          v-model.lazy="user.discord_url"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import InputTag from 'vue-input-tag';

export default {
  name: 'UserForm',
  props: ['isAnual'],
  components: { InputTag },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    showPassword({ target }) {
      const password = document.querySelector('#password');

      target.classList.toggle('fa-eye');
      target.classList.toggle('fa-eye-slash');

      if (target.classList[1] == 'fa-eye-slash') password.type = 'text';
      else password.type = 'password';
    },
    formatForm() {
      const form = new FormData();
      for (let key in this.user) {
        form.append(key, JSON.stringify(this.user[key]));
      }
      return form;
    },
    ...mapActions(['updateUser']),
  },
  watch: {
    'user.artstation_url': function (hash) {
      if (hash && hash != '') {
        hash.replace(/@.;/, '');
        if (hash.includes('artstation.com')) {
          const typeOne = hash
            .replace(/http(.*?)\/\//, '')
            .replace('www.', '')
            .match(/com\/(.*)/);
          const typeTwo = hash
            .replace(/http(.*?)\/\//, '')
            .replace('www.', '')
            .match(/(.*).artstation/);

          this.user.artstation_user =
            typeOne && typeOne[1] != '' ? typeOne[1] : typeTwo[1];
        }
      }
    },
    user: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.$store.state.user)) {
          this.updateUser(this.formatForm()).then(res => {
            this.$store.commit('UPDATE_USER', res.data);
          });
        }
      },
      deep: true,
    },
  },
  created() {
    if (this.$store.state.user._id) this.user = { ...this.$store.state.user };
  },
};
</script>

<style scoped>
form {
  column-count: 2;
  position: relative;
}

form h2 {
  margin: 0 10px 20px 0;
  border-bottom: 1px solid var(--text-lighted);
  padding-left: 5px;
}

form > div div {
  display: grid;
  margin: 0 10px 20px 0;
  position: relative;
}

form > div {
  break-inside: avoid;
  margin-bottom: 40px;
  break-after: avoid;
}

form i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}

form input,
form textarea,
.vue-input-tag-wrapper,
.checkbox-wrapper {
  color: var(--text-primary);
  border: 1px solid transparent;
  padding: 8px;
  border-radius: 5px;
  background-color: #42424226;
  margin: 0;
}

form label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 700;
  font-size: 12px;
}

.button {
  position: absolute;
  right: 0;
}

.checkbox-content label {
  font-size: 0.9rem;
}

.checkbox-content {
  margin: 5px !important;
}

.checkbox-wrapper > div:last-of-type {
  margin-bottom: 0 !important;
}

@media (max-width: 824px) {
  form {
    column-count: 1;
  }
}
</style>
