<template>
  <div
    class="preview"
    v-if="preview && faq._id != 'default' && faq"
    @click="closePreview"
  >
    <div class="faq">
      <i class="far fa-times-circle close-icon" @click="closePreview"></i>
      <small>Titulo</small>
      <input
        type="text"
        name="title"
        v-model.lazy="faq.title"
        :placeholder="faq.title || 'Titulo'"
      />
      <div class="d-text">
        <small>Descrição</small>
        <textarea
          v-model.lazy="faq.description"
          :placeholder="faq.description || 'Descrição'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

let faqBase = {
  _id: 'default',
  title: null,
  description: null,
};

export default {
  name: 'FaqEdit',
  props: ['faqp'],
  data() {
    return {
      faq: { ...faqBase },
      preview: false,
      contentHeight: 'inherit',
      temp: {
        lesson: null,
        requeriment: null,
        software: null,
      },
    };
  },
  methods: {
    addIn(where, key) {
      if (!this.faq[where].includes(this.temp[key]) && this.temp[key])
        this.faq[where].push(this.temp[key]);
    },
    removeIn(where, key) {
      this.faq[where] = this.faq[where].filter(value => value != key);
    },
    closePreview({ target, currentTarget }) {
      if (target === currentTarget) {
        this.preview = false;
        this.faq = { ...faqBase };
        document.body.style.overflow = '';
      }
    },
    ...mapActions(['managementUpdateOne']),
  },
  watch: {
    faqp({ faq, preview, _id }) {
      if (faq) this.faq = { ...faq };
      else if (_id && !faq) {
        let newFaq = { ...faqBase };
        newFaq._id = _id;
        this.faq = newFaq;
      }

      this.preview = preview;
      document.body.style.overflow = 'hidden';
      if (preview) {
        setTimeout(() => {
          const height = document.querySelector('.content');
          this.contentHeight = height ? height.clientHeight + 'px' : 'inherit';
        }, 100);
      }
    },
    faq: {
      handler(newObject, oldObject) {
        if (oldObject._id === newObject._id && newObject._id != 'default')
          this.managementUpdateOne({ payload: newObject, route: 'FAQ' });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.preview {
  position: fixed;
  left: 0;
  top: 0;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  background-color: #4d4d44b0;
  z-index: 10000;
  overflow-y: scroll;
  scrollbar-color: var(--text-lighted) transparent;
  scrollbar-width: thin;
}

.preview input,
.preview textarea {
  background-color: transparent;
  color: var(--text-primary);
  border: 0;
  width: 100%;
}

.preview textarea {
  min-height: 120px;
}

.preview small {
  color: var(--text-lighted);
}

.close-icon {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 22px;
  cursor: pointer;
}

.close-icon:hover {
  color: var(--activated);
}

.faq {
  padding: 15px;
  background-color: var(--secondary);
  border-radius: 2px;
  position: relative;
  max-width: 80%;
  min-width: 300px;
  height: 300px;
  margin: auto;
  width: 90vw;
}

.faq a {
  float: right;
  position: absolute;
  right: 28px;
  top: 26px;
  text-transform: uppercase;
  font-size: 12px;
}

.faq a:hover {
  color: var(--activated);
}

.faq p {
  font-size: 15px;
  padding-right: 5px;
}

.d-text {
  white-space: break-spaces;
  overflow-y: scroll;
  text-overflow: ellipsis;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
  height: 215px;
  margin-top: 5px;
}

.title {
  font-weight: bold;
  padding: 10px 0;
  display: block;
  font-size: 17px;
  color: var(--text-lighted);
}
</style>
