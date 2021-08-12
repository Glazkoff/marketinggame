<template>
  <div>
    <!-- Modal -->
    <div class="modal-backdrop fade show"></div>
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header"></slot>
            <button type="button" class="close" @click="emitClose()">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  methods: {
    emitClose() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.modal {
  overflow-y: auto;
}
</style>
