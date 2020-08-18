<template>
  <div>
    <Modal>
      <template v-slot:header>
        <h5>Оставьте отзыв!</h5>
      </template>
      <template v-slot:body>
        <div class="form-group">
          <label class="mb-0">Оценка</label>
          <div class="rating mb-2">
            <span
              v-for="i in 5"
              :key="i"
              @click="onRatingSet(6 - i)"
              :class="{ 'checked-star': review.rating >= 6 - i }"
              >☆</span
            >
          </div>
          <label for="reviewText">Ваш комментарий</label>
          <textarea
            class="form-control"
            id="reviewText"
            rows="3"
            placeholder="Комментарий об игре"
          >
          </textarea>
          <small id="emailHelp" class="form-text text-muted"
            >Помогите нам стать лучше!</small
          >
        </div>
      </template>
      <template v-slot:footer>
        <button class="btn btn-primary" type="button" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Отправляется
        </button>
        <button type="button" class="btn btn-primary" @click="onSendReview()">
          Отправить
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  name: "ReviewModal",
  components: {
    Modal
  },
  data() {
    return {
      review: {
        text: "",
        rating: 0
      }
    };
  },
  methods: {
    onRatingSet(i) {
      this.review.rating = i;
    },
    onSendReview() {}
  }
};
</script>

<style scoped>
.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
  user-select: none;
  cursor: pointer;
}
.rating > span {
  display: inline-block;
  position: relative;
  width: 2rem;
  font-size: 2rem;
}
.rating > span:hover:before,
.rating > span:hover ~ span:before,
.checked-star:before {
  content: "\2605" !important;
  position: absolute;
  left: 0;
  color: gold;
  transform: scale(1.1);
}
</style>
