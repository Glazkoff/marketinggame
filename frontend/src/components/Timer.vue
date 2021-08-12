<template>
  <div>
    <div class="text-center" v-if="currentTime">
      До окончания пробного периода осталось
      <span v-if="hours">{{ hours | formatTime }}:</span><span>{{ minutes | formatTime }}:{{
        seconds | formatTime
      }}</span><br/>
    </div>
    <div class="text-center" v-if="!currentTime">
      Время истекло!
    </div>
  </div>
</template>

<script>
export default {
  name: "Timer",
  props: {
    deadline: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 1000,
    },
    isSubscribed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentTime: null,
      timeIsUp: false,
    };
  },
  created() {
    this.countdown()
    // setTimeout(this.countdown, 1000);
  },
  computed: {
    seconds() {
      return Math.floor((this.currentTime / 1000) % 60);
    },
    minutes() {
      return Math.floor((this.currentTime / 1000 / 60) % 60);
    },
    hours() {
      return Math.floor((this.currentTime / (1000 * 60 * 60)) % 24);
    },
    days() {
      return Math.floor(this.currentTime / (1000 * 60 * 60 * 24));
    },
  },
  filters: {
    formatTime(value) {
      if (value < 10) {
        return "0" + value;
      }
      return value;
    }
  },
  methods: {
    countdown() {
      this.currentTime = this.deadline - Date.parse(new Date());
      if (this.currentTime > 0) {
        setTimeout(this.countdown, this.speed);
      } else {
        this.currentTime = null;
        this.$emit('timeisup', !this.timeIsUp)
      }
    }
  },
}
</script>

<style scoped>

</style>
