<template>
  <section>
    <div>
      <h2>Suas informações</h2>
    </div>
    <UserForm :isAnual="isAnual" />
  </section>
</template>

<script>
import UserForm from '@/components/User/UserForm.vue';

export default {
  name: 'Edit',
  props: ['isAnual'],
  components: {
    UserForm,
  },
};
</script>
<style scoped>
section > div:first-child {
  max-width: 90%;
  margin-bottom: 30px;
}
</style>
