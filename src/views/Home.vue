<template>
  <div class="home">
    <entrance msg="213"></entrance>
  </div>
</template>

<script>
// @ is an alias to /src
import Entrance from "@/components/Entrance.vue";
import Choose from "@/components/Choose.vue";

export default {
  name: "Home",
  components: {
    Entrance,
    Choose
  }
};
</script>
