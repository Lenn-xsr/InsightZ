<template>
  <div id="app">
    <Header v-if="showIn" />
    <transition mode="out-in">
      <router-view />
    </transition>
    <Footer v-if="showIn && this.$route.name != 'Portfolio'" />
  </div>
</template>
<script>
import Header from '@/components/Basics/Header.vue';
import Footer from '@/components/Basics/Footer.vue';
import { api } from '@/services.js';
import 'vue-advanced-cropper/dist/style.css';

export default {
  components: {
    Header,
    Footer,
  },
  metaInfo() {
    return {
      title: 'InsightZ',
      meta: [
        {
          vmid: 'title',
          name: 'title',
          content: 'InsightZ',
        },
        {
          vmid: 'description',
          name: 'description',
          content:
            'Tudo o que você precisa para aprender 3d para jogos esta aqui, conteúdos exclusivos, aulas semanais, feedbacks, suporte e muito mais para facilitar seu aprendizado na area de 3D.',
        },
        {
          vmid: 'og:url',
          property: 'og:url',
          content: 'https://insightz3d.com.br/',
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: 'InsightZ',
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content:
            'Tudo o que você precisa para aprender 3d para jogos esta aqui, conteúdos exclusivos, aulas semanais, feedbacks, suporte e muito mais para facilitar seu aprendizado na area de 3D.',
        },
        {
          vmid: 'twitter:url',
          property: 'twitter:url',
          content: 'https://insightz3d.com.br/',
        },
        {
          vmid: 'twitter:title',
          property: 'twitter:title',
          content: 'InsightZ',
        },
        {
          vmid: 'twitter:description',
          property: 'twitter:description',
          content:
            'Tudo o que você precisa para aprender 3d para jogos esta aqui, conteúdos exclusivos, aulas semanais, feedbacks, suporte e muito mais para facilitar seu aprendizado na area de 3D.',
        },
      ],
    };
  },
  computed: {
    showIn() {
      return [
        'Home',
        'Courses',
        'Login',
        'User',
        'Edit',
        'Portfolio',
        'Mercado3D',
      ].includes(this.$route.name);
    },
  },
  created() {
    api.get('/auth').then(res => {
      if (res.data._id) {
        this.$store.commit('UPDATE_USER', res.data);
        this.$store.commit('UPDATE_LOGIN', true);
      }
    });
  },
};
</script>

<style>
@font-face {
  font-family: 'Avenir';
  font-style: normal;
  src: url('./assets/fonts/Metropolis-Regular.otf') format('opentype');
}

@font-face {
  font-family: 'Avenir';
  font-style: italic;
  font-weight: normal;
  src: url('./assets/fonts/Metropolis-RegularItalic.otf') format('opentype');
}

@font-face {
  font-family: 'Avenir';
  font-style: normal;
  font-weight: medium;
  src: url('./assets/fonts/Metropolis-Medium.otf') format('opentype');
}

@font-face {
  font-family: 'Avenir';
  font-style: italic;
  font-weight: medium;
  src: url('./assets/fonts/Metropolis-MediumItalic.otf') format('opentype');
}

@font-face {
  font-family: 'Avenir';
  font-style: normal;
  font-weight: bold;
  src: url('./assets/fonts/Metropolis-Bold.otf') format('opentype');
}

@font-face {
  font-family: 'Avenir';
  font-weight: lighter;
  font-style: normal;
  src: url('./assets/fonts/Metropolis-Light.otf') format('opentype');
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  background: var(--text-lighted);
  border: 0px none var(--text-lighted);
  border-radius: 50px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}

::-webkit-scrollbar-thumb:active {
  background: var(--activated);
}

::-webkit-scrollbar-track {
  background: transparent;
  border: 0px none var(--text-lighted);
  border-radius: 50px;
}

::-webkit-scrollbar-track:hover {
  background: var(--activated);
}

::-webkit-scrollbar-track:active {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

* {
  box-sizing: border-box;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

body,
html {
  color: var(--text-primary);
  background: var(--primary);
  font-size: initial;
  line-height: initial;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

::after,
::before {
  box-sizing: content-box;
}

:root {
  --primary: #1c0d2b;
  --secondary: #1e0821;
  --tertiary: #12071d;
  --lighted: rgba(65, 22, 87, 0.5);
  --lighted-secondary: #448ccb;
  --activated: #4d4d44;
  --text-primary: #fff;
  --text-secondary: #242424;
  --text-lighted: #f7ca34;
  --default-shadow: 0 4px 3px 0 rgba(0, 0, 0, 0.4);
}

#app {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.lock-width {
  max-width: 1120px;
}

main {
  flex: 1;
}

body,
ul,
li,
h1,
h2,
p {
  padding: 0px;
  margin: 0px;
  font-weight: revert;
  line-height: normal;
  color: inherit;
}

h2 {
  font-size: 22px;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: var(--text-primary);
}

a:focus,
a:hover {
  text-decoration: none;
}

p {
  color: rgba(204, 204, 204);
  white-space: break-spaces;
}

img {
  display: block;
  max-width: 100%;
}

input,
textarea,
select {
  background-color: var(--text-primary);
  color: var(--text-secondary);
  border: 1px solid #c4c4c4;
  padding: 6.4px;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

.vue-input-tag-wrapper > span {
  background-color: #f7ca34b3 !important;
  border-color: var(--text-lighted) !important;
  color: var(--text-primary) !important;
  width: max-content !important;
}

.vue-input-tag-wrapper .remove {
  color: var(--activated) !important;
}

.vue-input-tag-wrapper .new-tag {
  margin-bottom: 0 !important;
}

.vue-input-tag-wrapper {
  display: flex !important;
}

.btn {
  color: var(--text-primary);
  background-color: #e8810c;
  padding: 10px 30px;
  border-radius: 3px;
}

.btn:hover {
  background-color: #7dc5f3 !important;
  color: var(--text-primary) !important;
}

.colapse-wrapper {
  position: relative;
}

.colapse-content {
  background-color: var(--text-secondary);
  display: grid;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  border-radius: 5px;
  z-index: 11;
  padding: 5px 0;
  margin-top: 5px;
  position: absolute;
  right: 0;
  width: max-content;
}

.colapse-back {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  left: 0;
  top: 0;
}

.colapse-content * {
  font-size: 0.9rem;
  color: #ccc;
  padding: 10px 40px 10px 15px;
  cursor: pointer;
}

.colapse-content *:hover {
  background-color: var(--activated);
  color: var(--text-primary);
}

.alert-error {
  padding: 10px 2px 0;
  text-align: center;
  color: #ff3434;
  transition: all 0.3s;
}

.alert-popup-success,
.alert-popup-error {
  position: fixed;
  bottom: 20px;
  z-index: 9999999;
  background-color: #ffffffd4;
  color: var(--text-secondary);
  padding: 20px 65px;
  border-radius: 5px;
  font-weight: bold;
  transform: translateX(-50%);
  left: 50%;
  -webkit-animation: alert 0.3s;
  animation: alert 0.3s;
  box-shadow: 0 0 5px rgba(36, 36, 36, 0.618);
}

@keyframes alert {
  0% {
    opacity: 0;
    transform: translateX(-50%) translate3d(0, 50px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
}

.alert-popup-success::before {
  content: '\f058';
  color: green;
}

.alert-popup-error::before {
  content: '\f057';
  color: red;
}

.alert-popup-success::before,
.alert-popup-error::before {
  font-size: 1.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 3px;
  width: 25%;
  height: 100%;
  display: grid;
  place-content: center;
}

.mini-icon {
  z-index: 2;
  background-color: var(--text-secondary);
  padding: 8px;
  border-radius: 7px;
  font-size: smaller;
  display: grid;
  place-content: center;
  position: relative;
  cursor: pointer;
}

.icon-grab {
  cursor: grab;
}

.mini-icon:hover {
  background-color: var(--lighted-secondary);
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--activated);
  border-radius: 34px;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 4px;
  border-radius: 50%;
  background-color: var(--text-primary);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--lighted-secondary);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider::before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

.user-avatar .alert-error {
  position: absolute;
  font-weight: bold;
  display: grid;
  place-content: center;
  height: 100%;
  top: 0;
  padding: 5px;
  background-color: #4a46467d;
  border-radius: 5px;
}

.router-link-exact-active,
.router-link:hover,
.router-link:focus {
  color: var(--activated);
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter {
  transform: translate3d(0, -20px, 0);
}

.v-leave {
  transform: translate3d(0, 20px, 0);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translate3d(20px, 0, 0);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}
</style>
