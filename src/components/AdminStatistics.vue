<template>
  <div>
    <h2>Статистика</h2>
    <p><em>*Чуть позже здесь будет статистика*</em></p>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader";

export default {
  name: "AdminStatistics",
  data() {
    return {
      loading: false
    };
  },
  components: {
    Loader
  }
};
</script>

<style lang="scss" scoped></style>
