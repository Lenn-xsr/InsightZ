<template>
  <div class="popup" @click="closePopup">
    <div class="popup-wrapper">
      <i class="fas fa-times-circle close-popup" @click="closePopup"></i>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: ['closePopup'],
};
</script>

<style scoped>
.popup {
  position: fixed;
  z-index: 9999999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  background-color: rgba(39, 38, 39, 0.39);
}

.popup-wrapper {
  background-color: var(--text-primary);
  padding: 35px 10px 10px 10px;
  border-radius: 5px;
  position: relative;
}

.close-popup {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.close-popup:hover {
  color: var(--lighted);
}

@media screen and (max-width: 920px) {
  .popup {
    padding: 5px;
  }
}
</style>
