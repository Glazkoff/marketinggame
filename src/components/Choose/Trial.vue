<template>
  <div class="gotTrial">
    <Modal @close="sendClose()">
      <template v-slot:header>
        <h5>Пробный период</h5>
      </template>
      <template v-slot:body>
        <h1 class="text-success">Тут будет таймер до окончания пробного периода</h1>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-success" @click="sendClose()">
          Закрыть
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  name: "Trial",
  components: {
    Modal
  },
  methods: {
    sendClose() {
      this.isLoading = false;
      this.isError = false;
      this.isSuccess = false;
      this.$emit("close");
    }
  }
}
</script>

<style scoped>

</style>
