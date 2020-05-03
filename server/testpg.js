const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const Pool = require("pg").Pool;

const hostname = "127.0.0.1";
const port = 3000;
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const pool = new Pool({
  user: "polywebage",
  host: "pg2.sweb.ru",
  database: "polywebage",
  password: "Polyweb2020",
  port: 5432
});

pool.query("SELECT * FROM test", (err, res) => {
  console.log(err, res.rows);
  pool.end();
});

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Добро пожаловать на API путь по умолчанию!"
  })
);

app.listen(port, hostname, () => {
  console.log(`Сервер запущен http://${hostname}:${port}/`);
});
