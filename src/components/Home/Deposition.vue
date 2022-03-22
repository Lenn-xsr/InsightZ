<template>
  <div class="deposition">
    <img
      :src="deposition.image.link"
      :alt="deposition.title"
      v-if="deposition.image.link && deposition.image.link != ''"
    />
    <div>
      <div
        :style="
          deposition.image.link && deposition.image.link != ''
            ? { 'margin-left': '65px' }
            : ''
        "
      >
        <span class="title">{{ deposition.title }}</span>
        <a
          :href="deposition.portfolio"
          target="_blank"
          v-if="deposition.portfolio"
          class="link"
          >Portfólio</a
        >
      </div>
      <div class="d-text">
        <p>{{ deposition.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Deposition',
  props: ['deposition'],
};
</script>

<style scoped>
.deposition {
  break-inside: avoid;
  margin: 15px 10px;
  position: relative;
  max-width: 80%;
  min-width: 300px;
  height: max-content;
}

.deposition img {
  width: 90px;
  max-height: 90px;
  border-radius: 100%;
  position: relative;
  bottom: -45px;
  z-index: 1;
  left: 20px;
  border: 2px solid var(--text-lighted);
}

.deposition > div {
  position: relative;
  background-color: var(--lighted);
  padding: 10px;
  text-align: center;
  min-height: 280px;
}

.deposition a {
  text-transform: uppercase;
  font-size: 0.8rem;
  padding-bottom: 10px;
  display: block;
}

.deposition a:hover {
  color: var(--activated);
}

.deposition p {
  font-size: 15px;
  margin-top: 8px;
}

.d-text {
  white-space: break-spaces;
  overflow-y: scroll;
  text-overflow: ellipsis;
  scrollbar-width: thin;
  scrollbar-color: var(--text-lighted) transparent;
  height: 200px;
  margin-top: 5px;
}

.title {
  font-weight: bold;
  display: block;
  font-size: 17px;
  color: var(--text-lighted);
  padding-bottom: 10px;
}
</style>
