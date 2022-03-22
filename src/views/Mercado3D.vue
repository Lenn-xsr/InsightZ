<template>
  <main class="portfolios">
    <section class="top-content">
      <h1>Encontre o <span>Artista 3D</span> ideal para seu projeto!</h1>
      <div>
        <label for="search">Busca</label>
        <input type="text" v-model="search" placeholder="3D, Props.." id="search" />
      </div>
    </section>
    <section class="portf-wrapper">
      <transition-group name="list" tag="ul" mode="out-in" v-if="portfolios">
        <li
          v-for="user in portMatch"
          :key="user.username"
          @click="showPortf(user.username)"
        >
          <PortfPreview :user="user" />
        </li>
      </transition-group>
      <Loading v-else />
      <div v-if="portfolios && portMatch.length == 0" class="no-result">
        <p>
          Não foi possivel encontrar nenhum resultado para sua busca, tente com uma
          palavra-chave diferente.
        </p>
      </div>
    </section>
  </main>
</template>

<script>
import { api } from '@/services.js';
import PortfPreview from '@/components/User/PortfPreview.vue';

export default {
  name: 'Mercado3D',
  components: { PortfPreview },
  data() {
    return {
      portfolios: null,
      perPage: 25,
      currentPage: 0,
      currentList: [],
      search: '',
    };
  },
  computed: {
    getPageUsers() {
      const newList = [...this.portfolios];
      const offset =
        this.currentPage > 0 ? this.perPage * this.currentPage : this.currentPage;
      const range =
        this.currentPage > 0 ? this.perPage * (this.currentPage + 1) - 1 : this.perPage;

      return [
        ...newList.slice(
          offset >= newList.length ? newList.length - this.currentList.length : offset,
          range
        ),
      ];
    },
    portMatch() {
      return this.portfolios && this.search && this.search != ''
        ? this.portfolios.filter(
            ({ tags, full_name, username }) =>
              !this.search
                .split(' ')
                .map(m => {
                  return [...tags, full_name, username.replace('-', ' ')]
                    .filter(v => v)
                    .map(v => v.match(new RegExp(m, 'i')))
                    .filter(v => v?.length);
                })
                .map(v => v.length)
                .includes(0)
          )
        : this.currentList;
    },
    pagesTotal() {
      const total = this.portfolios.length / this.perPage;
      return total !== Infinity ? Math.ceil(total) : 0;
    },
  },
  methods: {
    showPortf(username) {
      this.$router.push({
        name: 'Portfolio',
        params: { id: username },
      });
    },
    getNextUsers() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;

        if (
          bottomOfWindow &&
          this.currentPage < this.pagesTotal + 1 &&
          this.currentList.length < this.portfolios.length
        ) {
          this.currentPage++;
          this.currentList = [...new Set([...this.currentList, ...this.getPageUsers])];
        }
      };
    },
    getUsers() {
      api.get('/users').then(res => {
        this.portfolios = res.data;
        this.currentList = [...this.currentList, ...this.getPageUsers];
        this.getNextUsers();
      });
    },
  },
  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
main {
  margin-top: 70px;
}

.top-content {
  border-bottom: 2px solid var(--text-lighted);
  width: 100%;
  display: flex;
  padding: 20px 5rem;
  margin-bottom: 40px;
  justify-content: space-between;
}

.top-content label {
  margin: 10px 0;
  display: block;
}

.top-content h1 {
  max-width: 420px;
  font-size: 2rem;
}

.top-content h1 > span {
  color: var(--text-lighted);
}

.portf-wrapper ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.no-result p {
  text-align: center;
}

@media (max-width: 635px) {
  .top-content {
    flex-direction: column;
    padding: 20px 2rem;
  }

  .top-content > div {
    margin-top: 30px;
  }

  .top-content input {
    width: 100%;
  }

  .portf-wrapper {
    width: 100%;
    padding: 15px;
  }

  .portf-wrapper ul {
    flex-direction: column;
    align-items: normal;
  }
}
</style>
