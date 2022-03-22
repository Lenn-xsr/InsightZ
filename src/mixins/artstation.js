import { api } from "@/services.js";

export default {
  data() {
    return {
      artstation: {
        arts: [],
        art: null,
        user: null,
        art_preview: {
          show: false,
          assets: null,
          art: null,
        },
      },
    };
  },
  computed: {
    art_assets() {
      const assets = [];
      if (this.artstation.art) {
        this.artstation.art.assets.forEach((asset) => {
          assets.push({
            image_url: asset.has_embedded_player
              ? [
                  ...asset.player_embedded
                    .replaceAll("'", '"')
                    .matchAll(/src="(.*?)"/g),
                ][0][1].replace(/\?(.*?)/g, "?autoplay=1&muted=0&loop=1&")
              : asset.image_url,
            height: asset.height,
            width: asset.width,
            id: asset.id,
            has_embed: asset.has_embedded_player ? true : false,
            preview_image: asset.has_embedded_player ? asset.image_url : null,
          });
        });
        assets.sort((asset) => asset.width >= 1000);
      }
      return assets;
    },
    arts() {
      return this.artstation.arts;
    },
  },
  methods: {
    getArtInfo(hashes) {
      hashes.forEach(async (hash) => {
        await api.post("/artstation/project", { hash }).then((r) => {
          delete r.data.user;
          this.artstation.arts.push(r.data);
        });
        if (!this.artstation.art_preview.assets) {
          const assets = this.art_assets;
          this.artstation.art_preview.assets = assets;
          this.artstation.art_preview.art = assets[0];
        }
      });
    },
    getArtStationArts(id) {
      return api.post("/artstation/projects", { hash: id }).then((r) => {
        r.data.data.forEach(async (art) => {
          await api
            .post("/artstation/project", { hash: art.hash_id })
            .then((r) => {
              delete r.data.user;
              this.artstation.arts.push(r.data);
            });
          if (!this.artstation.art_preview.assets) {
            const assets = this.art_assets;
            this.artstation.art_preview.assets = assets;
            this.artstation.art_preview.art = assets[0];
          }
        });
      });
    },
    getArtStationUser(id) {
      return api.post("/artstation/user", { hash: id }).then((r) => {
        this.getArtStationArts(id);
        r.data.headline = r.data.headline.replace(/&amp;/g, "&");
        this.artstation.user = r.data;
      });
    },
  },
  watch: {
    arts: {
      handler() {
        if (!this.artstation.art) {
          this.artstation.art = {
            ...this.artstation.arts[0],
          };
        }
      },
      deep: true,
    },
  },
};
