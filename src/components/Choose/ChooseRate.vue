<template>
<div class="container">
    <div class="justify-content-center align-items-center mx-5 row">
      <div class="col-xs p-3">
      <div class="step d-flex flex-column align-items-center">
        <h3 :class="{
            'text-success': this.action == 'domen' || this.action == 'final',
            'text-info': this.action == 'tarif'
        }" class=" text-center ">Выберите тариф</h3>
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
      <div class="col-xs d-flex justify-content-between mini-round-wrapper">
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
      
      <div class="col-xs p-3">
      <div class="step d-flex flex-column align-items-center">
        <h3 :class="{
            'text-success': this.action == 'final',
            'text-info': this.action == 'domen' || this.action == 'tarif'
        }" class="text-center">Выберите поддомен</h3>
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
        <div class="col-xs d-flex justify-content-between mini-round-wrapper">
      <div :class="{
            'border-success': this.action == 'final',
             'border-info': this.action == 'tarif' || this.action == 'domen'
        }" class="mini-round border rounded-circle m-1"></div>
      <div :class="{
            'bg-success': this.action == 'final',
            'border-success': this.action == 'final'
        }" class="mini-round border border-info rounded-circle m-1"></div>
      </div>
      <div class="col-xs p-3">
      <div class="step d-flex flex-column align-items-center">
        <h3 class="text-center text-info">Оплатите подписку</h3>
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
    
    <div v-if="this.action == 'domen'" class="choose-domen">
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
      <h1>*процесс оплаты*</h1>
    </div>
    </div>
    </div>
</template>

<script>

export default {
  name: "ChooseRate",
  data() {
    return {
      action: "tarif",
    }
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
</style>
