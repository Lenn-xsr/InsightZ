<template>
  <main class="login">
    <section>
      <transition mode="out-in" name="list">
        <div class="wrapper" v-if="!register" key="1">
          <div style="max-width: 420px">
            <h1>Acessar Plataforma</h1>
            <p>Acesso apenas para <b>membros</b> da InsightZ Community</p>
          </div>
          <form>
            <div>
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                required
              />
            </div>
            <div>
              <label for="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                required
              />
            </div>
            <small class="forgot-password"
              >Esqueceu a senha?
              <router-link :to="{ name: 'Recovery' }"
                >Clique aqui</router-link
              ></small
            >
            <div class="login-wrapper">
              <button
                class="btn"
                @click.prevent="
                  validity(['#email', '#password'])
                    ? login($event)
                    : sendAlert('Preencha os campos corretamente.')
                "
              >
                Logar
              </button>
              <button
                class="btn"
                @click.prevent="register = true"
                :disabled="$store.state.user._id ? true : false"
              >
                Cadastro
              </button>
            </div>
          </form>
        </div>
        <div class="wrapper" v-else-if="register && !link" key="2">
          <div style="max-width: 420px">
            <h1>Crie a Sua Conta</h1>
            <p>
              Utilize o mesmo email da <b>hotmart</b>, para sabermos que você é
              um de nós!
            </p>
          </div>
          <form>
            <div>
              <label for="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                required
              />
            </div>
            <div>
              <label for="password">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                v-model="password"
                required
              />
            </div>
            <div>
              <label for="confirmPassword">Confirmar senha</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                v-model="confirmPassword"
                required
              />
            </div>
            <button
              class="btn btn-form"
              @click.prevent="
                validity(['#email', '#password', '#confirmPassword'])
                  ? confirmPassword === password
                    ? availability('email', 'link', null, $event)
                    : sendAlert('As senhas devem coincidir')
                  : sendAlert('Preencha os campos corretamente')
              "
            >
              Próximo
            </button>
          </form>
          <button class="btn" @click="register = false">Logar</button>
        </div>
        <div
          v-else-if="register && link && !station_step.show"
          class="artstation wrapper"
          key="3"
        >
          <div>
            <h1>Seu link</h1>
            <p>
              É assim que os usuários vão te encontrar, insira um nome como
              preferir abaixo.
            </p>
            <small class="link"><b>insightz3d.com/</b>{{ username }}</small>
          </div>
          <div class="has-input">
            <input
              type="text"
              name="link"
              id="username"
              placeholder="Ex.: marcos-brito"
              required
              v-model="username"
            />
          </div>
          <button
            class="btn"
            @click.prevent="
              validity(['#username'])
                ? availability('username', 'station_step', 'show', $event)
                : sendAlert('Preencha o campo.')
            "
          >
            Próximo
          </button>
        </div>
        <div
          v-else-if="
            register && link && station_step.show && !station_step.next
          "
          class="artstation wrapper"
          key="4"
        >
          <div>
            <h1>ArtStation</h1>
            <p>
              Importe suas artes e informações diretamente do ArtStation, basta
              inserir o seu usuário abaixo ou o link completo, após isso basta
              clicar em próximo.
            </p>
            <img src="@/assets/artstation_user.png" />
          </div>
          <div class="has-input">
            <input
              type="text"
              name="artstation"
              id="artstation"
              placeholder="Ex.: marcos-brito"
              required
              v-model.lazy="station_step.account"
            />
          </div>
          <button class="btn" @click="create(false)">Finalizar</button>
          <button
            class="btn"
            @click="
              validity(['#artstation'])
                ? getUserArts($event)
                : sendAlert('Preencha o campo.')
            "
          >
            Próximo
          </button>
        </div>
        <div
          v-else-if="
            register &&
            link &&
            station_step.show &&
            station_step.next &&
            artstation.arts[0]
          "
          class="artstation wrapper"
          key="5"
        >
          <div>
            <h1>ArtStation</h1>
            <p>Escolha até 3 artes para deixar em seu Portfolio</p>
            <small>{{ artstation_arts.length }}<b>/3</b></small>
          </div>
          <div class="arts">
            <transition-group name="list" tag="ul" mode="out-in">
              <li v-for="art in artstation.arts" :key="art.hash_id">
                <label>
                  <input
                    type="checkbox"
                    v-model="artstation_arts"
                    :value="art.hash_id"
                    :disabled="
                      artstation_arts.length >= 3 &&
                      !artstation_arts.includes(art.hash_id)
                    "
                  />
                  <div class="selected">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <img :src="art.assets[0].image_url" />
                </label>
              </li>
            </transition-group>
          </div>
          <button
            class="btn"
            @click="artstation_arts.length >= 1 ? create(true) : ''"
          >
            Finalizar
          </button>
        </div>
        <Loading v-else />
      </transition>
      <figure v-if="(register || !register) && !link">
        <img src="@/assets/Community.webp" />
      </figure>
    </section>
  </main>
</template>

<script>
import artstation from "@/mixins/artstation.js";
import alert from "@/mixins/alert.js";
import { mapFields } from "@/helpers.js";
import { api } from "@/services.js";

export default {
  name: "Login",
  mixins: [artstation, alert],
  data() {
    return {
      register: false,
      link: false,
      confirmPassword: null,
      station_step: {
        show: false,
        next: false,
        account: "",
      },
    };
  },
  computed: {
    ...mapFields({
      fields: ["email", "password", "username", "artstation_arts"],
      base: "user",
      mutation: "UPDATE_USER",
    }),
  },
  methods: {
    async availability(input, next, inside, event) {
      const value = document.getElementById(input).value;
      const button = event.target;

      button.innerText = "Validando...";
      button.setAttribute("disabled", "");
      try {
        await api.post("/check", { [input]: value });
        return inside ? (this[next][inside] = true) : (this[next] = true);
      } catch ({
        response: {
          data: { message },
        },
      }) {
        this.sendAlert(message);
      }
      button.innerText = "Próximo";
      button.removeAttribute("disabled");
    },
    async getUserArts(event) {
      const button = event.currentTarget;
      button.innerText = "Validando...";
      button.setAttribute("disabled", "");
      try {
        await this.getArtStationUser(this.station_step.account);
        setTimeout(() => {
          if (!this.artstation.arts[0]) this.create();
          else this.station_step.next = true;

          button.removeAttribute("disabled");
          button.innerText = "Próximo";
        }, 2000);
      } catch (error) {
        button.removeAttribute("disabled");
        button.innerText = "Próximo";
        this.sendAlert("Usuário não encontrado, tente outro");
      }
    },
    async login(event) {
      const button = event.currentTarget;
      button.innerText = "Logando...";
      button.setAttribute("disabled", "");
      try {
        await this.$store.dispatch("signin", this.$store.state.user);
        this.$router.push({ name: "User" });
      } catch ({
        response: {
          data: { message },
        },
      }) {
        button.removeAttribute("disabled");
        button.innerText = "Logar";
        this.sendAlert(message);
      }
    },
    async create(artstation) {
      try {
        if (artstation) {
          const {
            full_name,
            headline,
            city,
            country,
            large_avatar_url,
            artstation_url,
            linkedin_url,
            behance_url,
            sketchfab_url,
            public_email,
            twitter_url,
            youtube_url,
            facebook_url,
            instagram_url,
            website_url,
            portfolio: { summary },
          } = this.artstation.user;

          await this.$store.commit("UPDATE_USER", {
            tags: this.artstation.user.skills[0]
              ? this.artstation.user.skills.map((skill) => skill.name)
              : [],
            softwares: this.artstation.user.software_items[0]
              ? this.artstation.user.software_items.map((soft) => soft.name)
              : [],
            interests: [
              "available_contract",
              "available_freelance",
              "available_full_time",
            ]
              .map((item) => {
                if (this.artstation.user[item])
                  return item.replace("available_", "").replace("_", " ");
              })
              .filter((item) => item),
            full_name,
            headline,
            city,
            country,
            avatar: {
              link: large_avatar_url,
            },
            artstation_url,
            linkedin_url,
            behance_url,
            sketchfab_url,
            public_email,
            twitter_url,
            youtube_url,
            facebook_url,
            instagram_url,
            website_url,
            summary,
            artstation_user: this.station_step.account,
          });
        }

        await this.$store.dispatch("signup", this.$store.state.user);
        await this.$store.dispatch("signin", this.$store.state.user);

        this.$router.push({ name: "User" });
      } catch ({
        response: {
          data: { message },
        },
      }) {
        this.sendAlert(
          message
            ? message
            : "Ocorreu um erro interno, contate um administrador."
        );
      }
    },
  },
  watch: {
    username: function () {
      if (this.username)
        this.username = this.username
          .replace(" ", "-")
          .replace(/[^A-Z-]/gi, "");
    },
    "station_step.account": function (hash) {
      hash.replace(/@.;/, "");
      if (hash.includes("artstation.com")) {
        const typeOne = hash
          .replace(/http(.*?)\/\//, "")
          .replace("www.", "")
          .match(/com\/(.*)/);
        const typeTwo = hash
          .replace(/http(.*?)\/\//, "")
          .replace("www.", "")
          .match(/(.*).artstation/);

        this.station_step.account = typeOne[1] != "" ? typeOne[1] : typeTwo[1];
      }
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
}

.login {
  padding: 0 20px;
  display: grid;
  place-content: center;
  align-self: center;
  margin-top: 70px;
  width: 100%;
}

section {
  background-image: url("../../assets/BackgroundC.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  display: flex;
  place-content: center;
  align-items: center;
  flex-direction: column-reverse;
  width: clamp(300px, 100%, 55vw);
  justify-self: center;
}

section figure > img {
  width: 300px;
}

.wrapper {
  background-color: var(--text-primary);
  color: var(--activated);
  max-height: 80vh;
  min-height: 500px;
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.wrapper p {
  max-width: 80%;
  color: var(--activated);
}

.wrapper > div:first-child {
  padding: 10px;
  text-align: center;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-direction: column;
  margin: 10px auto;
}

.wrapper > button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--text-primary);
  background-color: var(--activated);
}

form {
  display: grid;
  gap: 10px;
  padding: 10px;
}

form div {
  display: grid;
}

.btn-form {
  margin: 15px;
  margin-bottom: 50px;
}

.artstation.wrapper {
  width: calc(100% - 20px);
}

.arts input {
  display: none;
}

.arts label {
  margin: 0;
  padding: 0;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}

.artstation > div:last-of-type {
  max-height: 100%;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
  padding: 10px;
}

.artstation.wrapper ul {
  column-count: 3;
  column-gap: 0;
}

.artstation.wrapper li {
  padding: 5px;
}

.selected {
  position: absolute;
  display: none;
  place-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--lighted);
  transition: all 0.3s;
}

.selected i {
  color: var(--text-primary);
  font-size: 28px;
}

input:checked + .selected {
  display: grid;
}

input:disabled + .selected {
  display: grid;
  background-color: #1c1c1b9e;
}

input:disabled + .selected i {
  display: none;
}

.has-input {
  display: grid;
  place-content: center;
  gap: 15px;
}

.has-input .alert-error {
  margin-top: -15px;
}

.artstation > div > img {
  border-radius: 5px;
}

.artstation .arts {
  min-height: 300px;
}

.login-wrapper {
  display: flex !important;
  justify-content: space-around;
  margin-top: 10px;
}

.login-wrapper .btn {
  width: 45%;
}

.login-wrapper .btn:last-child {
  background-color: var(--lighted-secondary);
}

.artstation .btn:first-of-type {
  position: absolute;
  left: 10px;
  background-color: var(--activated);
}

.forgot-password {
  text-align: center;
}

.forgot-password a {
  color: var(--lighted-secondary);
  font-weight: bold;
}

@media (max-width: 930px) {
  section {
    flex-direction: column;
    width: 95vw;
  }

  .artstation.wrapper ul {
    column-count: 2;
  }
}
</style>