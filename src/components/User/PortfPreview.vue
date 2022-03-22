<template>
  <div class="wrapper" v-if="user">
    <div class="content">
      <span>{{ user.full_name || user.username }}</span>
      <small v-if="user.headline && user.headline != ''">{{ user.headline }}</small>
    </div>
    <Preview
      v-if="user.profile_preview && user.profile_preview.result"
      class="img-preview"
      :width="345"
      :height="160"
      :image="user.profile_preview.result.image"
      :coordinates="user.profile_preview.result.coordinates"
    />
    <slot></slot>
  </div>
</template>

<script>
import { Preview } from 'vue-advanced-cropper';

export default {
  name: 'PortfPreview',
  components: { Preview },
  props: ['user'],
};
</script>

<style scoped>
.wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  width: 345px;
  height: 160px;
  border-radius: 10px;
  cursor: pointer;
  background-color: var(--tertiary);
}

.img-preview {
  width: 100% !important;
  border-radius: 10px;
  margin: auto;
  overflow: hidden;
  position: absolute;
  transition: all 0.3s;
}

.wrapper:hover .img-preview {
  transform: scale(1.2);
}

.content {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  background: linear-gradient(
    135deg,
    #030118 5%,
    rgba(19, 8, 29, 0.65) 35%,
    hsla(0, 0%, 100%, 0) 60%
  );
  padding: 15px;
  display: flex;
  gap: 4px;
  flex-direction: column;
}

.content span {
  font-weight: 700;
  text-transform: capitalize;
}

.content small {
  font-size: 0.7rem;
  max-height: 25px;
  white-space: break-spaces;
  text-transform: uppercase;
  overflow: hidden;
}

@media (max-width: 635px) {
  .wrapper {
    margin: auto;
  }
}

@media (max-width: 365px) {
  .wrapper {
    margin: 0;
    width: 100%;
  }
}
</style>
