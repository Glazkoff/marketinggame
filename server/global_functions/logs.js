const chalk = require("chalk");
let indentLength = 13;

module.exports = {
  // Логирует входящее событие сокета
  logSocketInEvent(eventName, message) {
    console.log(
      chalk.green("-- ") +
        chalk.yellow.bold(eventName + " ") +
        chalk.green("-".repeat(indentLength) + "> : ") +
        chalk.green(message)
    );
  },

  // Логирует исходящее событие сокета
  logSocketOutEvent(eventName, message) {
    console.log(
      chalk.magenta("<" + "-".repeat(indentLength) + " ") +
        chalk.blue.bold(eventName) +
        chalk.magenta(" -- : " + message)
    );
  },

  // Логирует исходящее событие сокета
  logSocketState(eventName, message) {
    console.log(
      chalk.blue(">" + "~".repeat(indentLength / 2) + " ") +
        chalk.red.bold(eventName) +
        chalk.blue(" " + "~".repeat(indentLength / 2) + "< : " + message)
    );
  },

  // Логирует ошибку сокета
  logSocketError(context, message) {
    console.log(
      chalk.bgRed("=".repeat(indentLength) + " ОШИБКА") +
        chalk.italic.red(" : [" + context + "] ") +
        chalk.underline.red(message)
    );
  },

  // Логирует ошибку сокета
  logRestApiError(context, message) {
    console.log(
      chalk.bgRed("=".repeat(indentLength) + " ОШИБКА REST API") +
        chalk.italic.red(" : [" + context + "] ") +
        chalk.underline.red(message)
    );
  },

  // Логирует общую ошибку
  logCommonError(context, message) {
    console.log(
      chalk.bgRed("=".repeat(indentLength) + " ОБЩАЯ ОШИБКА") +
        chalk.italic.red(" : [" + context + "] ") +
        chalk.underline.red(message)
    );
  }
};
