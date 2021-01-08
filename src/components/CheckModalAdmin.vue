<template>
  <div>
    <Modal @close="sendClose()">
      <template v-slot:header>
        <h5>Внимание!</h5>
      </template>
      <template v-slot:body>
        <p>Вы были удалены из комнаты!</p>
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
  name: "CheckModalAdmin",
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
};
</script>

<style scoped>

</style>
