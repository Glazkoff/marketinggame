// Выгрузка карточек из файла по-умолчанию
const CARDS = require("../cards");

// Выгрузка событий из файла по умолчанию
const EVENTS = require("../events");

module.exports = {
  // Попытаться загрузить карточки по умолчанию
  async trySetCards(db) {
    for (let card of CARDS) {
      let findCard = await db.Card.findOne({
        where: {
          card_id: card.id
        }
      });
      if (findCard === null) {
        db.Card.create({
          card_id: card.id,
          title: card.title,
          text: card.text,
          cost: card.cost,
          coefs: card.coefs,
          templateText: card.templateText,
          duration: card.duration,
          data_change: card.data_change,
          oneOff: card.oneOff
        });
      }
    }
  },

  // Попытаться загрузить события по умолчанию
  async trySetEvents(db) {
    for (let event of EVENTS) {
      let findEvent = await db.Event.findOne({
        where: {
          event_id: event.id
        }
      });
      if (findEvent === null) {
        db.Event.create({
          event_id: event.id,
          title: event.title,
          description: event.description,
          data_change: event.data_change
        });
      }
    }
  }
};
