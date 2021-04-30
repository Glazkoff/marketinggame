<template>
  <div class="card p-xl-4 p-3">
    <h3 class="mb-1">Рейтинг игроков</h3>
      <div class="d-flex mt-1 pt-2 pb-2 text-info font-weight-bolder text-center align-items-center">
        <span class="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-2">№</span>
        <span class="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-4">Игрок</span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/medals/1.svg" alt="First"
                                                   title="Первые места"></span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/medals/2.svg" alt="Second" title="Вторые места"></span>
        <span class="col-2 d-none d-sm-block"><img width="32px" src="@/assets/medals/3.svg" alt="Third"
                                                   title="Третьи места"></span>
      </div>
      <div class="d-flex mt-1 pt-1 pb-1 text-center align-items-center border-top"
           v-for="(user, index) in usersRating"
           :key="user.user_id"
      >
          <span class="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-2 font-weight-bolder"
                :style="{color: placeColor[index]}"
          >
            {{ user.id + 1 }}</span>
          <span class="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-4">
            {{ user.name }}
            <small v-show="userId === user.user_id"
                   class="text-secondary">(вы)</small>
          </span>
          <span class="col-2 d-none d-sm-block"
                v-for="i in 3"
                :key="i"
          >{{ user[i] }}</span>
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
      userId: -1,
      placeColor: ['#e49034', '#639fa7', '#dc314b']
    }
  },
  mounted() {
    this.updateRate()
  },
  methods: {
    updateRate() {
      this.$http.get('/api/users/rate')
        .then(res => {
          this.usersRating = (res.data).slice(0, 10)
          let decode = jwt.decode(this.$store.state.token);
          if (decode) {
            this.userId = decode.id
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
