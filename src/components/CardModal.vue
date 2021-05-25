<template>
  <div>
    <Modal @close="sendClose()">
      <template v-slot:header>
        <h5>{{ cardModal.title }}</h5>
      </template>
      <template v-slot:body>
          <p>{{ cardModal.text}}</p>
        <div
            v-for="(mounth, count) in cardModal.data_change"
            :key="count"
          >
          <p> {{mounth.when}} месяц {{ mounth.operation }}{{ mounth.change }}  {{mounth.param}}</p>
        </div>
        <span>Эта карточка </span>
        <span v-if="cardModal.oneOff">одноразовая, это значит, что её можно купить только один раз. Все её эффекты начинают применяться со следующего месяца после покупки.</span>
        <span v-else>многоразовая, это значит, что для ее полного применения нужно купить ее три хода подряд. Если использовать на двух ходах две карточки, а на третий ход - нет, эффект будет только для первых двух месяцев. Отслеживать количество купленных карточек Вы можете в окне "Длительные события"</span>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-success" @click="sendClose()">
          Хорошо
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  name: "CardModal",
  props: ["cardModal"],
  components: {
    Modal
  },
  created() {
    this.cardModal.data_change.sort((prev, next) => prev.when - next.when)
  },
  methods: {
    sendClose() {
      this.isLoading = false;
      this.isError = false;
      this.isSuccess = false;
      this.$emit("close");
    }
  }
};
</script>

<style scoped></style>
