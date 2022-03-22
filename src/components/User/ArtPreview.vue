<template>
  <div class="image" v-if="art_preview.art">
    <div class="art" v-if="art_preview.preview">
      <img :src="art_preview.preview.image_url" v-if="!art_preview.preview.has_embed" />
      <iframe
        :src="art_preview.preview.image_url"
        frameborder="0"
        allow="autoplay; fullscreen; autoplay"
        allowfullscreen
        autoplay
        v-else
      ></iframe>
    </div>

    <div v-else-if="!art_preview.art" class="no-content">
      <h2>Sem conteúdo</h2>
    </div>

    <transition-group
      tag="ul"
      mode="out-in"
      name="list"
      class="art-list"
      v-if="art_preview.art && art_assets[0]"
    >
      <li
        v-for="asset in art_assets"
        :key="asset.id"
        :style="
          asset.image_url == art_preview.preview.image_url
            ? { border: '2px solid var(--text-lighted)' }
            : ''
        "
      >
        <img
          :src="asset.preview_image ? asset.preview_image : asset.image_url"
          @click="changeImage"
          :data-id="asset.id"
        />
      </li>
    </transition-group>
  </div>
  <Loading v-else />
</template>

<script>
export default {
  name: 'ArtPreview',
  props: ['art'],
  data() {
    return {
      art_preview: {
        art: null,
        preview: null,
      },
    };
  },
  computed: {
    art_assets() {
      const assets = [];
      this.art_preview.art.assets.forEach(asset => {
        assets.push({
          image_url: asset.has_embedded_player
            ? [
                ...asset.player_embedded.replaceAll("'", '"').matchAll(/src="(.*?)"/g),
              ][0][1].replace(/\?(.*?)/g, '?autoplay=1&muted=0&loop=1&')
            : asset.image_url,
          id: asset.id,
          has_embed: asset.has_embedded_player ? true : false,
          preview_image: asset.has_embedded_player ? asset.image_url : null,
        });
      });
      return assets;
    },
  },
  methods: {
    changeImage({ target }) {
      this.art_preview.preview = this.art_assets.find(
        asset => asset.id == target.dataset.id
      );
    },
  },
  created() {
    this.art_preview.art = this.art;
    this.art_preview.preview = this.art_assets[0];
  },
  watch: {
    art() {
      this.art_preview.art = this.art;
      this.art_preview.preview = this.art_assets[0];
    },
  },
};
</script>
<style scoped>
.image {
  flex: 1;
  padding: 0 0 10px 10px;
  display: flex;
  position: relative;
  justify-content: space-between;
}

.art {
  height: 100%;
  width: 100%;
  position: relative;
}

.art img,
.art iframe {
  height: clamp(200px, 100%, 100%);
  width: 100%;
  object-fit: contain;
  object-position: center;
}

.art-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%;
  width: 200px;
  min-width: 200px;
  scrollbar-color: var(--text-lighted) transparent;
  scrollbar-width: thin;
}

.art-list li {
  margin: 5px;
  cursor: pointer;
}

.art-list li:hover {
  border: 2px solid var(--text-lighted);
}

@media screen and (max-width: 864px) {
  .image {
    flex-direction: column-reverse;
    padding: 0;
    justify-content: flex-end;
    height: max-content;
  }

  .art {
    height: calc(100% - 130px);
  }

  .art-list {
    flex-direction: row;
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    max-width: calc(100vw - 20px);
    height: max-content;
  }

  .art-list li {
    display: flex;
    min-width: clamp(150px, 15%, 25%);
    flex-wrap: wrap;
    overflow: hidden;
    justify-content: center;
    align-content: center;
    height: 100px;
  }
}
</style>
