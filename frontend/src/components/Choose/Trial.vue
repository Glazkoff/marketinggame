<template>
  <div class="gotTrial">
    <Modal @close="sendClose()">
      <template v-slot:header>
        <h5>Пробный период</h5>
      </template>
      <template v-slot:body>
        <Timer v-bind:deadline="Date.parse(new Date()) +21600000"></Timer>
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
import Timer from "@/components/Timer";

export default {
  name: "Trial",
  components: {
    Modal, Timer
  },
  props: {
    isSubscribed: {
      type: Boolean,
      default: false
    }
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
