<template>
  <main class="reset">
    <section>
      <div class="wrapper" v-if="authorized" key="2">
        <div style="max-width: 420px">
          <h1>Crie uma nova senha</h1>
          <p>
            Sua nova senha deve ser diferente das senhas usadas anteriormente.
          </p>
        </div>
        <form>
          <div>
            <label for="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              v-model.lazy="password"
            />
            <i class="fas fa-eye" @click="showPassword"></i>
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
              validity(['#password', '#confirmPassword'])
                ? confirmPassword === password
                  ? checkAndReset()
                  : sendAlert('As senhas devem coincidir')
                : sendAlert('Preencha os campos corretamente')
            "
          >
            Resetar Senha
          </button>
        </form>
      </div>
      <Loading v-else />
      <figure>
        <img src="@/assets/Community.webp" />
      </figure>
    </section>
  </main>
</template>

<script>
import alert from "@/mixins/alert.js";
import { api } from "@/services.js";
import { mapActions } from "vuex";

export default {
  name: "Reset",
  mixins: [alert],
  data() {
    return {
      authorized: false,
      password: null,
      confirmPassword: null,
    };
  },
  methods: {
    async checkMha(mha) {
      try {
        await api.post("/recovery", { mha }).then((response) => {
          this.$store.commit("UPDATE_USER", response.data);
          this.authorized = true;
        });
      } catch {
        this.$router.push({ name: "Login" });
      }
    },
    async checkAndReset() {
      if (this.password === this.$store.state.user.password)
        return this.sendAlert("A senha deve ser diferente da anterior.");

      await this.$store.dispatch("signin", this.$store.state.user);
      await this.$store.commit("UPDATE_USER", { password: this.password });
      await this.updateUser(this.$store.state.user);

      this.$router.push({ name: "User" });
    },
    showPassword({ target }) {
      const password = document.querySelector("#password");

      target.classList.toggle("fa-eye");
      target.classList.toggle("fa-eye-slash");

      if (target.classList[1] == "fa-eye-slash") password.type = "text";
      else password.type = "password";
    },
    ...mapActions(["updateUser"]),
  },
  created() {
    // Mail Hash Authorization

    const mha = this.$route.query.mha;
    if (!mha) this.$router.push({ name: "Login" });
    else this.checkMha(mha);
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
}

.reset {
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

.reset i {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}

.reset form > div:first-child {
  position: relative;
}

.reset form > div:first-child > input {
  position: relative;
  padding-right: 35px;
}

@media (max-width: 930px) {
  section {
    flex-direction: column;
    width: 95vw;
  }
}
</style>