<template>
<div>
<router-link to="/choose" class="text-muted nav-text">На главную</router-link>
  <div class=""
       :class="{container: width>=992 || width<768,
       'container-fluid': width>=768 && width<992
       }">
       
    <h3 v-if="width<=866 && action=='tariff'" class="text-center text-info" style="white-space: nowrap">
      Выберите тариф</h3>
    <h3 v-if="width<=866 && action=='domain'" class="text-center text-info" style="white-space: nowrap">
      Выберите поддомен</h3>
    <h3 v-if="width<=866 && action=='final'" class="text-center text-info" style="white-space: nowrap">
      Оплатите подписку</h3>
    <div class="justify-content-center align-items-center row m-2">
      <div @click="changeAction('tariff')" class="pointer col-4 col-xl-3"
      >
        <div class=" step d-flex flex-column align-items-center">
          <h3 :class="{
            'text-success': action == 'domain' || action == 'final',
            'text-info': action == 'tariff'
        }" class="text-center" style="white-space: nowrap">Выберите тариф</h3>
          <div
            :class="{
            active: action == 'tariff',
            'bg-info': action == 'tariff',
            'bg-success': action == 'domain' || action == 'final',

        }"
            class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3">
            <span>1</span></div>
        </div>
      </div>

      <div class="d-flex justify-content-between mini-round-wrapper ">
        <div :class="{
            'border-success': action == 'domain' || action == 'final',
            'border-info': action == 'tariff'
        }" class="mini-round border rounded-circle m-1"></div>
        <div :class="{
            'bg-success': action == 'domain' || action == 'final',
            'border-success': action == 'domain' || action == 'final',
            'border-info': action == 'tariff'
        }" class="mini-round border rounded-circle m-1"></div>
      </div>

      <div class="pointer col-4 col-xl-3"
           @click="changeAction('domain')"
      >
        <div class="step d-flex flex-column align-items-center">
          <h3 :class="{
            'text-success': action == 'final',
            'text-info': action == 'domain' || action == 'tariff'
        }" class="text-center" style="white-space: nowrap">Выберите поддомен</h3>
          <div
            :class="{
            active: action == 'domain',
            'bg-info': action == 'domain' || action == 'tariff',
            'bg-success': action == 'final'
        }"
            class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3"><span>
            2</span></div>
        </div>
      </div>

      <div class="d-flex justify-content-between mini-round-wrapper">
        <div :class="{
            'border-success': action == 'final',
             'border-info': action == 'tariff' || action == 'domain'
        }" class="mini-round border rounded-circle m-1"></div>
        <div :class="{
            'bg-success': action == 'final',
            'border-success': action == 'final'
        }" class="mini-round border border-info rounded-circle m-1"></div>
      </div>

      <div class="pointer col-4 col-xl-3"
           @click="changeAction('final')"
      >
        <div class="step d-flex flex-column align-items-center">
          <h3 class="text-center text-info" style="white-space: nowrap">Оплатите подписку</h3>
          <div
            :class="{
          active: action == 'final'
        }"
            class="step-round bg-info text-white rounded-circle d-flex justify-content-center align-items-center mb-3">
            <span>3</span></div>
        </div>
      </div>

    </div>
    <nav class="nav justify-content-between m-3">
      <span :class="{'hidden': action =='tariff'}" class="pointer nav-text text-secondary"
            @click="navAction('back')">Назад</span>
      <span :class="{'hidden': action =='final'}" class="pointer nav-text text-secondary"
            @click="navAction('forward')">Вперед</span>
    </nav>
    <hr v-if="action == 'tariff'">
    <div v-if="action == 'tariff'" class="justify-content-center align-items-start row">
      <div class="col-md-4 my-3 col-12 col-sm-9"
           v-for="tariff in tariffs"
           :key="tariff.id"
      >
        <div class="choose-tariff">
          <div class="card text-center">
            <div class="card-header"><h2 class="card-title">{{ tariff.title }}</h2></div>
            <div class="card-body">
              <h3 class="tariff-price">{{ tariff.price }} $</h3>
              <div class="card-text">
                <ul class="list-group">
                  <li class="list-group-item"
                      v-for="advantage in tariff.advantages"
                      :key="advantage"
                  >{{ advantage }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-info" @click="chooseTariff(tariff)">Выбрать тариф</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="action == 'domain'" class="choose-domain mx-auto col-md-8 col-lg-8 col-12 mt-3">
      <div class="card">
        <div class="card-body">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Введите поддомен" v-model="information.subdomain">

          </div>
          <small><span>Ссылка:</span> <span v-if="information.subdomain==''">example</span>{{
              information.subdomain
            }}.imgames.ru</small>
          <button class="btn btn-outline-info w-100 mt-2" @click="changeAction('final')">Выбрать</button>
        </div>
      </div>
    </div>
    <div v-if="action == 'final'" class="final d-md-flex justify-content-center mt-3">
      <div class="tariff-information card mr-md-5 mb-md-0 mb-4 mx-md-0 mx-auto">
        <div class="card-header"><h4 class="card-title">Информация</h4></div>
        <div class="card-body">
          <div class="card-text">
            <h5>Ваш тариф:</h5>
            <p>{{information.tariff.id !== -1 ? information.tariff.title : 'Тариф не выбран'}}</p>
            <span class="pointer nav-text text-secondary"
                  @click="changeAction('tariff')">Изменить</span>
          </div>
          <div class="card-text mt-4">
            <h5>Ваш поддомен:</h5>
            <p>{{ (information.subdomain !== '') ? `${information.subdomain}.imgames.ru` : 'Поддомен не выбран' }} </p>
            <span class="pointer nav-text text-secondary"
                  @click="changeAction('domain')">Изменить</span>
          </div>
        </div>
      </div>
      <div id="form-container">
        <div id="card-container" :style="{color: cardInfo.textColor}">
          <div id="card-front" :style="{'background': cardInfo.backgroundGradient}">
            <div id="shadow"></div>
            <div id="image-container">
              <span id="amount">К оплате: <strong>много денег</strong></span>
              <img v-if="cardInfo.bankLogo" id="card-image" :src="cardInfo.bankLogo" alt="logo of bank">
            </div>
            <label for="card-number">
              Номер карты
            </label>
            <input :pattern="cardInfo.numberMusk" type="text" v-model="information.cardNumber" id="card-number"
                   :placeholder="cardInfo.numberMask" :maxlength="cardInfo.numberLengths">
            <div class="d-flex justify-content-between row">
              <div id="cardholder-container" class="col-5">
                <label for="card-holder">Владелец карты
                </label>
                <input type="text" style="text-transform: uppercase" id="card-holder" placeholder="IVAN IVANOV"/>
              </div>
              <div id="exp-container" class="col-4">
                <label for="card-exp">
                  Срок действия
                </label>
                <div class="row">
                  <input id="card-month" class="col mr-1" type="text" placeholder="MM" maxlength="2">
                  <input id="card-year" class="col" type="text" placeholder="YY" maxlength="2">
                </div>
              </div>
              <div id="cvc-container-inner" class="col-3" v-if="width<530">
                <label for="card-cvc-inner">CVC</label>
                <input id="card-cvc-inner" style="width: 60px" type="text" :maxlength="cardInfo.codeLength">
              </div>
            </div>
            <div id="cvc-container" v-if="width>=530">
              <label for="card-cvc">CVC</label>
              <input id="card-cvc" type="text" :maxlength="cardInfo.codeLength">
            </div>
          </div>
          <div id="card-back" :style="{'background': cardInfo.backgroundGradient}" v-if="width>=530">
            <div id="card-stripe">
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <small><span>Введите e-mail, на который придет информация о совершенной оплате:</span></small>
            <div class="input-group mt-2">
              <input type="email" class="form-control" placeholder="Введите вашу почту" v-model="information.email">
            </div>
            <button type="button" id="card-btn" class="btn btn-success mt-2"
                    :class="{'card-btn-back':width>=530,'card-btn-front':width<530}" @click="makePayment">
              Подтвердить
            </button>
          </div>
        </div>
      </div>
    </div>
    <PaymentModal
      v-show="showPaymentModal"
      :paymentModalData="paymentModalData"
      :subscriptionData="information"

      @tryAgain="[changeAction('tariff'), onClosePaymentModal()]"
    />
  </div>
  </div>
</template>
<script>
import CardInfo from 'card-info'
import PaymentModal from "./PaymentModal";

export default {
  name: "ChooseRate",
  components: {
    PaymentModal
  },
  data() {
    return {
      action: "tariff",
      tariffs: [
        {
          id: 0,
          title: 'Стандартный',
          price: 100,
          advantages: ['Преимущество 1', 'Преимущество 2']
        },
        {
          id: 1,
          title: 'Крутой',
          price: 150,
          advantages: ['Преимущество 1', 'Преимущество 2', 'Преимущество 3']
        },
        {
          id: 2,
          title: 'Супер крутой',
          price: 200,
          advantages: ['Преимущество 1', 'Преимущество 2', 'Преимущество 3', 'Преимущество 4']
        }
      ],
      information: {
        tariff: {
          id: -1,
          title: ''
        },
        cardNumber: this.number,
        subdomain: '',
        email: ''
      },
      showPaymentModal: false,
      paymentModalData: {
        status: 500,
        message: 'Информация об ошибке'
      },
      width: window.innerWidth,
    }
  },
  computed: {
    cardInfo: function () {
      CardInfo.setDefaultOptions({
        banksLogosPath: '/banks-logos/',
        brandsLogosPath: '/brands-logos/'
      });
      let cardInfo = new CardInfo(this.information.cardNumber);
      return cardInfo;
    },

  },
  created() {
    window.addEventListener('resize', this.updateWidth);
  },
  methods: {
    navAction(direction) {
      if (direction === 'forward') {
        switch (this.action) {
          case "tariff":
            this.action = "domain"
            break
          case "domain":
            this.action = "final"
            break
        }
      } else {
        switch (this.action) {
          case "domain":
            this.action = "tariff"
            break
          case "final":
            this.action = "domain"
            break
        }
      }
    },
    changeAction(actionChange) {
      this.action = actionChange
    },
    onShowPaymentModal(data) {
      this.paymentModalData = data
      this.showPaymentModal = true
    },
    onClosePaymentModal() {
      this.showPaymentModal = false
    },
    updateWidth() {
      this.width = window.innerWidth;
    },
    // Выбор тарифа
    chooseTariff(tariff) {
      this.information.tariff = {id: tariff.id, title: tariff.title}
      this.changeAction('domain')
    },
    // Завершить покупку
    makePayment() {
      this.$store.dispatch('PAYMENT_REQUEST', this.information).then((res) => {
        this.onShowPaymentModal(res.data)
      }).catch((err) => {
        this.onShowPaymentModal(err.data)
      })
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.hidden {
  visibility: hidden;
}

.steps {
  overflow: hidden;
}

.step-round {
  width: 100px;
  height: 100px;
}

.step-round span {
  line-height: 100%;
  font-size: 2rem;
}

.active {
  animation: pulse 2s ease-in-out infinite;

}

.mini-round {
  width: 20px;
  height: 20px;

}

.mini-round:nth-child(2n) {
  background-color: #5bc0de;
  opacity: 0.5;
}

.nav-text:hover {
  color: black !important;
  transition: 300ms ease;
  text-decoration: none;
}

@keyframes pulse {
  from {
    transform: scale(.95);
  }
  50% {
    transform: scale(1);
  }
  to {
    transform: scale(.95);
  }
}

@media screen and (max-width: 1200px) {
  .mini-round {
    display: none;
  }
}

@media screen and (max-width: 280px) {
  .step h3 {
    white-space: normal !important;
  }
}

@media screen and (max-width: 767px) {
  .tariff-information {
    width: 500px !important;
  }
  #form-container {
    margin: auto !important;
  }
}

@media screen and (max-width: 530px) {
  .tariff-information{
    width: 390px !important;
  }

  #form-container {
    width: 390px !important;
  }

  #card-container {
    width: 390px !important;
    height: 230px !important;
  }

  #shadow {
    display: none;
  }
}

@media screen and (max-width: 867px) {
  .step h3 {
    display: none;
  }

  .step-round:not(.active) span {
    font-size: 1rem;
  }

  .step-round:not(.active) {
    width: 50px;
    height: 50px;
  }

  .step-round:not(.active, .bg-success) {
    opacity: 0.6;
  }
}

.done {
  background: green;
  color: white;
}

#amount {
  font-size: 12px;
}

#card-back {
  top: 40px;
  right: 0;
  z-index: -2;
}

#card-btn {
  width: 100%;
  border-radius: 8px;
  height: 42px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
  outline: none;
  border: none;
  cursor: pointer;
}

.card-btn-back {
  bottom: -55px;
  right: 0;
}

.card-btn-front {
  bottom: -10px;
  right: 0;
}

#card-cvc {
  width: 60px;
  margin-bottom: 0;
}

#card-front,
#card-back {
  position: absolute;
  width: 390px;
  height: 250px;
  border-radius: 6px;
  padding: 20px 30px 0;
  box-sizing: border-box;
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 300;
}

#card-image {
  float: right;
  height: 100%;
  width: 50%;
}

#card-number,
#card-holder {
  width: 100%;
}

#card-stripe {
  width: 100%;
  height: 55px;
  background-color: #3d5266;
  position: absolute;
  right: 0;
}

#cvc-container {
  position: absolute;
  width: 110px;
  right: -115px;
  bottom: -10px;
  padding-left: 20px;
  box-sizing: border-box;
}

#cvc-container p {
  font-size: 6px;
  text-transform: uppercase;
  opacity: 0.6;
  letter-spacing: .5px;
}

.tariff-information{
  width: 200px
}

#form-container {
  width: 500px;
}

#card-container {
  margin-bottom: 30px;
  height: 290px;
  position: relative;
}

#form-errors,
#card-success {
  width: 500px;
  margin: 0 auto 10px;
  height: 50px;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 400;
  box-sizing: border-box;
  line-height: 46px;
  letter-spacing: .5px;
  text-transform: none;
}

#form-errors p,
#card-success p {
  margin: 0 5px;
  display: inline-block;
}

#image-container {
  width: 100%;
  position: relative;
  height: 55px;
  margin-bottom: 5px;
  line-height: 55px;
}

#image-container img {
  position: absolute;
  right: 0;
  top: 0;
}

#card-container input {
  border: none;
  outline: none;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  margin: 0 0 25px;
  font-size: 10px;
  box-sizing: border-box;
  border-radius: 4px;
  letter-spacing: .7px;
}

#card-container input::-webkit-input-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#card-container input:-moz-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#card-container input::-moz-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#card-container input:-ms-input-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#card-container input.invalid {
  border: solid 2px #eb0000;
  height: 34px;
}

#card-container label {
  display: block;
  margin: 0 auto 7px;
}

#shadow {
  position: absolute;
  right: 0;
  width: 284px;
  height: 214px;
  top: 36px;
  background-color: #000;
  z-index: -1;
  border-radius: 8px;
  box-shadow: 7px 7px 7px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 7px 7px 7px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 7px 7px 7px rgba(0, 0, 0, 0.2);
}
</style>
