<template>
<table class="table table-hover">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col" class="font-weight-normal">ТРАФИК</th>
            <th scope="col" class="font-weight-normal" colspan="2">ЗВОНКИ</th>
            <th scope="col" class="font-weight-normal" colspan="2">КЛИЕНТЫ</th>
            <th scope="col" class="font-weight-normal">СРЕДНИЙ ЧЕК</th>
            <th scope="col" class="font-weight-normal">ВЫРУЧКА</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"></th>
            <td></td>
            <td class="font-weight-light">Конверсия, %</td>
            <td class="font-weight-light">Кол-во, шт</td>
            <td class="font-weight-light">Конверсия, %</td>
            <td class="font-weight-light">Кол-во, чел</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">Органика</th>
            <td>{{Math.ceil(gamerParams.organicCount)}}<div class="arrow" :class="{'arrow-up': gamerParams.organicCount>prevParams.organicCount, 'arrow-down': gamerParams.organicCount<prevParams.organicCount}"></div>
            </td>
            <td>{{(gamerParams.organicCoef*100).toFixed(2)}}<div class="arrow" :class="{'arrow-up': gamerParams.organicCoef>prevParams.organicCoef, 'arrow-down': gamerParams.organicCoef<prevParams.organicCoef}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef)}}<div class="arrow" :class="{'arrow-up': Math.ceil(gamerParams.organicCount*gamerParams.organicCoef)>Math.ceil(prevParams.organicCount*prevParams.organicCoef), 'arrow-down': Math.ceil(gamerParams.organicCount*gamerParams.organicCoef)<Math.ceil(prevParams.organicCount*prevParams.organicCoef)}"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow" :class="{'arrow-up': gamerParams.conversion>prevParams.conversion, 'arrow-down': gamerParams.conversion<prevParams.conversion}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)}}<div
                class="arrow"
                :class="{'arrow-up': gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion>prevParams.organicCount*prevParams.organicCoef*prevParams.conversion, 'arrow-down': gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion<prevParams.organicCount*prevParams.organicCoef*prevParams.conversion}"></div>
            </td>
            <td>{{gamerParams.averageCheck | formatNumber}}</td>
            <td>
              {{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Реклама: контекст</th>
            <td>{{Math.ceil(gamerParams.contextCount)}}<div class="arrow" :class="{'arrow-up': gamerParams.contextCount>prevParams.contextCount, 'arrow-down': gamerParams.contextCount<prevParams.contextCount}"></div>
            </td>
            <td>{{(gamerParams.contextCoef*100).toFixed(2)}}<div class="arrow" :class="{'arrow-up': gamerParams.contextCoef>prevParams.contextCoef, 'arrow-down': gamerParams.contextCoef<prevParams.contextCoef}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef)}}<div class="arrow" :class="{'arrow-up': Math.ceil(gamerParams.contextCount*gamerParams.contextCoef)>Math.ceil(prevParams.contextCount*prevParams.contextCoef), 'arrow-down': Math.ceil(gamerParams.contextCount*gamerParams.contextCoef)<Math.ceil(prevParams.contextCount*prevParams.contextCoef)}"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow" :class="{'arrow-up': gamerParams.conversion>prevParams.conversion, 'arrow-down': gamerParams.conversion<prevParams.conversion}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)}}<div
                class="arrow" :class="{'arrow-up': gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion>prevParams.contextCount*prevParams.contextCoef*prevParams.conversion, 'arrow-down': gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion<prevParams.contextCount*prevParams.contextCoef*prevParams.conversion}"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Реклама: соцсети</th>
            <td>{{Math.ceil(gamerParams.socialsCount)}}<div class="arrow" :class="{'arrow-up': gamerParams.socialsCount>prevParams.socialsCount, 'arrow-down': gamerParams.socialsCount<prevParams.socialsCount}"></div>
            </td>
            <td>{{(gamerParams.socialsCoef*100).toFixed(2)}}<div class="arrow" :class="{'arrow-up': gamerParams.socialsCoef>prevParams.socialsCoef, 'arrow-down': gamerParams.socialsCoef<prevParams.socialsCoef}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.socialsCoef*gamerParams.socialsCount)}}<div class="arrow" :class="{'arrow-up': Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef)>Math.ceil(prevParams.socialsCount*prevParams.socialsCoef), 'arrow-down': Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef)<Math.ceil(prevParams.socialsCount*prevParams.socialsCoef)}"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow" :class="{'arrow-up': gamerParams.conversion>prevParams.conversion, 'arrow-down': gamerParams.conversion<prevParams.conversion}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)}}<div
                class="arrow" :class="{'arrow-up': gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion>prevParams.socialsCount*prevParams.socialsCoef*prevParams.conversion, 'arrow-down': gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion<prevParams.socialsCount*prevParams.socialsCoef*prevParams.conversion}"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Соц. медиа</th>
            <td>{{Math.ceil(gamerParams.smmCount)}}<div class="arrow" :class="{'arrow-up': gamerParams.smmCount>prevParams.smmCount, 'arrow-down': gamerParams.smmCount<prevParams.smmCount}"></div>
            </td>
            <td>{{(gamerParams.smmCoef*100).toFixed(2)}}<div class="arrow" :class="{'arrow-up': gamerParams.smmCoef>prevParams.smmCoef, 'arrow-down': gamerParams.smmCoef<prevParams.smmCoef}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.smmCoef*gamerParams.smmCount)}}<div class="arrow" :class="{'arrow-up': Math.ceil(gamerParams.smmCount*gamerParams.smmCoef)>Math.ceil(prevParams.smmCount*prevParams.smmCoef), 'arrow-down': Math.ceil(gamerParams.smmCount*gamerParams.smmCoef)<Math.ceil(prevParams.smmCount*prevParams.smmCoef)}"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow" :class="{'arrow-up': gamerParams.conversion>prevParams.conversion, 'arrow-down': gamerParams.conversion<prevParams.conversion}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)}}<div class="arrow" :class="{'arrow-up': gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion>prevParams.smmCount*prevParams.smmCoef*prevParams.conversion, 'arrow-down': gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion<prevParams.smmCount*prevParams.smmCoef*prevParams.conversion}"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Прямой заход</th>
            <td>{{Math.ceil(gamerParams.straightCount)}}<div class="arrow" :class="{'arrow-up': gamerParams.straightCount>prevParams.straightCount, 'arrow-down': gamerParams.straightCount<prevParams.straightCount}"></div>
            </td>
            <td>{{(gamerParams.straightCoef*100).toFixed(2)}}<div class="arrow" :class="{'arrow-up': gamerParams.straightCoef>prevParams.straightCoef, 'arrow-down': gamerParams.straightCoef<prevParams.straightCoef}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.straightCoef*gamerParams.straightCount)}}<div class="arrow" :class="{'arrow-up': Math.ceil(gamerParams.straightCount*gamerParams.straightCoef)>Math.ceil(prevParams.straightCount*prevParams.straightCoef), 'arrow-down': Math.ceil(gamerParams.straightCount*gamerParams.straightCoef)<Math.ceil(prevParams.straightCount*prevParams.straightCoef)}"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow" :class="{'arrow-up': gamerParams.conversion>prevParams.conversion, 'arrow-down': gamerParams.conversion<prevParams.conversion}"></div>
            </td>
            <td>{{Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion)}}<div
                class="arrow" :class="{'arrow-up': gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion>prevParams.straightCount*prevParams.straightCoef*prevParams.conversion, 'arrow-down': gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion<prevParams.straightCount*prevParams.straightCoef*prevParams.conversion}"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">ИТОГО</th>
            <td>
              {{gamerParams.organicCount+gamerParams.contextCount+gamerParams.socialsCount+gamerParams.smmCount+gamerParams.straightCount}}
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.organicCoef*gamerParams.organicCount)+Math.ceil(gamerParams.contextCoef*gamerParams.contextCount)+Math.ceil(gamerParams.socialsCoef*gamerParams.socialsCount)+Math.ceil(gamerParams.smmCoef*gamerParams.smmCount)+Math.ceil(gamerParams.straightCoef*gamerParams.straightCount)}}
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)+Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)+Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)+Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)+Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion) }}
            </td>
            <td></td>
            <td class="font-weight-bold" nowrap>
              {{(Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)+Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)+Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)+Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)+Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion))*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
        </tbody>
      </table>
</template>

<script>
import numeral from 'numeral'
import Vue from 'vue'
Vue.filter('formatNumber', function (value) {
  return numeral(value).format('0,0')
})

export default {
  name: 'DataTable',
  data () {
    return {

    }
  },
  props: ['isFinishTable'],
  computed: {
    gamerParams () {
      return this.$store.state.roomParams
    },
    prevParams () {
      return this.$store.state.prevRoomParams
    }
  }
}

</script>

<style>
  .arrow {
    display: inline-block;
    width: 1.5ch;
    height: 1.5ch;
    margin-left: 0.5ch;
    background: url('../assets/dash.svg') no-repeat;
  }

  .arrow-down {
    background: url('../assets/side-down.svg') no-repeat;
  }
  .arrow-up {
    background: url('../assets/side-up.svg') no-repeat;
  }
  thead tr th {
    text-align: center;
  }
.table {
  margin-bottom: 0 !important;
}
  .table th,
  .table td {
    padding: 0.2rem !important;
    border-top: 0px solid #000;
    vertical-align: middle;
    font-size: 0.9rem;
  }

  .table td {
    text-align: right;
  }

  .table tr:last-child td,
  .table tr:last-child th[scope="row"] {
    padding-top: 0.5rem !important;
  }
</style>
