import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMeta from "vue-meta";

import Loading from "@/components/Basics/Loading.vue";

Vue.use(VueMeta);
Vue.component("Loading", Loading);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
