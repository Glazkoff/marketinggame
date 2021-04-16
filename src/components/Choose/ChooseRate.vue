<template>
  <div class=""
       :class="{container: this.width>=992 || this.width<768,
       'container-fluid': this.width>=768 && this.width<992
       }">
    <div class="justify-content-center align-items-center row">
      <div @click="changeAction('tarif')" class="pointer col-md-4 col-xl-3"
           :class="{'is-active-action': this.width<=876 && this.action != 'tarif'}"
      >
        <div  class=" step d-flex flex-column align-items-center">
          <h3 :class="{
            'text-success': this.action == 'domen' || this.action == 'final',
            'text-info': this.action == 'tarif'
        }" class="text-center" style="white-space: nowrap">Выберите тариф</h3>
          <div
            :class="{
            active: this.action == 'tarif',
            'bg-info': this.action == 'tarif',
            'bg-success': this.action == 'domen' || this.action == 'final',

        }"
            class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3">
            <h1>1</h1></div>
        </div>
      </div>

      <div class="d-flex justify-content-between mini-round-wrapper ">
        <div :class="{
            'border-success': this.action == 'domen' || this.action == 'final',
            'border-info': this.action == 'tarif'
        }" class="mini-round border rounded-circle m-1"></div>
        <div :class="{
            'bg-success': this.action == 'domen' || this.action == 'final',
            'border-success': this.action == 'domen' || this.action == 'final',
            'border-info': this.action == 'tarif'
        }" class="mini-round border rounded-circle m-1"></div>
      </div>

      <div class="pointer col-md-4 col-xl-3"
           :class="{'is-active-action': this.width<=876 && this.action != 'domen'}"
           @click="changeAction('domen')"
      >
        <div class="step d-flex flex-column align-items-center">
          <h3 :class="{
            'text-success': this.action == 'final',
            'text-info': this.action == 'domen' || this.action == 'tarif'
        }" class="text-center" style="white-space: nowrap">Выберите поддомен</h3>
          <div
            :class="{
            active: this.action == 'domen',
            'bg-info': this.action == 'domen' || this.action == 'tarif',
            'bg-success': this.action == 'final'
        }"
            class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3"><h1>
            2</h1></div>
        </div>
      </div>

      <div class="d-flex justify-content-between mini-round-wrapper">
        <div :class="{
            'border-success': this.action == 'final',
             'border-info': this.action == 'tarif' || this.action == 'domen'
        }" class="mini-round border rounded-circle m-1"></div>
        <div :class="{
            'bg-success': this.action == 'final',
            'border-success': this.action == 'final'
        }" class="mini-round border border-info rounded-circle m-1"></div>
      </div>

      <div  class="pointer col-md-4 col-xl-3"
           :class="{'is-active-action': this.width<=876 && this.action != 'final'}"
           @click="changeAction('final')"
      >
        <div class="step d-flex flex-column align-items-center">
          <h3 class="text-center text-info" style="white-space: nowrap">Оплатите подписку</h3>
          <div
            :class="{
          active: this.action == 'final'
        }"
            class="step-round bg-info text-white rounded-circle d-flex justify-content-center align-items-center mb-3">
            <h1>3</h1></div>
        </div>
      </div>

    </div>
    <hr v-if="this.action == 'tarif'">
    <div v-if="this.action == 'tarif'" class=" justify-content-center align-items-center row">
      <div class="col-md-4 my-3 col-12 col-sm-9">
        <div class="choose-tarif">
          <div class="card text-center">
            <div class="card-header"><h2 class="card-title">Тариф</h2></div>
            <div class="card-body">
              <h3 class="tarif-price">$5</h3>
              <div class="card-text">
                <ul class="list-group">
                  <li class="list-group-item">Преимущество 1</li>
                  <li class="list-group-item">Преимущество 2</li>
                  <li class="list-group-item">Преимущество 3</li>
                </ul>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-info" @click="changeAction('domen')">Выбрать тариф</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 my-3 col-12 col-sm-9">
        <div class="choose-tarif">
          <div class="card text-center">
            <div class="card-header"><h2 class="card-title">Тариф</h2></div>
            <div class="card-body">
              <h3 class="tarif-price">$5</h3>
              <div class="card-text">
                <ul class="list-group">
                  <li class="list-group-item">Преимущество 1</li>
                  <li class="list-group-item">Преимущество 2</li>
                  <li class="list-group-item">Преимущество 3</li>
                </ul>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-info" @click="changeAction('domen')">Выбрать тариф</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4 my-3 col-12 col-sm-9">
        <div class="choose-tarif">
          <div class="card text-center">
            <div class="card-header"><h2 class="card-title">Тариф</h2></div>
            <div class="card-body">
              <h3 class="tarif-price">$5</h3>
              <div class="card-text">
                <ul class="list-group">
                  <li class="list-group-item">Преимущество 1</li>
                  <li class="list-group-item">Преимущество 2</li>
                  <li class="list-group-item">Преимущество 3</li>
                </ul>
              </div>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-info" @click="changeAction('domen')">Выбрать тариф</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="this.action == 'domen'" class="choose-domen mx-auto col-md-8 col-lg-8 col-12 mt-3">
      <div class="card">
        <div class="card-body">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Введите поддомен" v-model="poddomen">

          </div>
          <small><span>Ссылка:</span> <span v-if="this.poddomen==''">example</span>{{poddomen}}.imgames.ru</small>
          <button class="btn btn-outline-info w-100 mt-2" @click="changeAction('final')">Выбрать</button>
        </div>
      </div>
    </div>
    <div v-if="this.action == 'final'" class="final d-flex justify-content-center">
      <div id="form-container" :style="{color: cardInfo.textColor}">
        <div id="card-front" :style="{'background': cardInfo.backgroundGradient}">
          <div id="shadow"></div>
          <div id="image-container">
            <span id="amount">К оплате: <strong>много денег</strong></span>
            <img v-if="cardInfo.bankLogo" id="card-image" :src="cardInfo.bankLogo" alt="logo of bank">
          </div>
          <label for="card-number">
            Номер карты
          </label>
          <input :pattern="cardInfo.numberMusk" type="text" v-model="number" id="card-number"
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
            <div id="cvc-container-inner" class="col-3" v-if="this.width<530">
              <label for="card-cvc-inner">CVC</label>
              <input id="card-cvc-inner" style="width: 60px" type="text" :maxlength="cardInfo.codeLength">
            </div>
          </div>
          <div id="cvc-container" v-if="this.width>=530">
            <label for="card-cvc">CVC</label>
            <input id="card-cvc" type="text" :maxlength="cardInfo.codeLength">
          </div>
        </div>
        <div id="card-back" :style="{'background': cardInfo.backgroundGradient}" v-if="this.width>=530">
          <div id="card-stripe">
          </div>
        </div>
        <button type="button" id="card-btn" class="btn btn-success" :class="{'card-btn-back':this.width>=530,'card-btn-front':this.width<530}" @click="makePayment">Подтвердить</button>

      </div>
    </div>
    <nav class="nav justify-content-between">
      <span :class="{'hidden': this.action =='tarif'}" class="pointer nav-text text-secondary" @click="navAction('back')">Назад</span>
      <span :class="{'hidden': this.action =='final'}" class="pointer nav-text text-secondary" @click="navAction('forward')">Вперед</span>
    </nav>
    
    <Modal v-if="showPaymentModal" @close="sendClose()">
      <template v-slot:header>
        <h5>Оплата прошла успешно!</h5>
      </template>
      <template v-slot:body>
        <p>Поздравляем с приобретением подписки!</p>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-success" @click="onClosePaymentModal">
          Спасибо!
        </button>
      </template>
    </Modal>
  </div>

</template>
<script>
import CardInfo from 'card-info'
import Modal from "@/components/Modal.vue";

export default {
  name: "ChooseRate",
  data() {
    return {
      action: "tarif",
      number: this.number,
      showPaymentModal: false,
      poddomen: "",
      width: window.innerWidth,
    }
  },
  computed: {
    cardInfo: function () {
      CardInfo.setDefaultOptions({
        banksLogosPath: '/banks-logos/',
        brandsLogosPath: '/brands-logos/'
      });
      let cardInfo = new CardInfo(this.number);
      return cardInfo;
    },

  },
  created() {
    window.addEventListener('resize', this.updateWidth);
  },
  components: {
    Modal
  },
  methods: {
    navAction(direction) {
      if(direction === 'forward'){
      switch (this.action) {
        case "tarif":
          this.action = "domen"
          break
        case "domen":
          this.action = "final"
          break
      }}
      else{
        switch (this.action) {
        case "domen":
          this.action = "tarif"
          break
        case "final":
          this.action = "domen"
          break
      }
      }
    },
    changeAction(actionChange) {
      this.action=actionChange
    },
    onShowPaymentModal() {
      this.showPaymentModal = true
    },
    onClosePaymentModal() {
      this.showPaymentModal = false;
      this.$router.push("/choose");
    },
    updateWidth() {
      this.width = window.innerWidth;
    },
    // Завершить покупку
    makePayment(){
      this.$store.dispatch('PAYMENT_REQUEST').then(() => {
        this.onShowPaymentModal()
      }).catch((err) => {
        console.log(err.data.message)
        this.$router.push("/choose");
      })
    }
  }
}
</script>

<style scoped>
.pointer{
  cursor: pointer;
}
.hidden{
  visibility: hidden;
}
.is-active-action {
  display: none;
}

.steps {
  overflow: hidden;
}

.step-round {
  width: 100px;
  height: 100px;

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

.nav-text:hover{
  color: black !important;
  transition: 300ms ease;
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

@media screen and (max-width: 280px){
  .step h3{
    white-space: normal !important;
  }
}
@media screen and (max-width: 530px){
  #form-container{
    width: 390px !important;
  }
  #shadow{
    display: none;
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
  position: absolute;
  width: 150px;
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
.card-btn-back{
  bottom: -55px;
  right: 0;
}
.card-btn-front{
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

#form-container {
  margin: auto;
  width: 500px;
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

#form-container input {
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

#form-container input::-webkit-input-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#form-container input:-moz-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#form-container input::-moz-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#form-container input:-ms-input-placeholder {
  color: #fff;
  opacity: 0.7;
  letter-spacing: 1px;
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 10px;
}

#form-container input.invalid {
  border: solid 2px #eb0000;
  height: 34px;
}

#form-container label {
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
