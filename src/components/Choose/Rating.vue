<template>
  <div class="card p-xl-4 p-3">
    <h3 class="mb-1">Рейтинг игроков</h3>
    <div class="">
      <div class="d-flex mt-1 pt-2 pb-2 text-info font-weight-bolder text-center align-items-center">
        <span class="col-6 col-sm-3 col-md-2">Место</span>
        <span class="col-6 col-sm-3 col-md-4">Игрок</span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/1.svg" alt="First"
                                                   title="Первые места"></span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/2.svg" alt="Second" title="Вторые места"></span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/3.svg" alt="Third"
                                                   title="Третьи места"></span>
      </div>
      <div class="d-flex mt-1 pt-2 pb-2 text-center align-items-center"
           v-for="(user, index) in usersRating"
           :key="user.user_id"
           :class="{'border-top mt-2 mt-2': index === 3}"
      >
        <span class="col-6 col-sm-3 col-md-2 font-weight-bolder"
              :style="{color: placeColor[index]}"
        >
          {{ user.id + 1 }}</span>
        <span class="col-6 col-sm-3 col-md-4">{{ user.name }}</span>
        <span class="col-2 d-none d-sm-block"
              v-for="i in 3"
              :key="i"
        >{{ user[i] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";

export default {
  name: "Rating",
  data() {
    return {
      usersRating: [],
      placeColor: ['#e49034', '#639fa7', '#dc314b', '#17a2b8']
    }
  },
  mounted() {
    this.updateRate()
  },
  methods: {
    updateRate() {
      this.$http.get('/api/users/rate')
        .then(res => {
          this.usersRating = (res.data).slice(0, 3)
          let decode = jwt.decode(this.$store.state.token);
          if (decode) {
            res.data.forEach(data => {
              // Если совпадают id и пользователь уже не находится в тройке победителей
              if (data.user_id === decode.id && this.usersRating.findIndex(user => user.user_id === data.user_id) === -1)
                this.usersRating.push(data)
            })
          }
        })
    },
  }
}
</script>

<style scoped>

</style>
