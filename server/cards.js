let cards = [{
    id: 1,
    title: "Нанять SMM-менеджера",
    text: "Описание карточки, описание карточки",
    cost: 80000,
    duration: 3,
    dataChange: [{
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
    text: "Описание карточки, описание карточки",
    cost: 50000,
    duration: 3,
    dataChange: [{
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
    text: "Описание карточки, описание карточки",
    cost: 20000,
    duration: 3,
    dataChange: [{
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
    text: "Описание карточки, описание карточки",
    cost: 25000,
    duration: 3,
    dataChange: [{
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
    text: "Описание карточки, описание карточки",
    cost: 30000,
    duration: 3,
    dataChange: [{
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
    text: "Описание карточки, описание карточки",
    cost: 35000,
    duration: 3,
    dataChange: [{
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
    title: "Размещение информации о компании в справочниках",
    text: "Описание карточки, описание карточки",
    cost: 20000,
    duration: 3,
    dataChange: [{
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
