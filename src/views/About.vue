<template>
  <div class="about">
    <h1>Это страница об игре и её правилах</h1>
    <div class="container">
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
            <td>{{gamerParams.organicCount}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.organicCoef*100).toFixed(2)}}<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef)}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)}}<div
                class="arrow"></div>
            </td>
            <td>{{gamerParams.averageCheck | formatNumber}}</td>
            <td>
              {{Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Реклама: контекст</th>
            <td>{{gamerParams.contextCount}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.contextCoef*100).toFixed(2)}}<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef)}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)}}<div
                class="arrow"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Реклама: соцсети</th>
            <td>{{gamerParams.socialsCount}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.socialsCoef*100).toFixed(2)}}<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.socialsCoef*gamerParams.socialsCount)}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)}}<div
                class="arrow"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Соц. медиа</th>
            <td>{{gamerParams.smmCount}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.smmCoef*100).toFixed(2)}}<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.smmCoef*gamerParams.smmCount)}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)}}<div class="arrow"></div>
            </td>
            <td></td>
            <td>
              {{Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
          <tr>
            <th scope="row">Прямой заход</th>
            <td>{{gamerParams.straightCount}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.straightCoef*100).toFixed(2)}}<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.straightCoef*gamerParams.straightCount)}}<div class="arrow"></div>
            </td>
            <td>{{(gamerParams.conversion*100).toFixed(2)}} %<div class="arrow"></div>
            </td>
            <td>{{Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion)}}<div
                class="arrow arrow-down"></div>
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
            <td class="font-weight-bold">
              {{(Math.ceil(gamerParams.organicCount*gamerParams.organicCoef*gamerParams.conversion)+Math.ceil(gamerParams.contextCount*gamerParams.contextCoef*gamerParams.conversion)+Math.ceil(gamerParams.socialsCount*gamerParams.socialsCoef*gamerParams.conversion)+Math.ceil(gamerParams.smmCount*gamerParams.smmCoef*gamerParams.conversion)+Math.ceil(gamerParams.straightCount*gamerParams.straightCoef*gamerParams.conversion))*gamerParams.averageCheck | formatNumber}}
              ₽</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      {{gamerParams}}
    </p>
    <p>
      {{gamerPrevParams}}
    </p>
  </div>
</template>
<script>

  export default {
    name: 'About',
    data() {
      return {}
    },
    computed: {
      gamerParams() {
        return this.$store.state.roomParams
      },
      gamerPrevParams() {
        return this.$store.state.prevRoomParams
      }
    }
  }

</script>
<style>
</style>
