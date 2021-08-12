module.exports = function(req, res, next) {
  res.status(404).send({
    status: 404,
    message: "Путь " + req.originalUrl + " не найден!"
  });
};
