const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const JWTCONFIG = require("../../secret.config");
const db = require("../../models/index");
const { logRestApiError } = require("../../global_functions/logs");

function addId(arr) {
  return arr.map(function(obj, index) {
    return Object.assign({}, obj, { id: index });
  });
};

router.get('/rate', async (req, res) => {
  try {
    await jwt.verify(
      req.headers.authorization,
      JWTCONFIG.SECRET,
      async (err, decoded) => {
        if (err) {
          res.status(401).send({
            status: 401,
            message: "Вы не авторизованы!"
          });
        } else {
          let winners = await db.Winner.findAll({
            attributes: ['user_id', 'place'],
            include: [
              {
                model: db.User,
                as: "winners_user",
                attributes: ['name']
              }
            ]
          })
          newWinners = []
          count = [10, 5, 2]
          winners.forEach((winner, i) => {
            username = winner.winners_user ? 
                       winner.winners_user.name : 
                       'Deleted user'
            index = newWinners.findIndex(a => a.name == username)
            if (index != -1) {
              newWinners[index].rate += count[winner.place - 1]
              newWinners[index][(winner.place).toString()] += 1
              newWinners[index].count += 1
            } else {
              newWinners.push({
                user_id: i,
                name: username,
                rate: count[winner.place - 1],
                '1': 0,
                '2': 0,
                '3': 0,
                count: 1
              })
              newWinners[newWinners.length - 1][(winner.place).toString()] += 1
            }
          });
          newWinners = newWinners.sort((a, b) => {
            if (a.rate < b.rate)
              return 1
            if (a.rate > b.rate)
              return -1
            return 0
          })
          newWinners = addId(newWinners)
          res.send(newWinners)
        }
      }
    );
  } catch (error) {
    logRestApiError("rooms", error);
    res.status(500).send({
      status: 500,
      message: "Ошибка создания комнаты!"
    });
  }
})




module.exports = router