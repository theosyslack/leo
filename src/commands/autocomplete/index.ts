import * as tabtab from "tabtab";
import { getHistory } from "../jira/getHistory";

const action = async () => {
  await tabtab
    .install({
      name: "leo",
      completer: "leo"
    })
    .catch(err => console.error("INSTALL ERROR", err));

  return;
};

export const add = (program: any) => {
  program
    .command("install-autocomplete")
    .description("Installs autocomplete for bash, zsh, and fish.")
    .action(action);
};
