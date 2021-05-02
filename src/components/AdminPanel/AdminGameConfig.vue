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
        <p v-if="!chanceEdit.isEdit">
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
        <p class="mb-0">
          <a
            @click.prevent="letChanceEdit()"
            href="#"
            v-if="!chanceEdit.isEdit"
            class="alert-link"
            >Нажмите, чтобы изменить</a
          >
          <a
            @click.prevent="saveEdit()"
            href="#"
            class="alert-link"
            v-else
            >Нажмите, чтобы сохранить</a
          >
        </p>
      </div>
      <div class="alert alert-dark" role="alert">
        <h4 class="alert-heading">Управление отображением элементов главного меню</h4>
          <div class="form-group">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="subscription_check" v-model="config.display_subscriptions">
            <label class="form-check-label" for="subscription_check">Данные о подписке</label>
          </div>
          <a
            @click.prevent="saveEdit()"
            href="#"
            class="alert-link"
            >Нажмите, чтобы сохранить</a
          >
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
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
    saveEdit() {
      let there = this;
      this.$store
        .dispatch("POST_ADMIN_CONFIG", {
          event_chance: this.chanceEdit.value,
          display_subscriptions: this.config.display_subscriptions
        })
        .then(res => {
          this.chanceEdit.isEdit = false;
          this.loadConfig();
        })
        .catch(function(err) {
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
