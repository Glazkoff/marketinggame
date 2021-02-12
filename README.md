# IMGame - игра для обучения профессии интернет-маркетолога

**IMGame** - это проект о геймификации профессионального обучения, разрабатываемый студентами Московского политеха (сотрудниками студенческой веб-студии Поливеб) совместно с Центром интернет-маркетинга Екатерины Шукаловой. 

## Формулировка решаемой проблемы 

Особенностями разработки является то, что в распоряжении команды имеется сырой прототип, демонстрирующий основные игровые модели и механики. Однако он является сырым MVP, который требует доработки и решения технического долга, доработки функционала и продвижения. 

## Цель проекта

Исправление ошибок продукта до версии, пригодной к применению на практике

## Задачи по проекту

| _№_ |         _Даты_          |                                   _Планы и задачи_                                        |
| :-- | :---------------------- | :---------------------------------------------------------------------------------------: |
|  1  | 16 ноября - 22 ноября   |          Изучение технологий, ручное тестирование, анализ кода имеющейся версии           |
|  2  | 23 ноября - 29 ноября   |    Подготовка документации, USM, анализ игровой логики, Планирование хода разработки      |
|  3  | 30 ноября - 6 декабря   |          Корректировка вёрстки, интерфейса. Исправление функциональных недочетов          |
|  4  | 7 декабря - 13 декабря  |              Исправление функциональных недочетов, исправление игровой логики             |
|  5  | 14 декабря - 20 декабря |    Исправление нефункциональных недочетов, исправление математических вычислений в игре   |
|  6  | 21 декабря - 27 декабря |               Окончание работ, отчёт, демонстрация исправленной версии игры               |

### Цель семестра разработки (лето-осень-зима 2020)

Исправление ошибок продукта до версии, пригодной к применению на практике, составление документации.

## Участники

| _Участники_            | _Учебная группа_ |                                          _Роли_                                           |
| :--------------------- | :--------------- | :---------------------------------------------------------------------------------------: |
| **Никита Глазков**     | 181-321          |            Product Owner, техлид, fullstack-разработчик, идейный вдохновитель             |
| **Расулов Гасанбег**   | 181-361          |                              техлид, fullstack-разработчик                                |
| **Кудрякова Ксения**   | 181-323          |                              техлид, fullstack-разработчик                                |
| **Громова Ирина**      | 191-321          |                                   frontend-разработчик                                    |
| **Савченко Анастасия** | 191-321          |                              менеджер, frontend-разработчик                               |
| **Османова Карина**    | 191-321          |                              менеджер, frontend-разработчик                               |
| **Свобода Павел**      | 181-361          |                               менеджер,backend-разработчик                                |
| **Сычев Роман**        | 191-322          |                              менеджер, frontend-разработчик                               |
| **Бодур Эййюб**        | 201-321          |                                    backend-разработчик                                    |
| **Воробьёв Владислав** | 201-321          |                                    backend-разработчик                                    |
| **Тыртычный Владислав**| 201-322          |                                    backend-разработчик                                    |
| **Жидов Артём**        | 201-322          |                                   frontend-разработчик                                    |
| **Тян Артём**          | 201-321          |                              менеджер, frontend-разработчик                               |
| **Хусаинов Ренат**     | 201-321          |                                   frontend-разработчик                                    |
| **Черникова Софья**    | 201-321          |                                     менеджер, дизайнер                                    |
| **Шунаева Екатерина**  | 201-321          |                                   frontend-разработчик                                    |


## Ссылки

[Лендинг](http://pd-2020-2.std-941.ist.mospolytech.ru/)

##### Наши соцсети

[ВК](https://vk.com/polyweb.agency)
[Instagram](https://www.instagram.com/polyweb.agency/?igshid=1j4ew1aia0hbx)
[Facebook](https://www.facebook.com/groups/237597147284409)


## Используемые в проекте библиотеки, фреймворки и технологии

### Фронтенд

- Vue.js
- Vue Router
- Vuex
- Vuelidate
- Webpack
- ESLint + Prettier

### Бэкенд

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- bcrypt
- JWT

### Менеджмент 
- Poly-gile (Agile + Scrum + Kanban + PMBOK)
- User Story Mapping (Miro)
- Atlassian Jira


---

## Установка проекта

```
npm install
npm run build
node ./server/server.js

Проект будет запущен на http://localhost:3001/ (по-умолчанию)
```

### Компиляция и хот-релоад для разработки

```
npm run serve
```

### Компиляция и минификация для продкшена

```
npm run build
```

### Запустить unit-тесты

```
npm run test:unit
```

### Запустить end-to-end тесты

```
npm run test:e2e
```

### Исправление и проверка красоты кода

```
npm run lint
```

### ДОБАВЛЕН ДОМЕН ДЛЯ ТЕСТИРОВАНИЯ! ПРИВЯЗАНА ВЕТКА test


---

## v1.2
- Используется инструмент sequelize-cli
  - [Документация sequelize-cli](https://sequelize.org/v5/manual/migrations.html)
  - Установите пакет pg глобально! 
```
npm i -g pg
```
- [Типы данных Sequelize](https://sequelize.org/v5/manual/data-types.html)


### ОШИБКИ
- Несостыковка обработки объекта winners (теперь через таблицу БД, объект в другом формате)


---

# Реорганизация REST API

# Основное - /api

## /admin

### /events
- [x] get /api/admin/events
- [x] post /api/admin/events/:id
- [x] put /api/admin/events/:id/description

### /cards
- [x] get /api/admin/cards
- [] post /api/admin/cards
- [x] post /api/admin/cards/:id
- [] delete /api/admin/cards/:id
- [] post /api/admin/cards/:id/oneoff
- [] put /api/admin/cards/:id/is_draft
- [] put /api/admin/cards/:id/description

### /users
- [x] get /api/admin/users/count
- [x] get /api/admin/users/list/:offset
- [x] delete /api/admin/users/login/:login
- [x] delete /api/admin/users/id/:id

### /config
- [x] post,get /api/admin/config

### /rooms
- [x] get /api/admin/rooms
- [x] get /api/admin/rooms/:id
- [x] get /api/admin/rooms/:id/users

---

## /reviews
- [x] get, post "/api/reviews
- [x] get /api/reviews/:id
- [x] delete /api/reviews/:id

## /cards  
- [x] get /api/cards
- [x] get /api/cards/id/:id
- [x] get /api/cards/oneoff

## /auth
- [x] post /api/auth/login
- [x] post /api/auth/register

## /rooms  

- [x] post /api/rooms
- [x] post /api/rooms/join/:id
- [x] get /api/rooms/reset

## /default
- [x] get /api/default/room

## /personal
- [x] get /api/personal/lastroom



 