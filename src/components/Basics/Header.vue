<template>
  <header>
    <nav>
      <router-link class="logo" to="/">
        <img src="@/assets/Logo.webp" alt="InsightZ" />
      </router-link>
      <div>
        <router-link class="router-link" to="/">Home</router-link>
        <router-link class="router-link" to="/cursos">Cursos</router-link>
        <router-link class="router-link" to="/mercado3d">Mercado 3D</router-link>
        <router-link class="router-link user" to="/user" v-if="$store.state.login">
          {{ name }}
        </router-link>
        <router-link class="router-link" to="/login" v-else>Login</router-link>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    name() {
      return this.$store.state.user.full_name
        ? this.$store.state.user.full_name.split(' ')[0]
        : 'Conta';
    },
  },
};
</script>

<style scoped>
header {
  position: fixed;
  z-index: 9999;
  width: 100%;
  background-color: var(--primary);
  left: 0;
  top: 0;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 28px;
}

nav div {
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

nav > div a {
  margin: 0 8px;
}

.logo {
  padding: 10px 0;
}

.logo img {
  width: 130px;
  margin-left: 25%;
}

.user {
  color: var(--text-lighted) !important;
}

@media (max-width: 480px) {
  nav {
    padding: 0px 14px;
    min-height: 70px;
  }

  .logo img {
    display: none;
  }
}
</style>
