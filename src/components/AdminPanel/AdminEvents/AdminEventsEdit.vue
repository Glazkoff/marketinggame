<template>
  <div>
    <h3>Редактирование случайного события #{{ eventId }}</h3>
  </div>
</template>

<script>
export default {
  name: "AdminEventsEdit",
  components: {},
  computed: {
    eventId() {
      return this.$route.params.id;
    }
  }
};
</script>

<style lang="scss" scoped></style>
