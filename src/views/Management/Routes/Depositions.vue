<template>
  <section class="depositions" v-if="depositions">
    <DepositionEdit :deposition="depositionPre" />
    <button class="newDeposition" @click="newDeposition()">Adicionar Depoimento</button>
    <draggable
      v-model="depositions"
      group="depositions"
      class="depositions-wrapper lock-width"
    >
      <div
        v-for="deposition in depositions"
        :key="deposition._id"
        class="deposition-wrapper"
      >
        <div class="edits">
          <span class="mini-icon icon-grab"><i class="fas fa-hand-paper"></i></span>
          <span class="mini-icon icon-edit" @click="editDeposition(deposition)"
            ><i class="fas fa-pencil-alt"></i
          ></span>
          <span class="mini-icon icon-remove" @click="removeDeposition(deposition)"
            ><i class="fas fa-trash"></i
          ></span>
        </div>
        <Deposition :deposition="deposition" />
      </div>
    </draggable>
  </section>
  <Loading v-else />
</template>

<script>
import Deposition from '@/components/Home/Deposition.vue';
import DepositionEdit from '@/components/Management/DepositionEdit.vue';

import draggable from 'vuedraggable';

import { api } from '@/services.js';
import { mapActions } from 'vuex';

export default {
  name: 'Depositions',
  components: { Deposition, DepositionEdit, draggable },
  data() {
    return {
      depositionPre: null,
    };
  },
  computed: {
    depositions: {
      get() {
        return this.$store.state.depositions;
      },
      set(value) {
        this.managementUpdate({ payload: value, route: 'DEPOSITIONS' });
      },
    },
  },
  methods: {
    removeDeposition(deposition) {
      if (window.confirm(`Deseja deletar o depoimento "${deposition.title}"?`)) {
        api.delete('/management/depositions', deposition).then(response => {
          this.managementUpdate({
            payload: response.data,
            route: 'DEPOSITIONS',
          });
        });
      }
    },
    editDeposition(deposition) {
      this.depositionPre = {
        deposition,
        preview: true,
      };
    },
    newDeposition() {
      this.depositionPre = {
        deposition: null,
        preview: true,
        _id: this.depositions.length + 1,
      };
    },
    ...mapActions(['managementGet', 'managementUpdate']),
  },
  created() {
    this.managementGet({ route: 'DEPOSITIONS' });
  },
};
</script>

<style scoped>
.depositions-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  margin: auto;
  width: auto;
  gap: 0;
}

.deposition-wrapper {
  max-width: 300px;
  position: relative;
  height: min-content;
  margin: 0 5px 10px;
  break-inside: avoid;
  overflow: hidden;
  border-radius: 5px;
}

.deposition-wrapper .deposition {
  margin: 0;
}

.newDeposition {
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
  .deposition-wrapper,
  .deposition {
    max-width: 100%;
  }

  .depositions {
    column-count: 1;
  }
}
</style>
