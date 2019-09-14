import log from "../../common/log";
import { getHistory } from "./getHistory";
import { askToCreateNewTicket } from "./askToCreateNewTicket";
import * as fuzzy from "fuzzy";
import * as inquirer from "inquirer";
import * as clipboardy from "clipboardy";

export const askForTicket = async () => {
  const history = await getHistory();
  const tickets: Ticket[] = Object.values(history);
  if (tickets.length === 0) {
    console.clear();
    log("Let's save your first ticket!", "success");
    return askToCreateNewTicket();
  }
  const { ticketNumber } = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "ticketNumber",
      message: "Select a Ticket.",
      source: async (__: any, input = "") => {
        const extract = ({ number, description }: Ticket) =>
          `${number} ${description}`;
        const results = fuzzy.filter(input, tickets, {
          extract
        });
        const resultStrings = results.map((result: any) => {
          return result.string;
        });
        if (input === "") {
          return [`Create New Ticket`, ...resultStrings];
        } else {
          return [...resultStrings, `Create New Ticket`];
        }
      }
    }
  ]);
  const [index] = ticketNumber.split(" ");
  const ticket = history[index];
  log(`Copied ${ticket.url} to clipboard.`, "success");
  await clipboardy.write(ticket.url);
  return ticket;
};
