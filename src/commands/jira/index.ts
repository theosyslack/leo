import inquirer from "inquirer";
import autocomplete from "inquirer-autocomplete-prompt";
import { askForTicket } from "./askForTicket";
import { askToCreateNewTicket } from "./askToCreateNewTicket";

const action = async (__: any, command: any) => {
  inquirer.registerPrompt("command", command);
  inquirer.registerPrompt("autocomplete", autocomplete);

  let ticket = await askForTicket();

  if (typeof ticket === "undefined") {
    ticket = await askToCreateNewTicket();
  }
};

export const add = (program: any) => {
  program
    .command("jira [ticket]")
    .description(
      "Creates a URL for the ticket number and copies it to your clipboard"
    )
    .option("-o --open", "Open the link, instead of copying it.")
    .action(action);
};
