<template>
  <div>
    <h2>Глобальная конфигурация игры</h2>
    <div class="loader-wrap" v-if="loading">
      <Loader></Loader>
    </div>
    <div v-else>
      <!-- {{ config }} -->
      <h6>Конфигурация под редакцией #{{ config.config_id }}</h6>
      <div class="alert alert-dark" role="alert">
        <h4 class="alert-heading">Шанс случайного события</h4>
        <div class="loader-wrap" v-if="chanceEdit.isLoading">
          <Loader></Loader>
        </div>
        <p v-else-if="!chanceEdit.isEdit">
          Текущее значение: {{ config.event_chance }}
        </p>
        <div class="form-group" v-else>
          <label for="exampleInputEmail1">Значение</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            class="form-control"
            v-model="chanceEdit.value"
            aria-describedby="emailHelp"
          />
          <small id="emailHelp" class="form-text text-muted"
            >Значение должно принимать от 0 до 1</small
          >
        </div>
        <hr />
        <p class="mb-0" v-if="!chanceEdit.isLoading">
          <a
            @click.prevent="letChanceEdit()"
            href="#"
            v-if="!chanceEdit.isEdit"
            class="alert-link"
            >Нажмите, чтобы изменить</a
          >
          <a
            @click.prevent="saveChanceEdit()"
            href="#"
            class="alert-link"
            v-else
            >Нажмите, чтобы сохранить</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader";
export default {
  name: "AdminGameConfig",
  data() {
    return {
      loading: false,
      chanceEdit: {
        isEdit: false,
        isLoading: false,
        value: 0
      }
    };
  },
  components: {
    Loader
  },
  methods: {
    loadConfig() {
      let there = this;
      this.loading = true;
      this.$store
        .dispatch("GET_ADMIN_CONFIG")
        .then(res => {
          this.loading = false;
        })
        .catch(function(err) {
          there.$toast.error(err, {
            showProgress: true,
            timeOut: 2000
          });
        });
    },
    letChanceEdit() {
      this.chanceEdit.value = this.config.event_chance;
      this.chanceEdit.isEdit = true;
    },
    saveChanceEdit() {
      let there = this;
      this.chanceEdit.isLoading = true;
      this.$store
        .dispatch("POST_ADMIN_CONFIG", {
          event_chance: this.chanceEdit.value
        })
        .then(res => {
          this.chanceEdit.isLoading = false;
          this.chanceEdit.isEdit = false;
          this.loadConfig();
        })
        .catch(function(err) {
          this.chanceEdit.isLoading = false;
          this.chanceEdit.isEdit = false;

          this.loadConfig();
          there.$toast.error(err, {
            showProgress: true,
            timeOut: 2000
          });
        });
    }
  },
  computed: {
    config: function() {
      return this.$store.state.admin.globalConfig;
    }
  },
  mounted() {
    this.loadConfig();
  }
};
</script>

<style scoped></style>
