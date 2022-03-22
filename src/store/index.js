import Vue from "vue";
import Vuex from "vuex";
import { api } from "@/services.js";
import { concat } from "@/helpers.js";

Vue.use(Vuex);
const baseUser = {
  _id: null,
  email: "",
  password: "",
  summary: null,
  username: null,
  artstation_arts: [],
  completed_lessons: [],
  artstation_user: null,
  profile_preview: null,
  full_name: null,
  headline: null,
  city: null,
  country: null,
  tags: [],
  interests: [],
  softwares: [],
  avatar: null,
  artstation_url: null,
  linkedin_url: null,
  behance_url: null,
  sketchfab_url: null,
  public_email: null,
  twitter_url: null,
  youtube_url: null,
  facebook_url: null,
  instagram_url: null,
  website_url: null,
  discord_url: null,
  plan: null,
  visible: true,
};

export default new Vuex.Store({
  strict: true,
  state: {
    login: false,
    anualTags: [
      "Community-Anual",
      "InsightZ Community",
      "597",
      "InsightZ Community - Base",
    ],
    user: JSON.parse(JSON.stringify(baseUser)),
    courses: null,
    depositions: null,
    faqs: null,
    allowed: null,
  },
  mutations: {
    UPDATE_LOGIN(state, payload) {
      state.login = payload;
    },
    UPDATE_USER(state, payload) {
      state.user = concat(state.user, payload);
    },
    MANAGEMENT_SET(state, { payload, key }) {
      state[key] = payload;
    },
    MANAGEMENT_UPDATE(state, { payload, key }) {
      const index = state[key].findIndex((obj) => obj._id === payload._id);
      if (index >= 0) {
        state[key][index] = concat(state[key][index], payload);
      } else state[key].push(payload);
    },
  },
  actions: {
    getUser(context, payload) {
      return api.get(`/user/${payload}`);
    },
    updateUser(context, payload) {
      return api.put("/user", payload);
    },
    signin(context, payload) {
      return api.post("/signin", payload).then((response) => {
        context.commit("UPDATE_USER", response.data);
        context.commit("UPDATE_LOGIN", true);
      });
    },
    signup(context, payload) {
      return api.post("/signup", payload).then((response) => {
        context.commit("UPDATE_USER", response.data);
        context.commit("UPDATE_LOGIN", true);
      });
    },
    logOut(context) {
      api.post("/logout");
      context.commit("UPDATE_USER", baseUser);
      context.commit("UPDATE_LOGIN", false);
    },
    localGet(context, { route }) {
      return api.get(`/${route.toLowerCase()}`).then((r) => {
        context.commit(`MANAGEMENT_SET`, {
          payload: r.data,
          key: route.toLowerCase(),
        });
      });
    },

    // Management Actions
    managementGet(context, { route }) {
      return api.get(`/management/${route.toLowerCase()}`).then((r) => {
        context.commit(`MANAGEMENT_SET`, {
          payload: r.data,
          key: route.toLowerCase(),
        });
      });
    },
    managementUpdate(context, { payload, route }) {
      return api
        .put(`/management/${route.toLowerCase()}`, payload)
        .then((r) => {
          context.commit(`MANAGEMENT_SET`, {
            payload: r.data,
            key: route.toLowerCase(),
          });
        });
    },
    managementUpdateOne(context, { payload, route }) {
      return api
        .put(`/management/${route.toLowerCase()}s`, payload)
        .then((r) => {
          context.commit(`MANAGEMENT_UPDATE`, {
            payload: r.data,
            key: `${route.toLowerCase()}s`,
          });
        });
    },
  },
});
