<template>
  <Modal @close="onClosePaymentModal()">
    <template v-slot:header>
      <h5>{{ paymentModalData.status === 200 ? 'Оплата прошла успешно!' : 'Произошла ошибка!' }}</h5>
    </template>
    <template v-slot:body>
      <p>{{ paymentModalData.status === 200 ? 'Поздравляем с приобретением подписки!' : paymentModalData.message }}</p>
      <div v-show="paymentModalData.status === 200">
        <hr>
        <h5 class="mb-3">Информация о произведенной покупке:</h5>
        <p><b>Тарифный план</b>:
          {{
            (subscriptionData.tariff.id !== -1) ? subscriptionData.tariff.title : 'тариф не выбран в рамках тестирования'
          }}
        </p>
        <p><b>Поддомен</b>:
          {{
            subscriptionData.subdomain !== '' ? subscriptionData.subdomain : 'поддомен не выбран в рамках тестирования'
          }}
        </p>
        <p><b>Почта</b>:
          {{ subscriptionData.email !== '' ? subscriptionData.email : 'почта не выбрана в рамках тестирования' }}</p>
      </div>
    </template>
    <template v-if="paymentModalData.status === 200" v-slot:footer>
      <button type="button" class="btn btn-success" @click="onClosePaymentModal()">
        Спасибо!
      </button>
    </template>
    <template v-else v-slot:footer>
      <button type="button" class="btn btn-danger" @click="onClosePaymentModal()">
        Отмена
      </button>
      <button type="button" class="btn btn-secondary" @click="onTryAgain()">
        Попробовать снова
      </button>
    </template>
  </Modal>
</template>

<script>

import Modal from "@/components/Modal.vue";

export default {
  name: "PaymentModal",
  props: ['paymentModalData', 'subscriptionData'],
  components: {
    Modal
  },
  methods: {
    onClosePaymentModal() {
      this.$router.push("/choose");
    },
    onTryAgain() {
      this.$emit("tryAgain")
    }
  }
}
</script>

<style scoped>

</style>
