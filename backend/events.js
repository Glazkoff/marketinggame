let events = [
  {
    id: 1,
    title: "Выход на рынок нового конкурента",
    description: "Снижение всех видов трафика на 30%",
    data_change: [
      {
        param: "organicCount",
        operation: "*",
        change: 0.7,
        when: 0,
        event: true
      },
      {
        param: "contextCount",
        operation: "*",
        change: 0.7,
        when: 0,
        event: true
      },
      {
        param: "socialsCount",
        operation: "*",
        change: 0.7,
        when: 0,
        event: true
      },
      {
        param: "smmCount",
        operation: "*",
        change: 0.7,
        when: 0,
        event: true
      },
      {
        param: "straightCount",
        operation: "*",
        change: 0.7,
        when: 0,
        event: true
      }
    ]
  },
  {
    id: 2,
    title: "Изменение алгоритма поисковой машины",
    description:
      "Падение трафика из органической выдачи в первый месяц после изменения на 50% восстановление трафика к 3-му месяцу на уровень первого месяца",
    data_change: [
      {
        param: "organicCount",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      },
      {
        param: "organicCount",
        operation: "*",
        change: 2,
        when: 2,
        event: true
      }
    ]
  },
  {
    id: 3,
    title: "Изменение подрядчика по контекстной рекламе",
    description:
      "Увеличение реальной стоимости привлечения клиента на 5%, увеличение конверсии от контекстной рекламы на 30%",
    data_change: [
      {
        param: "realCostAttract",
        operation: "*",
        change: 1.05,
        when: 0,
        event: true
      },
      {
        param: "contextCoef",
        operation: "*",
        change: 1.3,
        when: 0,
        event: true
      }
    ]
  },
  {
    id: 4,
    title: "Ввод в эксплуатацию нового офисного здания рядом",
    description:
      "Увеличение трафика от канала прямого захода в первый месяц после этого в 3 раза и после этого во второй месяц увеличение конверсии в клиента на 5%",
    data_change: [
      {
        param: "straightCount",
        operation: "*",
        change: 3,
        when: 1,
        event: true
      },
      {
        param: "conversion",
        operation: "*",
        change: 1.05,
        when: 2,
        event: true
      }
    ]
  },
  {
    id: 5,
    title:
      "Появление серии негативных публикаций о компании и руководителе компании",
    description: "Снижение конверсии трафика в звонки на 50%",
    data_change: [
      {
        param: "organicCoef",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      },
      {
        param: "socialsCoef",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      },
      {
        param: "contextCoef",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      },
      {
        param: "smmCoef",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      },
      {
        param: "straightCoef",
        operation: "*",
        change: 0.5,
        when: 0,
        event: true
      }
    ]
  }
];

module.exports = events;
