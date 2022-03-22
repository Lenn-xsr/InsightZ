<template>
  <section class="faqs" v-if="faqs">
    <FaqEdit :faqp="faqPre" />
    <button class="newFaq" @click="newFaq()">Adicionar Faq</button>
    <draggable v-model="faqs" group="faqs" class="faqs-wrapper lock-width">
      <div v-for="faq in faqs" :key="faq._id" class="faq-wrapper">
        <div class="edits">
          <span class="mini-icon icon-grab"><i class="fas fa-hand-paper"></i></span>
          <span class="mini-icon icon-edit" @click="editFaq(faq)"
            ><i class="fas fa-pencil-alt"></i
          ></span>
          <span class="mini-icon icon-remove" @click="removeFaq(faq)"
            ><i class="fas fa-trash"></i
          ></span>
        </div>
        <div class="faq-content">
          <span>{{ faq.title }}</span>
          <p>{{ faq.description }}</p>
        </div>
      </div>
    </draggable>
  </section>
  <Loading v-else />
</template>

<script>
import FaqEdit from '@/components/Management/FaqEdit.vue';

import draggable from 'vuedraggable';

import { api } from '@/services.js';
import { mapActions } from 'vuex';

export default {
  name: 'Faqs',
  components: { FaqEdit, draggable },
  data() {
    return {
      faqPre: null,
    };
  },
  computed: {
    faqs: {
      get() {
        return this.$store.state.faqs;
      },
      set(value) {
        this.managementUpdate({ payload: value, route: 'FAQS' });
      },
    },
  },
  methods: {
    removeFaq(faq) {
      if (window.confirm(`Deseja deletar a faq "${faq.title}"?`)) {
        api.delete('/management/faqs', { _id: faq._id }).then(response => {
          this.managementUpdate({
            payload: response.data,
            route: 'FAQS',
          });
        });
      }
    },
    editFaq(faq) {
      this.faqPre = {
        faq,
        preview: true,
      };
    },
    newFaq() {
      this.faqPre = {
        faq: null,
        preview: true,
        _id: this.faqs.length + 1,
      };
    },
    ...mapActions(['managementGet', 'managementUpdate']),
  },
  created() {
    this.managementGet({ route: 'FAQS' });
  },
};
</script>

<style scoped>
.faqs-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  margin: auto;
  width: auto;
  gap: 0;
}

.faq-wrapper {
  position: relative;
  height: min-content;
  margin: 0 5px 10px;
  break-inside: avoid;
  overflow: hidden;
  border-radius: 5px;
  background-color: var(--secondary);
  padding: 12px;
  min-height: 125px;
  width: clamp(200px, 100%, 600px);
}

.faq-content {
  display: grid;
  gap: 10px;
  width: 95%;
}

.faq-content span {
  color: var(--text-lighted);
  font-size: 1rem;
}

.newFaq {
  padding: 8px 15px;
  margin: 5px 10px 20px;
  color: var(--text-primary);
  background-color: var(--lighted-secondary);
  border: 0;
  border-radius: 5px;
}

.edits {
  position: absolute;
  right: 5px;
  top: 5px;
  display: grid;
  gap: 7px;
}

.icon-grab {
  cursor: grab;
}

.icon-edit:hover {
  background-color: var(--text-lighted);
}

.icon-remove:hover {
  background-color: #ff3434;
}

@media screen and (max-width: 852px) {
  .faq-wrapper,
  .faq {
    max-width: 100%;
  }

  .faqs {
    column-count: 1;
  }
}
</style>
