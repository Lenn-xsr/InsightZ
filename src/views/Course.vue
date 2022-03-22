<template>
  <main class="courses" v-if="courses && course">
    <Sidebar :course="course" :cid="cid" :planCheck="planCheck" />
    <transition mode="out-in">
      <Preview v-if="!lid && cid" :course="course" :planCheck="planCheck" />
      <Video
        v-else-if="lid && cid"
        :modules="course.modules"
        :lid="lid"
        :cid="cid"
        :course="course"
      />
    </transition>
  </main>
  <Loading v-else />
</template>

<script>
import { mapState, mapActions } from "vuex";
import Sidebar from "@/components/Course/Sidebar.vue";
import Preview from "@/components/Course/Preview.vue";
import Video from "@/components/Course/Video.vue";
import course from "@/mixins/course.js";

export default {
  name: "Course",
  props: ["cid", "lid"],
  mixins: [course],
  components: {
    Sidebar,
    Preview,
    Video,
  },
  data() {
    return {
      category: null,
    };
  },
  computed: {
    planCheck() {
      return this.user._id
        ? this.course.plan && this.course.plan.toLowerCase() == "anual"
          ? this.user.plan
            ? this.anualTags.includes(this.user.plan)
            : false
          : true
        : false;
    },
    ...mapState(["user", "anualTags"]),
  },
  methods: {
    ...mapActions(["localGet"]),
  },
  async created() {
    if (!this.courses) await this.localGet({ route: "COURSES" });
    this.getCourse();
  },
};
</script>

<style scoped>
.courses {
  display: flex;
}

.courses section {
  flex: 1;
  margin-left: 3rem;
  margin-bottom: 1.875rem;
  position: relative;
  color: var(--text-primary);
  padding: 1rem 1.875rem 1.875rem;
  display: flex;
  align-content: center;
  flex-direction: column;
}
</style>