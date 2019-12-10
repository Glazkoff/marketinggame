<template>
  <div id="effectslist">
    <li v-if="!isStart" class="list-group-item d-flex justify-content-between align-items-center active bg-info w-100" id="effects-head">
        <h6>Длительные события</h6>
      </li> 
    <ul class="list-group" v-if="!isStart" >
       
      <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(effect, count) in effects"
        :key="count" 
        :class="{'list-group-item-info': count % 2 == 1, 'list-group-item-secondary text-body': count % 2 == 0}">
        {{effect.name}}
        <span class="badge  badge-pill" :class="{'badge-info': count % 2 == 1, 'badge-secondary': count % 2 == 0}">Шаг: {{effect.step}} из {{effect.duration}}</span>
        <!-- <span
          class="badge badge-primary badge-pill"
          v-if="gamer.isattacker"
        >Сделал ход</span>
        <span class="badge badge-warning badge-pill" v-else="gamer.isattacker">Размышляет</span>-->
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Effects',
    data() {
      return {

      }
    },
    computed: {
      isStart() {
        return this.$store.state.isStart;
      },
      effects() {
        return this.$store.state.activeEffects;
      }
    }
  }

</script>

<style>
  #effectslist {
    background-color: #fff;
    margin: auto auto;
    width: 96%;
    height: 97%;
    
    max-height: 97%;
    min-height: 97%;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    overflow-y: scroll;
    position: relative;
  }
#effectslist ul {
    
    padding-top: 64px;
}
#effects-head {
      position: absolute;
      top: 0;
      left: 0;
      height: 64px;
      z-index: 10000;
  }
  #effectslist::-webkit-scrollbar {
    width: 4px;
    height: 8px;
    background-color: #f5f5f5;
  }

  #effectslist::-webkit-scrollbar-track {
    border-radius: 2px;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
  }

  #effectslist::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: linear-gradient(top, #fff, #e4e4e4);
    border: 1px solid #aaa;
  }

  #effectslist::-webkit-scrollbar-thumb:hover {
    background: #fff;
  }

  #effectslist::-webkit-scrollbar-thumb:active {
    background: linear-gradient(left, #0079fb, #1e98ba);
  }
  
</style>
