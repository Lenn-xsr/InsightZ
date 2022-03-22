<template>
  <main class="user" v-if="user._id">
    <div class="sidenav">
      <div>
        <div class="user-avatar">
          <Loading v-if="imageLoading" class="imageLoading" />
          <img
            :src="
              user.avatar && user.avatar.link
                ? user.avatar.link
                : require('@/assets/default_avatar.webp')
            "
            class="preview-image"
          />
          <input
            id="avatar"
            name="avatar"
            type="file"
            ref="avatar"
            @change="preview"
            accept="image/*"
            style="display: none"
          />
          <label for="avatar" class="label-upload"
            ><i class="far fa-edit cp-icon"></i
          ></label>
        </div>
        <span>{{ user.full_name || "Seja bem vindo!" }}</span>
        <small>{{
          user.headline || 'Atualize suas informações em "Conta"'
        }}</small>
      </div>
      <ul>
        <li>
          <router-link :to="{ name: 'User' }"
            ><i class="fas fa-briefcase"></i> Trabalhos</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'Edit' }"
            ><i class="fas fa-cog"></i> Conta</router-link
          >
        </li>
        <li>
          <button @click="logOut"><i class="fas fa-power-off"></i> Sair</button>
        </li>
      </ul>
    </div>
    <transition mode="out-in">
      <router-view :isAnual="isAnual"></router-view>
    </transition>
  </main>
  <Loading v-else />
</template>

<script>
import { mapState } from "vuex";
import alert from "@/mixins/alert.js";

export default {
  name: "user",
  mixins: [alert],
  data() {
    return {
      imageLoading: false,
    };
  },
  computed: {
    isAnual() {
      return this.anualTags.includes(this.user.plan);
    },
    ...mapState(["user", "login", "anualTags"]),
  },
  methods: {
    logOut() {
      if (window.confirm("Deseja sair?")) {
        this.$store.dispatch("logOut");
        this.$router.push({ name: "Login" });
      }
    },
    updateAvatar() {
      this.imageLoading = true;
      const form = new FormData();
      const file = this.$refs.avatar.files;

      if (file[0]) form.append(file[0].name, file[0]);

      this.$store.dispatch("updateUser", form).then((res) => {
        this.imageLoading = false;
        this.$store.commit("UPDATE_USER", res.data);
      });
    },
    preview() {
      const reader = new FileReader();
      const preview = document.querySelector(".preview-image");
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(this.$refs.avatar.files[0]);

      if (preview.naturalHeight >= 725 || preview.naturalWidth >= 725) {
        this.sendAlert("A imagem não pode ultrapassar 724x724", true);
        setTimeout(() => {
          if (this.user.large_avatar_url)
            preview.src = this.user.large_avatar_url;
        }, 10000);
      } else this.updateAvatar();
    },
  },
  mounted() {
    setTimeout(() => {
      if (!this.user._id) this.$router.push({ name: "Login" });
    }, 2000);
  },
};
</script>

<style scoped>
.user {
  display: grid;
  grid-template-columns: minmax(140px, 200px) 1fr;
  margin: 70px 0;
  grid-gap: 30px;
  padding: 20px;
}

.sidenav {
  background-color: var(--tertiary);
  border-radius: 6px;
  box-shadow: var(--default-shadow);
  max-height: calc(100vh - 115px);
  min-height: 500px;
  overflow: hidden;
}

.sidenav a,
.sidenav button {
  padding: 5px;
  font-size: 15px;
  background: transparent;
  display: block;
}

.sidenav a.router-link-exact-active,
.sidenav a:hover,
.sidenav button:hover {
  color: var(--text-primary);
  background-color: var(--lighted);
}

.sidenav button {
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  margin-bottom: 15px;
}

.sidenav i {
  font-size: small;
  padding: 15px;
  border-right: 1px solid var(--primary);
  margin-right: 15px;
}

.sidenav > div {
  display: grid;
  text-align: center;
  gap: 13px;
  align-items: center;
  justify-items: center;
  padding: 25px 5px;
  border-bottom: 1px solid var(--primary);
  margin: 0 15px;
  margin-bottom: 25px;
}

.sidenav > div span {
  font-weight: bold;
  word-break: break-all;
}

.sidenav > div small {
  font-size: small;
}

.preview-image {
  border-radius: 5px;
  width: 100%;
  max-height: 200px;
  max-width: 200px;
}

.user-avatar {
  position: relative;
}

.label-upload {
  position: absolute;
  right: 0;
  bottom: 0;
}

.label-upload i {
  font-size: 1.3rem;
  padding: 5px;
  border: none;
  margin: 0;
  cursor: pointer;
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
  border-radius: 5px;
}

@media screen and (max-width: 500px) {
  .user {
    grid-template-columns: 1fr;
    margin-bottom: 0;
  }

  .sidenav {
    height: min-content;
    min-height: inherit;
  }
}
</style>