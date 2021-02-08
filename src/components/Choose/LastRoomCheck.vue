<template>
  <div>
    <div class="d-flex justify-content-center mt-3 mb-3" v-if="checkLoading">
      <div class="spinner-border" role="status"></div>
    </div>
    <div class="alert alert-warning mt-3" role="alert" v-else-if="isInRoom">
      Вы уже состоите в комнате #<strong>{{ roomId }}</strong
      >. <br />
      <a href="#" class="alert-link" @click.prevent="goOutFromRoom"
        >Нажмите, чтобы выйти из комнаты</a
      >.
    </div>
    <div
      class="alert alert-success mt-3"
      role="alert"
      v-else-if="lastRoomEmpty"
    >
      Вы <strong>не состоите</strong> ни в одной комнате.
    </div>
  </div>
</template>

<script>
export default {
  name: "LastRoomCheck",
  data() {
    return {
      checkLoading: true,
      isInRoom: false,
      lastRoomEmpty: false,
      roomId: 0
    };
  },
  methods: {
    // Получаем данные о последней комнате
    async getLastRoom() {
      this.checkLoading = true;
      try {
        let result = await this.$store.dispatch("GET_LAST_ROOM");
        console.log(result);
        if (result.last_room === null) {
          this.lastRoomEmpty = true;
        } else {
          this.roomId = result.last_room;
          this.isInRoom = true;
        }
        this.checkLoading = false;
      } catch (error) {
        console.log(error);
        this.checkLoading = false;
      }
    },

    // Посылаем запрос о выходе из последней комнаты
    async goOutFromRoom() {
      this.checkLoading = true;
      try {
        await this.$store.dispatch("POST_GO_OUT_LAST_ROOM");
        this.isInRoom = false;
        this.lastRoomEmpty = true;
        this.checkLoading = false;
      } catch (error) {
        console.log(error);
        this.checkLoading = false;
      }
    }
  },
  async mounted() {
    await this.getLastRoom();
  }
};
</script>

<style scoped></style>
