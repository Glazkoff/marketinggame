/* eslint-disable no-undef */
<template>
  <div>
    <h2>Отзывы об игре</h2>
    <hr />
    <div class="loader-wrap" v-if="reviewsLoading">
      <Loader></Loader>
    </div>
    <div v-else>
      <AdminReviewBlock
        v-for="(review, index) in reviews"
        :key="index"
        :review="review"
      ></AdminReviewBlock>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import AdminReviewBlock from "@/components/AdminPanel/AdminReviews/AdminReviewBlock.vue";
export default {
  name: "AdminReviews",
  components: {
    Loader,
    AdminReviewBlock
  },
  data() {
    return {
      reviewsLoading: false
    };
  },
  computed: {
    reviews() {
      return this.$store.state.admin.reviews;
    }
  },
  mounted() {
    this.reviewsLoading = true;
    this.$store.dispatch("GET_ADMIN_REVIEWS").then(
      res => {
        this.reviewsLoading = false;
      },
      () => {
        this.reviewsLoading = false;
      }
    );
  }
};
</script>

<style scoped></style>
