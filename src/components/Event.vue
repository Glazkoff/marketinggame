<template>
  <div class="event-box w-100 h-100 container">
    <div class="w-100 h-100">
      <div class="row align-items-center h-100">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h4 class="text-center">
                <strong>Cобытие!</strong>
                {{ event.title }}
              </h4>
              <hr />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 col-sm-12 event-img">
              <div
                class="gray-block"
                :class="`block-event-img-${event.id}`"
              ></div>
            </div>
            <div class="col-md-6 col-sm-12 container">
              <div class="row align-items-center h-100">
                <div class="d-block col-12 text-center h-auto m-0">
                  {{ event.description }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <hr />
            </div>
          </div>
          <div class="row">
            <div class="col-md-8 offset-md-2 col-sm-12 ">
              <button class="d-block btn btn-primary w-100" @click="closeEvent">
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Event",
  props: ["event"],
  methods: {
    closeEvent() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.event-img {
  min-height: 12rem;
}
.event-box {
  max-width: unset;
}
.gray-block {
  border-radius: 8px;
}
.block-event-img-1 {
  background: url("../assets/events_img/1.svg") no-repeat 50% 50%;
}
.block-event-img-2 {
  background: url("../assets/events_img/2.svg") no-repeat 50% 50%;
}
.block-event-img-3 {
  background: url("../assets/events_img/3.svg") no-repeat 50% 50%;
}
.block-event-img-4 {
  background: url("../assets/events_img/4.svg") no-repeat 50% 50%;
}
.block-event-img-5 {
  background: url("../assets/events_img/5.svg") no-repeat 50% 50%;
}
</style>
