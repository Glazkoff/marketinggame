<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">
          <em v-if="!isFinishTable">Показатели месяца</em>
        </th>
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
        <td>
          {{ Math.ceil(gamerParams.organicCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.organicCount > prevParams.organicCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount > firstParams.organicCount &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.organicCount < prevParams.organicCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount < firstParams.organicCount &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.organicCoef * 100).toFixed(2) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.organicCoef > prevParams.organicCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCoef > firstParams.organicCoef &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.organicCoef < prevParams.organicCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCoef < firstParams.organicCoef &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ Math.ceil(gamerParams.organicCount * gamerParams.organicCoef) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(gamerParams.organicCount * gamerParams.organicCoef) >
                  Math.ceil(prevParams.organicCount * prevParams.organicCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.organicCount * gamerParams.organicCoef) >
                  Math.ceil(
                    firstParams.organicCount * firstParams.organicCoef
                  ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(gamerParams.organicCount * gamerParams.organicCoef) <
                  Math.ceil(prevParams.organicCount * prevParams.organicCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.organicCount * gamerParams.organicCoef) <
                  Math.ceil(
                    firstParams.organicCount * firstParams.organicCoef
                  ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.conversion * 100).toFixed(2) }} %
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.conversion > prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion > firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.conversion < prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion < firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(
              gamerParams.organicCount *
                gamerParams.organicCoef *
                gamerParams.conversion
            )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.organicCount *
                  gamerParams.organicCoef *
                  gamerParams.conversion >
                  prevParams.organicCount *
                    prevParams.organicCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount *
                  gamerParams.organicCoef *
                  gamerParams.conversion >
                  firstParams.organicCount *
                    firstParams.organicCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.organicCount *
                  gamerParams.organicCoef *
                  gamerParams.conversion <
                  prevParams.organicCount *
                    prevParams.organicCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount *
                  gamerParams.organicCoef *
                  gamerParams.conversion <
                  firstParams.organicCount *
                    firstParams.organicCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            (Math.ceil(
              gamerParams.organicCount *
                gamerParams.organicCoef *
                gamerParams.conversion
            ) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr>
        <th scope="row">Реклама: контекст</th>
        <td>
          {{ Math.ceil(gamerParams.contextCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.contextCount > prevParams.contextCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCount > firstParams.contextCount &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.contextCount < prevParams.contextCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCount < firstParams.contextCount &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.contextCoef * 100).toFixed(2) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.contextCoef > prevParams.contextCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCoef > firstParams.contextCoef &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.contextCoef < prevParams.contextCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCoef < firstParams.contextCoef &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ Math.ceil(gamerParams.contextCount * gamerParams.contextCoef) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(gamerParams.contextCount * gamerParams.contextCoef) >
                  Math.ceil(prevParams.contextCount * prevParams.contextCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.contextCount * gamerParams.contextCoef) >
                  Math.ceil(
                    firstParams.contextCount * firstParams.contextCoef
                  ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(gamerParams.contextCount * gamerParams.contextCoef) <
                  Math.ceil(prevParams.contextCount * prevParams.contextCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.contextCount * gamerParams.contextCoef) <
                  Math.ceil(
                    firstParams.contextCount * firstParams.contextCoef
                  ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.conversion * 100).toFixed(2) }} %
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.conversion > prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion > firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.conversion < prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion < firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(
              gamerParams.contextCount *
                gamerParams.contextCoef *
                gamerParams.conversion
            )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion >
                  prevParams.contextCount *
                    prevParams.contextCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion >
                  firstParams.contextCount *
                    firstParams.contextCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion <
                  prevParams.contextCount *
                    prevParams.contextCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion <
                  firstParams.contextCount *
                    firstParams.contextCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            (Math.ceil(
              gamerParams.contextCount *
                gamerParams.contextCoef *
                gamerParams.conversion
            ) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr>
        <th scope="row">Реклама: соцсети</th>
        <td>
          {{ Math.ceil(gamerParams.socialsCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.socialsCount > prevParams.socialsCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCount > firstParams.socialsCount &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.socialsCount < prevParams.socialsCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCount < firstParams.socialsCount &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.socialsCoef * 100).toFixed(2) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.socialsCoef > prevParams.socialsCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCoef > firstParams.socialsCoef &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.socialsCoef < prevParams.socialsCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCoef < firstParams.socialsCoef &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ Math.ceil(gamerParams.socialsCoef * gamerParams.socialsCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(gamerParams.socialsCount * gamerParams.socialsCoef) >
                  Math.ceil(prevParams.socialsCount * prevParams.socialsCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.socialsCount * gamerParams.socialsCoef) >
                  Math.ceil(
                    firstParams.socialsCount * firstParams.socialsCoef
                  ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(gamerParams.socialsCount * gamerParams.socialsCoef) <
                  Math.ceil(prevParams.socialsCount * prevParams.socialsCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.socialsCount * gamerParams.socialsCoef) <
                  Math.ceil(
                    firstParams.socialsCount * firstParams.socialsCoef
                  ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.conversion * 100).toFixed(2) }} %
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.conversion > prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion > firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.conversion < prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion < firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(
              gamerParams.socialsCount *
                gamerParams.socialsCoef *
                gamerParams.conversion
            )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion >
                  prevParams.socialsCount *
                    prevParams.socialsCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion >
                  firstParams.socialsCount *
                    firstParams.socialsCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion <
                  prevParams.socialsCount *
                    prevParams.socialsCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion <
                  firstParams.socialsCount *
                    firstParams.socialsCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            (Math.ceil(
              gamerParams.socialsCount *
                gamerParams.socialsCoef *
                gamerParams.conversion
            ) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr>
        <th scope="row">Соц. медиа</th>
        <td>
          {{ Math.ceil(gamerParams.smmCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.smmCount > prevParams.smmCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.smmCount > firstParams.smmCount && isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.smmCount < prevParams.smmCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.smmCount < firstParams.smmCount && isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.smmCoef * 100).toFixed(2) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.smmCoef > prevParams.smmCoef && !isFinishTable && !isManualStep) ||
                (gamerParams.smmCoef > firstParams.smmCoef && isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.smmCoef < prevParams.smmCoef && !isFinishTable && !isManualStep) ||
                (gamerParams.smmCoef < firstParams.smmCoef && isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(gamerParams.smmCount * gamerParams.smmCoef) >
                  Math.ceil(prevParams.smmCount * prevParams.smmCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.smmCount * gamerParams.smmCoef) >
                  Math.ceil(firstParams.smmCount * firstParams.smmCoef) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(gamerParams.smmCount * gamerParams.smmCoef) <
                  Math.ceil(prevParams.smmCount * prevParams.smmCoef) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.smmCount * gamerParams.smmCoef) <
                  Math.ceil(firstParams.smmCount * firstParams.smmCoef) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.conversion * 100).toFixed(2) }} %
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.conversion > prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion > firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.conversion < prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion < firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(
              gamerParams.smmCount *
                gamerParams.smmCoef *
                gamerParams.conversion
            )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion >
                  prevParams.smmCount *
                    prevParams.smmCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion >
                  firstParams.smmCount *
                    firstParams.smmCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion <
                  prevParams.smmCount *
                    prevParams.smmCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion <
                  firstParams.smmCount *
                    firstParams.smmCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            (Math.ceil(
              gamerParams.smmCount *
                gamerParams.smmCoef *
                gamerParams.conversion
            ) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr>
        <th scope="row">Прямой заход</th>
        <td>
          {{ Math.ceil(gamerParams.straightCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.straightCount > prevParams.straightCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCount > firstParams.straightCount &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.straightCount < prevParams.straightCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCount < firstParams.straightCount &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.straightCoef * 100).toFixed(2) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.straightCoef > prevParams.straightCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCoef > firstParams.straightCoef &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.straightCoef < prevParams.straightCoef &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCoef < firstParams.straightCoef &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ Math.ceil(gamerParams.straightCoef * gamerParams.straightCount) }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(
                  gamerParams.straightCount * gamerParams.straightCoef
                ) >
                  Math.ceil(
                    prevParams.straightCount * prevParams.straightCoef
                  ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(
                  gamerParams.straightCount * gamerParams.straightCoef
                ) >
                  Math.ceil(
                    firstParams.straightCount * firstParams.straightCoef
                  ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(
                  gamerParams.straightCount * gamerParams.straightCoef
                ) <
                  Math.ceil(
                    prevParams.straightCount * prevParams.straightCoef
                  ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(
                  gamerParams.straightCount * gamerParams.straightCoef
                ) <
                  Math.ceil(
                    firstParams.straightCount * firstParams.straightCoef
                  ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ (gamerParams.conversion * 100).toFixed(2) }} %
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.conversion > prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion > firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.conversion < prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.conversion < firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(
              gamerParams.straightCount *
                gamerParams.straightCoef *
                gamerParams.conversion
            )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion >
                  prevParams.straightCount *
                    prevParams.straightCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion >
                  firstParams.straightCount *
                    firstParams.straightCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion <
                  prevParams.straightCount *
                    prevParams.straightCoef *
                    prevParams.conversion &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion <
                  firstParams.straightCount *
                    firstParams.straightCoef *
                    firstParams.conversion &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            (Math.ceil(
              gamerParams.straightCount *
                gamerParams.straightCoef *
                gamerParams.conversion
            ) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr>
        <th scope="row">ИТОГО</th>
        <td>
          {{
            Math.ceil(gamerParams.organicCount) +
              Math.ceil(gamerParams.contextCount) +
              Math.ceil(gamerParams.socialsCount) +
              Math.ceil(gamerParams.smmCount) +
              Math.ceil(gamerParams.straightCount)
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.organicCount +
                  gamerParams.contextCount +
                  gamerParams.socialsCount +
                  gamerParams.smmCount +
                  gamerParams.straightCount >
                  prevParams.organicCount +
                    prevParams.contextCount +
                    prevParams.socialsCount +
                    prevParams.smmCount +
                    prevParams.straightCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount +
                  gamerParams.contextCount +
                  gamerParams.socialsCount +
                  gamerParams.smmCount +
                  gamerParams.straightCount >
                  firstParams.organicCount +
                    firstParams.contextCount +
                    firstParams.socialsCount +
                    firstParams.smmCount +
                    firstParams.straightCount &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.organicCount +
                  gamerParams.contextCount +
                  gamerParams.socialsCount +
                  gamerParams.smmCount +
                  gamerParams.straightCount <
                  prevParams.organicCount +
                    prevParams.contextCount +
                    prevParams.socialsCount +
                    prevParams.smmCount +
                    prevParams.straightCount &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.organicCount +
                  gamerParams.contextCount +
                  gamerParams.socialsCount +
                  gamerParams.smmCount +
                  gamerParams.straightCount <
                  firstParams.organicCount +
                    firstParams.contextCount +
                    firstParams.socialsCount +
                    firstParams.smmCount +
                    firstParams.straightCount &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            (
              ((Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
                Math.ceil(gamerParams.contextCoef * gamerParams.contextCount) +
                Math.ceil(gamerParams.socialsCoef * gamerParams.socialsCount) +
                Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                Math.ceil(
                  gamerParams.straightCoef * gamerParams.straightCount
                )) /
                (gamerParams.organicCount +
                  gamerParams.contextCount +
                  gamerParams.socialsCount +
                  gamerParams.smmCount +
                  gamerParams.straightCount)) *
              100
            ).toFixed(2)
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                ((
                  (Math.ceil(
                    gamerParams.organicCoef * gamerParams.organicCount
                  ) +
                    Math.ceil(
                      gamerParams.contextCoef * gamerParams.contextCount
                    ) +
                    Math.ceil(
                      gamerParams.socialsCoef * gamerParams.socialsCount
                    ) +
                    Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                    Math.ceil(
                      gamerParams.straightCoef * gamerParams.straightCount
                    )) /
                  (gamerParams.organicCount +
                    gamerParams.contextCount +
                    gamerParams.socialsCount +
                    gamerParams.smmCount +
                    gamerParams.straightCount)
                ).toFixed(2) *
                  100 >
                  (
                    (Math.ceil(
                      prevParams.organicCoef * prevParams.organicCount
                    ) +
                      Math.ceil(
                        prevParams.contextCoef * prevParams.contextCount
                      ) +
                      Math.ceil(
                        prevParams.socialsCoef * prevParams.socialsCount
                      ) +
                      Math.ceil(prevParams.smmCoef * prevParams.smmCount) +
                      Math.ceil(
                        prevParams.straightCoef * prevParams.straightCount
                      )) /
                    (prevParams.organicCount +
                      prevParams.contextCount +
                      prevParams.socialsCount +
                      prevParams.smmCount +
                      prevParams.straightCount)
                  ).toFixed(2) *
                    100 &&
                  !isFinishTable && !isManualStep) ||
                ((
                  (Math.ceil(
                    gamerParams.organicCoef * gamerParams.organicCount
                  ) +
                    Math.ceil(
                      gamerParams.contextCoef * gamerParams.contextCount
                    ) +
                    Math.ceil(
                      gamerParams.socialsCoef * gamerParams.socialsCount
                    ) +
                    Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                    Math.ceil(
                      gamerParams.straightCoef * gamerParams.straightCount
                    )) /
                  (gamerParams.organicCount +
                    gamerParams.contextCount +
                    gamerParams.socialsCount +
                    gamerParams.smmCount +
                    gamerParams.straightCount)
                ).toFixed(2) *
                  100 >
                  (
                    (Math.ceil(
                      firstParams.organicCoef * firstParams.organicCount
                    ) +
                      Math.ceil(
                        firstParams.contextCoef * firstParams.contextCount
                      ) +
                      Math.ceil(
                        firstParams.socialsCoef * firstParams.socialsCount
                      ) +
                      Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
                      Math.ceil(
                        firstParams.straightCoef * firstParams.straightCount
                      )) /
                    (firstParams.organicCount +
                      firstParams.contextCount +
                      firstParams.socialsCount +
                      firstParams.smmCount +
                      firstParams.straightCount)
                  ).toFixed(2) *
                    100 &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                ((
                  (Math.ceil(
                    gamerParams.organicCoef * gamerParams.organicCount
                  ) +
                    Math.ceil(
                      gamerParams.contextCoef * gamerParams.contextCount
                    ) +
                    Math.ceil(
                      gamerParams.socialsCoef * gamerParams.socialsCount
                    ) +
                    Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                    Math.ceil(
                      gamerParams.straightCoef * gamerParams.straightCount
                    )) /
                  (gamerParams.organicCount +
                    gamerParams.contextCount +
                    gamerParams.socialsCount +
                    gamerParams.smmCount +
                    gamerParams.straightCount)
                ).toFixed(2) *
                  100 <
                  (
                    (Math.ceil(
                      prevParams.organicCoef * prevParams.organicCount
                    ) +
                      Math.ceil(
                        prevParams.contextCoef * prevParams.contextCount
                      ) +
                      Math.ceil(
                        prevParams.socialsCoef * prevParams.socialsCount
                      ) +
                      Math.ceil(prevParams.smmCoef * prevParams.smmCount) +
                      Math.ceil(
                        prevParams.straightCoef * prevParams.straightCount
                      )) /
                    (prevParams.organicCount +
                      prevParams.contextCount +
                      prevParams.socialsCount +
                      prevParams.smmCount +
                      prevParams.straightCount)
                  ).toFixed(2) *
                    100 &&
                  !isFinishTable && !isManualStep) ||
                ((
                  (Math.ceil(
                    gamerParams.organicCoef * gamerParams.organicCount
                  ) +
                    Math.ceil(
                      gamerParams.contextCoef * gamerParams.contextCount
                    ) +
                    Math.ceil(
                      gamerParams.socialsCoef * gamerParams.socialsCount
                    ) +
                    Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                    Math.ceil(
                      gamerParams.straightCoef * gamerParams.straightCount
                    )) /
                  (gamerParams.organicCount +
                    gamerParams.contextCount +
                    gamerParams.socialsCount +
                    gamerParams.smmCount +
                    gamerParams.straightCount)
                ).toFixed(2) *
                  100 <
                  (
                    (Math.ceil(
                      firstParams.organicCoef * firstParams.organicCount
                    ) +
                      Math.ceil(
                        firstParams.contextCoef * firstParams.contextCount
                      ) +
                      Math.ceil(
                        firstParams.socialsCoef * firstParams.socialsCount
                      ) +
                      Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
                      Math.ceil(
                        firstParams.straightCoef * firstParams.straightCount
                      )) /
                    (firstParams.organicCount +
                      firstParams.contextCount +
                      firstParams.socialsCount +
                      firstParams.smmCount +
                      firstParams.straightCount)
                  ).toFixed(2) *
                    100 &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{
            Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
              Math.ceil(gamerParams.contextCoef * gamerParams.contextCount) +
              Math.ceil(gamerParams.socialsCoef * gamerParams.socialsCount) +
              Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
              Math.ceil(gamerParams.straightCoef * gamerParams.straightCount)
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
                  Math.ceil(
                    gamerParams.contextCoef * gamerParams.contextCount
                  ) +
                  Math.ceil(
                    gamerParams.socialsCoef * gamerParams.socialsCount
                  ) +
                  Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                  Math.ceil(
                    gamerParams.straightCoef * gamerParams.straightCount
                  ) >
                  Math.ceil(prevParams.organicCoef * prevParams.organicCount) +
                    Math.ceil(
                      prevParams.contextCoef * prevParams.contextCount
                    ) +
                    Math.ceil(
                      prevParams.socialsCoef * prevParams.socialsCount
                    ) +
                    Math.ceil(prevParams.smmCoef * prevParams.smmCount) +
                    Math.ceil(
                      prevParams.straightCoef * prevParams.straightCount
                    ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
                  Math.ceil(
                    gamerParams.contextCoef * gamerParams.contextCount
                  ) +
                  Math.ceil(
                    gamerParams.socialsCoef * gamerParams.socialsCount
                  ) +
                  Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                  Math.ceil(
                    gamerParams.straightCoef * gamerParams.straightCount
                  ) >
                  Math.ceil(
                    firstParams.organicCoef * firstParams.organicCount
                  ) +
                    Math.ceil(
                      firstParams.contextCoef * firstParams.contextCount
                    ) +
                    Math.ceil(
                      firstParams.socialsCoef * firstParams.socialsCount
                    ) +
                    Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
                    Math.ceil(
                      firstParams.straightCoef * firstParams.straightCount
                    ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
                  Math.ceil(
                    gamerParams.contextCoef * gamerParams.contextCount
                  ) +
                  Math.ceil(
                    gamerParams.socialsCoef * gamerParams.socialsCount
                  ) +
                  Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                  Math.ceil(
                    gamerParams.straightCoef * gamerParams.straightCount
                  ) <
                  Math.ceil(prevParams.organicCoef * prevParams.organicCount) +
                    Math.ceil(
                      prevParams.contextCoef * prevParams.contextCount
                    ) +
                    Math.ceil(
                      prevParams.socialsCoef * prevParams.socialsCount
                    ) +
                    Math.ceil(prevParams.smmCoef * prevParams.smmCount) +
                    Math.ceil(
                      prevParams.straightCoef * prevParams.straightCount
                    ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(gamerParams.organicCoef * gamerParams.organicCount) +
                  Math.ceil(
                    gamerParams.contextCoef * gamerParams.contextCount
                  ) +
                  Math.ceil(
                    gamerParams.socialsCoef * gamerParams.socialsCount
                  ) +
                  Math.ceil(gamerParams.smmCoef * gamerParams.smmCount) +
                  Math.ceil(
                    gamerParams.straightCoef * gamerParams.straightCount
                  ) <
                  Math.ceil(
                    firstParams.organicCoef * firstParams.organicCount
                  ) +
                    Math.ceil(
                      firstParams.contextCoef * firstParams.contextCount
                    ) +
                    Math.ceil(
                      firstParams.socialsCoef * firstParams.socialsCount
                    ) +
                    Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
                    Math.ceil(
                      firstParams.straightCoef * firstParams.straightCount
                    ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td></td>
        <td>
          {{
            Math.ceil(
              gamerParams.organicCount *
                gamerParams.organicCoef *
                gamerParams.conversion
            ) +
              Math.ceil(
                gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion
              )
          }}
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (Math.ceil(
                  gamerParams.organicCount *
                    gamerParams.organicCoef *
                    gamerParams.conversion
                ) +
                  Math.ceil(
                    gamerParams.contextCount *
                      gamerParams.contextCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.socialsCount *
                      gamerParams.socialsCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.smmCount *
                      gamerParams.smmCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.straightCount *
                      gamerParams.straightCoef *
                      gamerParams.conversion
                  ) >
                  Math.ceil(
                    prevParams.organicCount *
                      prevParams.organicCoef *
                      prevParams.conversion
                  ) +
                    Math.ceil(
                      prevParams.contextCount *
                        prevParams.contextCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.socialsCount *
                        prevParams.socialsCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.smmCount *
                        prevParams.smmCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.straightCount *
                        prevParams.straightCoef *
                        prevParams.conversion
                    ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(
                  gamerParams.organicCount *
                    gamerParams.organicCoef *
                    gamerParams.conversion
                ) +
                  Math.ceil(
                    gamerParams.contextCount *
                      gamerParams.contextCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.socialsCount *
                      gamerParams.socialsCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.smmCount *
                      gamerParams.smmCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.straightCount *
                      gamerParams.straightCoef *
                      gamerParams.conversion
                  ) >
                  Math.ceil(
                    firstParams.organicCount *
                      firstParams.organicCoef *
                      firstParams.conversion
                  ) +
                    Math.ceil(
                      firstParams.contextCount *
                        firstParams.contextCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.socialsCount *
                        firstParams.socialsCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.smmCount *
                        firstParams.smmCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.straightCount *
                        firstParams.straightCoef *
                        firstParams.conversion
                    ) &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (Math.ceil(
                  gamerParams.organicCount *
                    gamerParams.organicCoef *
                    gamerParams.conversion
                ) +
                  Math.ceil(
                    gamerParams.contextCount *
                      gamerParams.contextCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.socialsCount *
                      gamerParams.socialsCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.smmCount *
                      gamerParams.smmCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.straightCount *
                      gamerParams.straightCoef *
                      gamerParams.conversion
                  ) <
                  Math.ceil(
                    prevParams.organicCount *
                      prevParams.organicCoef *
                      prevParams.conversion
                  ) +
                    Math.ceil(
                      prevParams.contextCount *
                        prevParams.contextCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.socialsCount *
                        prevParams.socialsCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.smmCount *
                        prevParams.smmCoef *
                        prevParams.conversion
                    ) +
                    Math.ceil(
                      prevParams.straightCount *
                        prevParams.straightCoef *
                        prevParams.conversion
                    ) &&
                  !isFinishTable && !isManualStep) ||
                (Math.ceil(
                  gamerParams.organicCount *
                    gamerParams.organicCoef *
                    gamerParams.conversion
                ) +
                  Math.ceil(
                    gamerParams.contextCount *
                      gamerParams.contextCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.socialsCount *
                      gamerParams.socialsCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.smmCount *
                      gamerParams.smmCoef *
                      gamerParams.conversion
                  ) +
                  Math.ceil(
                    gamerParams.straightCount *
                      gamerParams.straightCoef *
                      gamerParams.conversion
                  ) <
                  Math.ceil(
                    firstParams.organicCount *
                      firstParams.organicCoef *
                      firstParams.conversion
                  ) +
                    Math.ceil(
                      firstParams.contextCount *
                        firstParams.contextCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.socialsCount *
                        firstParams.socialsCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.smmCount *
                        firstParams.smmCoef *
                        firstParams.conversion
                    ) +
                    Math.ceil(
                      firstParams.straightCount *
                        firstParams.straightCoef *
                        firstParams.conversion
                    ) &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td>
          {{ gamerParams.averageCheck | formatNumber }} ₽
          <div
            class="arrow"
            :class="{
              'arrow-up':
                (gamerParams.averageCheck > prevParams.averageCheck &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.averageCheck > firstParams.averageCheck &&
                  isFinishTable && !isManualStep),
              'arrow-down':
                (gamerParams.averageCheck < prevParams.averageCheck &&
                  !isFinishTable && !isManualStep) ||
                (gamerParams.averageCheck < firstParams.averageCheck &&
                  isFinishTable && !isManualStep)
            }"
          ></div>
        </td>
        <td class="font-weight-bold" nowrap>
          {{
            ((Math.ceil(
              gamerParams.organicCount *
                gamerParams.organicCoef *
                gamerParams.conversion
            ) +
              Math.ceil(
                gamerParams.contextCount *
                  gamerParams.contextCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.socialsCount *
                  gamerParams.socialsCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.smmCount *
                  gamerParams.smmCoef *
                  gamerParams.conversion
              ) +
              Math.ceil(
                gamerParams.straightCount *
                  gamerParams.straightCoef *
                  gamerParams.conversion
              )) *
              gamerParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
      <tr v-if="isFinishTable">
        <th scope="row">ДО</th>
        <td>
          {{
            firstParams.organicCount +
              firstParams.contextCount +
              firstParams.socialsCount +
              firstParams.smmCount +
              firstParams.straightCount
          }}
        </td>
        <td>
          {{
            (
              ((Math.ceil(firstParams.organicCoef * firstParams.organicCount) +
                Math.ceil(firstParams.contextCoef * firstParams.contextCount) +
                Math.ceil(firstParams.socialsCoef * firstParams.socialsCount) +
                Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
                Math.ceil(
                  firstParams.straightCoef * firstParams.straightCount
                )) /
                (firstParams.organicCount +
                  firstParams.contextCount +
                  firstParams.socialsCount +
                  firstParams.smmCount +
                  firstParams.straightCount)) *
              100
            ).toFixed(2)
          }}
        </td>
        <td>
          {{
            Math.ceil(firstParams.organicCoef * firstParams.organicCount) +
              Math.ceil(firstParams.contextCoef * firstParams.contextCount) +
              Math.ceil(firstParams.socialsCoef * firstParams.socialsCount) +
              Math.ceil(firstParams.smmCoef * firstParams.smmCount) +
              Math.ceil(firstParams.straightCoef * firstParams.straightCount)
          }}
        </td>
        <td></td>
        <td>
          {{
            Math.ceil(
              firstParams.organicCount *
                firstParams.organicCoef *
                firstParams.conversion
            ) +
              Math.ceil(
                firstParams.contextCount *
                  firstParams.contextCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.socialsCount *
                  firstParams.socialsCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.smmCount *
                  firstParams.smmCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.straightCount *
                  firstParams.straightCoef *
                  firstParams.conversion
              )
          }}
        </td>
        <td>{{ firstParams.averageCheck | formatNumber }} ₽</td>
        <td class="light-gray" nowrap>
          {{
            ((Math.ceil(
              firstParams.organicCount *
                firstParams.organicCoef *
                firstParams.conversion
            ) +
              Math.ceil(
                firstParams.contextCount *
                  firstParams.contextCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.socialsCount *
                  firstParams.socialsCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.smmCount *
                  firstParams.smmCoef *
                  firstParams.conversion
              ) +
              Math.ceil(
                firstParams.straightCount *
                  firstParams.straightCoef *
                  firstParams.conversion
              )) *
              firstParams.averageCheck)
              | formatNumber
          }}
          ₽
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import numeral from "numeral";
import Vue from "vue";
Vue.filter("formatNumber", function(value) {
  return numeral(value).format("0,0");
});

export default {
  name: "DataTable",
  data() {
    return {};
  },
  props: ["isFinishTable"],
  computed: {
    gamerParams() {
      return this.$store.state.roomParams;
    },
    prevParams() {
      return this.$store.state.prevRoomParams;
    },
    firstParams() {
      return this.$store.state.firstRoomParams;
    },
    isManualStep(){
      return this.$store.state.isManualStep
    }
  }
};
</script>

<style>
.arrow {
  display: inline-block;
  width: 1.5ch;
  height: 1.5ch;
  margin-left: 0.5ch;
  background: url("../assets/dash.svg") no-repeat;
}

.arrow-down {
  background: url("../assets/side-down.svg") no-repeat;
}
.arrow-up {
  background: url("../assets/side-up.svg") no-repeat;
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
