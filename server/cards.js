let cards = [
  {
    id: 1,
    title: "Нанять SMM-менеджера",
    text: `Трафик из соц.медиа: 2й мес - к-т 1.1, 3й - 1.8. Конверсия в звонки по соц.сетям: 3й мес - 1.5`,
    coefs: [1.1, 1.8, 1.5],
    templateText:
      "Трафик из соц.медиа: 2й мес - к-т @coef0, 3й - @coef1. Конверсия в звонки по соц.сетям: 3й мес - @coef2",
    cost: 80000,
    duration: 3,
    data_change: [
      {
        param: "smmCount",
        operation: "*",
        change: 1.1,
        when: 2,
        from: "Нанять SMM-менеджера 2",
        id: 1
      },
      {
        param: "smmCount",
        operation: "*",
        change: 1.8,
        when: 3,
        from: "Нанять SMM-менеджера 3",
        id: 1
      },
      {
        param: "socialsCoef",
        operation: "*",
        change: 1.5,
        when: 3,
        from: "Нанять SMM-менеджера 3",
        id: 1
      }
    ]
  },
  {
    id: 2,
    title: "Заказать SEO-оптимизацию",
    text:
      "Органика растет в 2 раза на 3й мес применения. 1й мес просто стоимости привлечения - 1.5, 3й мес падение - 0.3",
    coefs: [2, 1.5, 0.3],
    templateText:
      "Органика растет в @coef0 раза на 3й мес применения. 1й мес просто стоимости привлечения - @coef1, 3й мес падение - @coef2",
    cost: 50000,
    duration: 3,
    data_change: [
      {
        param: "organicCount",
        operation: "*",
        change: 2,
        when: 3,
        from: "Заказать SEO-оптимизацию 3",
        id: 2
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.5,
        when: 1,
        from: "Заказать SEO-оптимизацию 1",
        id: 2
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 0.3,
        when: 3,
        from: "Заказать SEO-оптимизацию 3",
        id: 2
      }
    ]
  },
  {
    id: 3,
    title: "Улучшение юзабилити",
    text:
      "Конверсия в звонки по всем каналам: 3й - 1.1. Стоимость привлечения: 1 и 2й - 0.8. Средний чек: 3й - 1.5",
    cost: 20000,
    duration: 3,
    oneOff: true,
    data_change: [
      {
        param: "organicCoef",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "contextCoef",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "socialsCoef",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "smmCoef",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "straightCoef",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "averageCheck",
        operation: "*",
        change: 1.5,
        when: 3,
        from: "Улучшение юзабилити 3",
        id: 3
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 0.8,
        when: 1,
        from: "Улучшение юзабилити 1",
        id: 3
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 0.8,
        when: 2,
        from: "Улучшение юзабилити 2",
        id: 3
      }
    ]
  },
  {
    id: 4,
    title: "Реклама в соцсетях",
    text:
      "Трафик по рекламе: 1й мес +4500. Стоимость привлечения: 1-3 мес - 1.1",
    coefs: [4500, 1.1],
    templateText:
      "Трафик по рекламе: 1й мес +@coef0. Стоимость привлечения: 1-3 мес - @coef1",
    cost: 25000,
    duration: 3,
    data_change: [
      {
        param: "socialsCount",
        operation: "+",
        change: 4500,
        when: 1,
        from: "Реклама в соцсетях 1",
        id: 4
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.1,
        when: 1,
        from: "Реклама в соцсетях 1",
        id: 4
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.1,
        when: 2,
        from: "Реклама в соцсетях 2",
        id: 4
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.1,
        when: 3,
        from: "Реклама в соцсетях 3",
        id: 4
      }
    ]
  },
  {
    id: 5,
    title: "PR-компания компании",
    text: "Стоимость привелечения: 1й - 1.3, 2й - 1.1, 3й - 1.2",
    coefs: [1.3, 1.1, 1.2],
    templateText:
      "Стоимость привелечения: 1й - @coef0, 2й - @coef1, 3й - @coef2",
    cost: 30000,
    duration: 3,
    data_change: [
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.3,
        when: 1,
        from: "PR-компания компании 1",
        id: 5
      },
      {
        param: "averageCheck",
        operation: "*",
        change: 1.1,
        when: 2,
        from: "PR-компания компании 2",
        id: 5
      },
      {
        param: "averageCheck",
        operation: "*",
        change: 1.2,
        when: 3,
        from: "PR-компания компании 3",
        id: 5
      }
    ]
  },
  {
    id: 6,
    title: "Контекстная рекламная компания",
    text:
      "Трафик из контекста: 1й мес- +6000 визитов, 2 и 3й - 1.1. Конверсия в звонки: 1й - 1.5. Стоимость привлечения: каждый мес -  1.3",
    coefs: [6000, 1.1, 1.5, 1.3],
    templateText:
      "Трафик из контекста: 1й мес - +@coef0 визитов, 2 и 3й - @coef1. Конверсия в звонки: 1й - @coef2. Стоимость привлечения: каждый мес - @coef3",
    cost: 35000,
    duration: 3,
    data_change: [
      {
        param: "contextCount",
        operation: "+",
        change: 6000,
        when: 1,
        from: "Контекстная рекламная компания 1",
        id: 6
      },
      {
        param: "contextCount",
        operation: "*",
        change: 1.1,
        when: 2,
        from: "Контекстная рекламная компания 2",
        id: 6
      },
      {
        param: "contextCount",
        operation: "*",
        change: 1.2,
        when: 3,
        from: "Контекстная рекламная компания 3",
        id: 6
      },
      {
        param: "contextCoef",
        operation: "*",
        change: 1.5,
        when: 1,
        from: "Контекстная рекламная компания 1",
        id: 6
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.3,
        when: 1,
        from: "Контекстная рекламная компания 1",
        id: 6
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.3,
        when: 2,
        from: "Контекстная рекламная компания 2",
        id: 6
      },
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.3,
        when: 3,
        from: "Контекстная рекламная компания 3",
        id: 6
      }
    ]
  },
  {
    id: 7,
    title: "Размещение информации в справочниках",
    text: "Трафик type-in: 1-3й - 1,2. ",
    cost: 20000,
    oneOff: true,
    duration: 3,
    data_change: [
      {
        param: "straightCount",
        operation: "*",
        change: 1.2,
        when: 1,
        from: "Размещение информации о компании в справочниках 1",
        id: 7
      },
      {
        param: "straightCount",
        operation: "*",
        change: 1.2,
        when: 2,
        from: "Размещение информации о компании в справочниках 2",
        id: 7
      },
      {
        param: "straightCount",
        operation: "*",
        change: 1.2,
        when: 3,
        from: "Размещение информации о компании в справочниках 3",
        id: 7
      }
    ]
  }
];

module.exports = cards;
