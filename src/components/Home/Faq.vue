<template>
  <section class="faq">
    <h2>Confiamos em nosso <span>conteúdo</span>!</h2>
    <img src="@/assets/7Days.webp" />
    <p>Faça o teste, se em até 7 dias você não gostar, devolveremos seu dinheiro!</p>
    <div class="faq-wrapper lock-width">
      <h2>Perguntas frequentes</h2>
      <input
        type="text"
        name="search"
        id="search"
        v-model="search"
        placeholder="Buscar..."
      />
      <transition mode="out-in">
        <transition-group
          tag="div"
          name="list"
          class="panel-group"
          id="accordion"
          v-if="faqs && faqMatch.length"
          key="0"
        >
          <div class="panel" v-for="(faq, key) in faqMatch" :key="faq.title">
            <div class="panel-heading">
              <a
                data-toggle="collapse"
                data-parent="#accordion"
                :href="'#collapse' + key"
              >
                {{ faq.title }}
                <i class="far fa-window-minimize"></i>
              </a>
            </div>
            <div :id="'collapse' + key" class="panel-collapse collapse">
              <p class="panel-body">{{ faq.description }}</p>
            </div>
          </div>
        </transition-group>
        <div v-else-if="faqs && faqMatch.length === 0" class="no-result">
          <p>
            Não foi possivel encontrar nenhum resultado para sua busca, tente com uma
            palavra-chave diferente.
          </p>
        </div>
        <Loading key="loading" v-else />
      </transition>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Faq',
  data() {
    return {
      search: '',
    };
  },
  computed: {
    faqMatch() {
      return this.faqs.filter(faq =>
        faq.title.toLowerCase().match(this.search.toLowerCase())
      );
    },
    ...mapState(['faqs']),
  },
  methods: {
    ...mapActions(['managementGet']),
  },
  created() {
    if (!this.faqs) this.managementGet({ route: 'FAQS' });
  },
};
</script>

<style scoped>
.faq {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  padding-bottom: 0;
}

.faq > p:first-of-type {
  text-align: center;
  max-width: 90%;
}

.faq img {
  width: 17rem;
}

h2 {
  text-align: center;
}

h2 span {
  color: var(--text-lighted);
}

.faq-wrapper {
  width: 90%;
  padding-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.panel {
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--activated);
  border-radius: 0;
  margin-bottom: 20px;
  transition: all 0.3s;
}

a:focus,
a:hover {
  color: var(--text-lighted);
  text-decoration: none;
}

a {
  font-weight: bold;
}

.no-result p {
  text-align: center;
  font-size: 18px;
}

.fa-window-minimize {
  float: right;
}

.panel-body {
  white-space: break-spaces;
}

.panel-group {
  margin-bottom: 0;
  min-width: 90%;
  max-width: 90%;
}

.panel-heading a {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#search {
  color: var(--text-primary);
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--text-primary);
  width: 60%;
  padding: 7px;
  margin-top: 10px;
}
</style>
