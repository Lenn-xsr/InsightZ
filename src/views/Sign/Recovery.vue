<template>
  <main class="recovery">
    <section>
      <transition mode="out-in" name="list">
        <div class="wrapper" v-if="!nextStep" key="1">
          <div style="max-width: 420px">
            <h1>Resetar a senha</h1>
            <p>
              Insira o e-mail associado à sua conta e enviaremos um e-mail com
              instruções para redefinir sua senha
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
            <div class="recovery-wrapper">
              <button
                class="btn"
                @click.prevent="
                  validity(['#email'])
                    ? sendInstructions()
                    : sendAlert('Preencha os campos corretamente.')
                "
              >
                Enviar instruções
              </button>
            </div>
          </form>
        </div>
        <div class="wrapper finish-recovery" v-else-if="nextStep" key="2">
          <div style="max-width: 420px">
            <div>
              <h1>Verifique o seu email</h1>
              <p>
                Enviamos instruções de recuperação de senha para o seu e-mail.
              </p>
            </div>
            <small>
              Não recebeu o email? Verifique seu filtro de spam ou
              <a @click="nextStep = false">tente outro endereço de e-mail</a>
            </small>
          </div>
        </div>

        <Loading v-else />
      </transition>
      <figure>
        <img src="@/assets/Community.webp" />
      </figure>
    </section>
  </main>
</template>

<script>
import alert from "@/mixins/alert.js";
import { api } from "@/services.js";

export default {
  name: "Recovery",
  mixins: [alert],
  data() {
    return {
      email: null,
      nextStep: false,
    };
  },
  methods: {
    async sendInstructions() {
      try {
        await api
          .post("/recovery/instructions", { email: this.email })
          .then(() => {
            this.nextStep = true;
          });
      } catch ({
        response: {
          data: { message },
        },
      }) {
        this.sendAlert(message);
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

.recovery {
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

.recovery-wrapper {
  display: flex !important;
  justify-content: space-around;
  margin-top: 10px;
}

.recovery-wrapper .btn {
  width: 45%;
}

.recovery-wrapper .btn:last-child {
  background-color: var(--lighted-secondary);
}

.finish-recovery > div {
  height: 100%;
  display: grid;
  position: relative;
  place-content: center;
}

.finish-recovery p {
  margin: 0 auto;
  margin-top: 20px;
}

.finish-recovery small {
  position: absolute;
  bottom: 10px;
}

.finish-recovery small a {
  color: var(--lighted-secondary);
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 930px) {
  section {
    flex-direction: column;
    width: 95vw;
  }
}
</style>