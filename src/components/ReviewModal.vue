<template>
  <div>
    <Modal @close="sendClose()">
      <template v-slot:header>
        <h5>Оставьте отзыв!</h5>
      </template>
      <template v-slot:body v-if="isSuccess">
        <h1 class="text-success">Спасибо! :)</h1>
        <p>
          Мы получили от вас обратную связь и обязательно учтём ваше мнение!
        </p>
      </template>
      <template v-slot:body v-else-if="isError">
        <h1 class="text-danger">Что-то пошло не так :(</h1>
        <p>
          Ваш отзыв нам нужен, но пока мы не можем его получить от вас.
          Попробуйте повторить
        </p>
      </template>
      <template v-slot:body v-else>
        <div class="form-group">
          <label class="mb-0">Оценка</label>
          <div class="rating mb-2">
            <span
              v-for="i in 5"
              :key="i"
              @click="onRatingSet(6 - i)"
              :class="{
                'checked-star': review.rating >= 6 - i,
                'loading-star': isLoading
              }"
              >☆</span
            >
          </div>
          <label for="reviewText">Ваш комментарий</label>
          <textarea
            class="form-control"
            id="reviewText"
            rows="3"
            placeholder="Комментарий об игре"
            :disabled="isLoading"
            v-model="review.comment"
          >
          </textarea>
          <small id="emailHelp" class="form-text text-muted"
            >Помогите нам стать лучше!</small
          >
        </div>
      </template>
      <template v-slot:footer v-if="isSuccess">
        <button type="button" class="btn btn-success" @click="sendClose()">
          Закрыть
        </button>
      </template>
      <template v-slot:footer v-else-if="isError">
        <button type="button" class="btn btn-danger" @click="trySend()">
          Попробовать снова
        </button>
      </template>
      <template v-slot:footer v-else>
        <button class="btn btn-primary" type="button" v-if="isLoading" disabled>
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Отправляется
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="onSendReview()"
          v-else
        >
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
      isLoading: false,
      isError: false,
      isSuccess: false,
      review: {
        comment: "",
        rating: 0
      }
    };
  },
  methods: {
    trySend() {
      this.isError = false;
      this.isSuccess = false;
      this.onSendReview();
    },
    sendClose() {
      this.isLoading = false;
      this.isError = false;
      this.isSuccess = false;
      this.$emit("close");
    },
    onRatingSet(i) {
      if (!this.isLoading) {
        this.review.rating = i;
      }
    },
    onSendReview() {
      this.isLoading = true;
      this.review.room_id = this.$store.state.roomId;
      this.$store.dispatch("POST_REVIEW", this.review).then(
        res => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        err => {
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
.rating > .loading-star:before {
  color: rgb(207, 185, 56) !important;
}
</style>
