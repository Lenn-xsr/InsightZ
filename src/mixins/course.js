import { mapState } from "vuex";
import { normalizeString } from "@/helpers.js";

export default {
  data() {
    return {
      course: null,
      category: null,
    };
  },
  computed: {
    ...mapState(["courses"]),
  },
  methods: {
    getCourse() {
      const categoryIndex = this.cid.split("-")[0];
      const courseTitle = this.cid.replace(`${categoryIndex}-`, "");
      const category = this.courses[Number(categoryIndex)];

      if (!category) return this.$router.push({ path: "/cursos" });

      const course = category.courses.find(
        (cs) => normalizeString(cs.title) == courseTitle
      );

      if (!course) return this.$router.push({ path: "/cursos" });

      this.category = JSON.parse(JSON.stringify(category));
      this.course = JSON.parse(JSON.stringify(course));
    },
  },
};
