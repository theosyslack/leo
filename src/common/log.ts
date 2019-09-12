import chalk from "chalk";
type LogType = "default" | "table" | "success" | "pending" | "error";

const { log, table, clear } = console;

type Loggable = string | Object;

const LOG_TYPES = {
  default: (message: Loggable) => log(chalk.green(message)),
  table: (message: Loggable) => table(message),
  success: (message: Loggable) => log(chalk.green(message)),
  pending: (message: Loggable) => log(chalk.yellow(message)),
  error: (message: Loggable) => log(chalk.red.bold(message))
};

export { clear };

export default (message: Loggable, type?: LogType) => {
  if (!type) {
    log(message);
  } else {
    const styledLog = LOG_TYPES[type];
    if (!styledLog) throw new Error("No style found");

    styledLog(message);
  }
};
