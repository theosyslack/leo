import open from "open";
import log from "../common/log";
import program from "commander";
import { DATABASE_PATH } from "../common/consts";
import * as autocomplete from "../commands/autocomplete";
import * as jira from "../commands/jira";

const initializeProgram = async () => {
  const { version } = require("../../package.json");

  program.name("leo");
  program.version(version);
  program.option("-d, --debug", "Output options for easier debugging.");
  program.option("-o, --open-database", "Open the location of the database.");

  autocomplete.add(program);
  jira.add(program);

  program.parse(process.argv);

  if (program.debug) {
    log(JSON.stringify(program.opts()), "success");
    return;
  }
  if (program.openDatabase) {
    log("Opening Database Folder in Finder...", "pending");
    log(DATABASE_PATH, "success");
    open(DATABASE_PATH);
    return;
  }
  if (!program.args.length) program.help();

  return program;
};

export default initializeProgram;
