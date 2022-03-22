<template>
  <div
    class="preview"
    v-if="preview && depoimento._id != 'default' && depoimento"
    @click="closePreview"
  >
    <div class="deposition-image">
      <Loading v-if="imageLoading" class="imageLoading" />
      <img :src="depoimento.image.link" class="preview-image" />
      <input
        id="deposition"
        name="deposition"
        type="file"
        ref="deposition"
        @change="previewImage"
        accept="image/*"
        style="display: none"
      />
      <label for="deposition" class="label-upload"
        ><i class="far fa-edit cp-icon"></i
      ></label>
    </div>
    <div class="deposition">
      <i class="far fa-times-circle close-icon" @click="closePreview"></i>
      <small>Usuário</small>
      <input
        type="text"
        name="title"
        v-model.lazy="depoimento.title"
        :placeholder="depoimento.title || 'Usuário'"
      />
      <small>Portfolio URL</small>
      <input
        type="text"
        name="title"
        v-model.lazy="depoimento.portfolio"
        :placeholder="depoimento.portfolio || 'Portfolio URL'"
      />
      <div class="d-text">
        <small>Depoimento</small>
        <textarea
          v-model.lazy="depoimento.description"
          :placeholder="depoimento.description || 'Depoimento'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/services.js';
import { mapActions } from 'vuex';

let depositionBase = {
  _id: 'default',
  title: null,
  portfolio: null,
  description: null,
};

export default {
  name: 'DepositionEdit',
  props: ['deposition'],
  data() {
    return {
      depoimento: { ...depositionBase },
      imageLoading: false,
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
    closePreview({ target, currentTarget }) {
      if (target === currentTarget) {
        this.preview = false;
        this.depoimento = { ...depositionBase };
        document.body.style.overflow = '';
      }
    },
    async updateImage() {
      this.imageLoading = true;
      const form = new FormData();
      const file = this.$refs.deposition.files;

      if (file[0]) form.append(file[0].name, file[0]);

      form.append('_id', this.depoimento._id);
      form.append('type', 'Depositions');
      form.append('field', 'image');

      api.post('/management/image', form).then(response => {
        this.imageLoading = false;
        this.managementUpdateOne({
          payload: response.data,
          route: 'DEPOSITION',
        });
      });
    },
    previewImage() {
      const reader = new FileReader();
      const preview = document.querySelector('.preview-image');
      reader.onload = function (e) {
        preview.src = e.target.result;
      };
      reader.readAsDataURL(this.$refs.deposition.files[0]);

      this.updateImage();
    },
    ...mapActions(['managementUpdateOne']),
  },
  watch: {
    deposition({ deposition, preview, _id }) {
      if (deposition) this.depoimento = { ...deposition };
      else if (_id && !deposition) {
        let newDeposition = { ...depositionBase };
        newDeposition._id = _id;
        this.depoimento = newDeposition;
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
    depoimento: {
      handler(newObject, oldObject) {
        if (oldObject._id === newObject._id && newObject._id != 'default')
          this.managementUpdateOne({ payload: newObject, route: 'DEPOSITION' });
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

.deposition {
  padding: 15px;
  background-color: var(--secondary);
  border-radius: 2px;
  position: relative;
  max-width: 80%;
  min-width: 300px;
  margin: auto;
  min-height: 300px;
}

.deposition a {
  float: right;
  position: absolute;
  right: 28px;
  top: 26px;
  text-transform: uppercase;
  font-size: 12px;
}

.deposition a:hover {
  color: var(--activated);
}

.deposition p {
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

.deposition-image {
  float: right;
  position: relative;
  width: 125px;
  height: 125px;
  margin: auto;
  bottom: -20px;
  z-index: 2;
}

.deposition-image img {
  width: inherit;
  height: inherit;
  background-color: var(--lighted);
  border-radius: 5px;
}

.label-upload {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 22px;
  padding: 10px;
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
  border-radius: 10px;
}
</style>
