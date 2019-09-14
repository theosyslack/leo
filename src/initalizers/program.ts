import * as jira from "../commands/jira";
import { DATABASE_PATH } from "../common/consts";
import program from "commander";
import { createFolderForFile } from "../common/files";
import open from "open";
import log from "../common/log";

const initializeProgram = async () => {
  const { version } = require("../../package.json");

  program.name("leo");
  program.version(version);
  program.option("-d, --debug", "Output options for easier debugging.");
  program.option("-o, --open-database", "Open the location of the database.");

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
