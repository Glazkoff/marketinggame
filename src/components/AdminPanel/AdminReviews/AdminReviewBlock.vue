<template>
  <div
    class="alert alert-secondary"
    :class="{ 'bg-light': isDeleteLoading }"
    role="alert"
  >
    <button
      type="button"
      class="close"
      aria-label="Close"
      @click="onReviewDelete(review.review_id)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    <small>Отзыв #{{ review.review_id }}</small>
    <h5 class="alert-heading">
      <span class="text-info">{{ review.user.name }}</span>
      <span v-if="review.room_id !== -1">
        в комнате <span class="text-info">#{{ review.room_id }}</span></span
      >
    </h5>
    <p class="mb-0">
      <em>{{ review.comment }}</em>
    </p>
    <div class="rating mb-2">
      <span v-for="i in 5 - review.rating" :key="'checked' + i">☆</span>
      <span
        v-for="i in review.rating"
        :key="'unchecked' + i"
        class="checked-star"
        >☆</span
      >
    </div>
    <hr />
    <p class="mb-0">
      {{ review.updatedAt | formatDate }}
    </p>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "AdminReviewBlock",
  data() {
    return {
      isDeleteLoading: false
    };
  },
  props: ["review"],
  filters: {
    formatDate: function(date) {
      if (date) {
        moment.locale("ru");
        return moment(String(date)).format("llll");
      }
    }
  },
  methods: {
    onReviewDelete(reviewId) {
      this.isDeleteLoading = true;
      this.$store.dispatch("DELETE_ADMIN_REVIEW", this.review.review_id).then(
        res => {
          this.isDeleteLoading = false;
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style scoped>
.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
  user-select: none;
}
.rating > span {
  display: inline-block;
  position: relative;
  width: 1.5rem;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.checked-star:before {
  content: "\2605" !important;
  position: absolute;
  left: 0;
  color: gold;
  transform: scale(1.1);
}
.rating > .loading-star:before {
  color: rgb(207, 185, 56) !important;
}
</style>
