import Popup from "@/components/Basics/Popup.vue";

export default {
  data() {
    return {
      showPopup: false,
      popupTo: 0,
    };
  },
  components: { Popup },
  methods: {
    closePopup({ target, currentTarget }) {
      if (target === currentTarget) this.showPopup = false;
    },
  },
};
