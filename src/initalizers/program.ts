import program from "commander";
import open from "open";
import * as tabtab from "tabtab";
import * as jira from "../commands/jira";
import { DATABASE_PATH } from "../common/consts";
import log from "../common/log";

const installAutocomplete = async () => {
  await tabtab
    .install({
      name: "leo",
      completer: "leo"
    })
    .catch(err => console.error("INSTALL ERROR", err));
  return;
};

const initializeProgram = async () => {
  const { version } = require("../../package.json");

  program.name("leo");
  program.version(version);
  program.option("-d, --debug", "Output options for easier debugging.");
  program.option("--open-database", "Open the location of the database.");
  program.option(
    "--install-autocomplete",
    "Installs autocomplete for bash, zsh, or fish."
  );

  jira.add(program);

  program.parse(process.argv);
  if (program.debug) {
    log(JSON.stringify(program.opts()), "success");
  }
  if (program.installAutocomplete) {
    await installAutocomplete();
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
