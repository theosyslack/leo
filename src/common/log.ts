import chalk from "chalk";
type LogType = "default" | "success" | "pending" | "error";

type Loggable = string | Object;

const LOG_TYPES = {
  default: (message: Loggable) => console.log(chalk.green(message.toString())),
  success: (message: Loggable) => console.log(chalk.green(message.toString())),
  pending: (message: Loggable) => console.log(chalk.yellow(message.toString())),
  error: (message: Loggable) => console.log(chalk.red.bold(message.toString()))
};

export default (message: Loggable, type?: LogType) => {
  if (!type) {
    console.log(message);
  } else {
    const styledLog = LOG_TYPES[type];
    if (!styledLog) throw new Error("No style found");

    styledLog(message);
  }
};
