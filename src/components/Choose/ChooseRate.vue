<template>
<div class="container d-flex flex-column justify-content-center align-items-center">
    <div class="justify-content-center align-items-center mx-5 row">
      <div class="col-sm p-3">
      <div class="step d-flex flex-column align-items-center">
        <h3 :class="{
            'text-success': this.action == 'domen' || this.action == 'final',
            'text-info': this.action == 'tarif'
        }" class=" text-center" style="white-space: nowrap">Выберите тариф</h3>
        <div
         :class="{
            active: this.action == 'tarif',
            'bg-info': this.action == 'tarif',
            'bg-success': this.action == 'domen' || this.action == 'final',
            
        }"
          class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3"><h1>1</h1></div>
      </div>
      <div v-if="this.action == 'tarif'" class="choose-tarif">
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
            <button type="button" class="btn btn-info" @click="changeAction()">Выбрать тариф</button>
          </div>
        </div>
        </div>
      </div>
      <div class="d-flex justify-content-between mini-round-wrapper">
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
      
      <div class="col-sm p-3">
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
          class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3"><h1>2</h1></div>
      </div>
      <div v-if="this.action == 'tarif'" class="choose-tarif">
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
            <button type="button" class="btn btn-info" @click="changeAction()">Выбрать тариф</button>
          </div>
        </div>
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
      <div class="col-sm p-3">
      <div class="step d-flex flex-column align-items-center">
        <h3 class="text-center text-info" style="white-space: nowrap">Оплатите подписку</h3>
        <div
          :class="{
          active: this.action == 'final'
        }"
          class="step-round bg-info text-white rounded-circle d-flex justify-content-center align-items-center mb-3"><h1>3</h1></div>
      </div>
      <div v-if="this.action == 'tarif'" class="choose-tarif">
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
            <button type="button" class="btn btn-info" @click="changeAction()">Выбрать тариф</button>
          </div>
        </div>
      </div>
      </div>
    </div>
    <div v-if="this.action == 'domen'" class="choose-domen w-50">
      <div class="card">
        <div class="card-body">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Введите поддомен">
            <div class="input-group-append">
              <span class="input-group-text" id="basic-addon2">.imgames.ru</span>
            </div>
          </div>
          <button class="btn btn-outline-info w-100 mt-2" @click="changeAction()">Выбрать</button>
        </div>
      </div>
    </div>
    <div v-if="this.action == 'final'" class="final">
      <div id="card-success" class="hidden">
  <i class="fa fa-check"></i>
  <p>Оплата прошла успешно!</p>
</div>
<div id="form-errors" class="hidden">
  <i class="fa fa-exclamation-triangle"></i>
  <p id="card-error">Ошибка!</p>
</div>
<div id="form-container" :style="{color: cardInfo.textColor}">

  <div id="card-front" :style="{'background': cardInfo.backgroundGradient}">
    <div id="shadow"></div>
    <div id="image-container">
      <span id="amount">К оплате: <strong>много денег</strong></span>
        <img v-if="cardInfo.bankLogo" id="card-image" :src="cardInfo.bankLogo" alt="logo of bank">

    </div>
    <!--- end card image container --->

    <label for="card-number">
        Номер карты
      </label>
    <input :pattern="cardInfo.numberMusk" type="text" v-model="number" id="card-number" placeholder="1234 5678 9101 1112" length="16">
    <div class="d-flex justify-content-between row">
    <div id="cardholder-container" class="col-8">
      <label for="card-holder">Владелец карты
      </label>
      <input type="text" style="text-transform: uppercase" id="card-holder" placeholder="IVAN IVANOV" />
    </div>
    <!--- end card holder container --->
    <div id="exp-container" class="col-4">
      <label for="card-exp">
          Срок действия
        </label>
        <div class="row">
      <input id="card-month" class="col mr-1"  type="number"  placeholder="MM" length="2">
      <input id="card-year" class="col" type="number" placeholder="YY" length="2">
      </div>
    </div>
    </div>
        <div id="cvc-container">
      <label for="card-cvc">{{cardInfo.codeName}}</label>
      <input id="card-cvc" placeholder="XXX-X" type="text" :length="cardInfo.codeLength">
    </div>
    <!--- end CVC container --->
    <!--- end exp container --->
  </div>
  <!--- end card front --->
  <div id="card-back" :style="{'background': cardInfo.backgroundGradient}">
    <div id="card-stripe">
    </div>

  </div>
  <!--- end card back --->
  <input type="text" id="card-token" />
  <button type="button" id="card-btn" class="btn btn-success">Подтвердить</button>

</div>
    </div>
    </div>
</template>
<script>
import CardInfo from 'card-info'
export default {
  name: "ChooseRate",
  data() {
    return {
      action: "tarif",
      number: this.number,
      mm: this.mm,
      yy: this.yy

    }
  },
  computed:{
    cardInfo: function(){
      CardInfo.setDefaultOptions({
      banksLogosPath: '/banks-logos/',
      brandsLogosPath: '/brands-logos/'
    });
    let cardInfo = new CardInfo(this.number);
    return cardInfo;
    },

  },
  components: {},
  methods: {
    changeAction() {
      switch (this.action) {
        case "tarif":
          this.action = "domen"
          break
        case "domen":
          this.action = "final"
          break
      }
    }
  }
}
</script>

<style scoped>
.steps {
  overflow: hidden;
}

.step-round {
  width: 100px;
  height: 100px;
  
}

.active{
animation: pulse 2s ease-in-out infinite;

}
.mini-round {
  width: 20px;
  height: 20px;
  
}
.mini-round:nth-child(2n){
  background-color: #5bc0de;
  opacity: 0.5;
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
  .mini-round{
    display: none;
  }
}
.done{
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
  bottom: -55px;
  right: 0;
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

#card-token {
  display: none;
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

#form-errors {
  color: #eb0000;
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

.hidden {
  display: none;
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
