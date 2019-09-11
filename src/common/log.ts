import chalk from "chalk";
type LogType = "default" | "table" | "success" | "pending" | "error";

const { log, table, clear } = console;

const LOG_TYPES = {
  default: (message: string) => log(chalk.green(message)),
  table: (message: string) => table(message),
  success: (message: string) => log(chalk.green(message)),
  pending: (message: string) => log(chalk.yellow(message)),
  error: (message: string) => log(chalk.red.bold(message))
};

export { clear };

export default (message: string, type?: LogType) => {
  if (!type) {
    log(message);
  } else {
    const styledLog = LOG_TYPES[type];
    if (!styledLog) throw new Error("No style found");

    styledLog(message);
  }
};
