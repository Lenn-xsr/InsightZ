<template>
  <div class="course">
    <div class="course-image">
      <div
        class="locked"
        v-if="course.plan && course.plan.toLowerCase() == 'anual' && !unlock"
      >
        <div>
          <i class="fas fa-lock"></i>
          <small>Este curso é exclusivo para assinantes do community anual.</small>
        </div>
      </div>
      <img
        :src="
          course.image && course.image.link
            ? course.image.link
            : require('@/assets/BackgroundC.jpeg')
        "
        :alt="course.title"
      />
    </div>
    <div class="course-infos">
      <span>{{ course.title }}</span>
      <p>{{ course.subtitle }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course',
  props: ['course', 'unlock'],
};
</script>

<style scoped>
.course {
  position: relative;
  border-radius: 8px;
  margin: 0 10px 20px;
  padding-bottom: 10px;
  background-color: var(--lighted);
  -moz-column-break-inside: avoid;
  break-inside: avoid;
  transition: all 0.2s;
  cursor: pointer;
}

.course:hover {
  transform: scale(1.04);
}

.course-image {
  overflow: hidden;
  position: relative;
  border-radius: 8px 8px 0 0;
}

.course-infos {
  padding: 13px;
}

.course-infos span {
  font-size: 14px;
  font-weight: bold;
}

.course-infos p {
  color: #9f9f9f;
  margin-top: 10px;
  font-size: smaller;
}

.locked {
  position: absolute;
  display: grid;
  text-align: center;
  place-items: center;
  height: 100%;
  width: 100%;
  background-color: #4d4d4491;
}

.locked div {
  text-align: center;
  display: grid;
  gap: 8px;
  max-width: 90%;
}
</style>
