import inquirer from "inquirer";
import autocomplete from "inquirer-autocomplete-prompt";
import { getHistory } from "./getHistory";
import { askForTicket } from "./askForTicket";
import { askToCreateNewTicket } from "./askToCreateNewTicket";
import log from "../../common/log";
import clipboardy from "clipboardy";

const getTicketByQuery = async (val: string): Promise<Ticket|null> => {
  const ticket: [string, Ticket] = Object.entries(await getHistory())
    .find(([ticketNumber, ticket]) => ticketNumber === val || ticket.aliases.includes(val));

  return ticket != null ? ticket[1] : null;
};

export const getTicketInfo = async (
  ticketNumber: TicketNumber
): Promise<Ticket> => {
  const collection = await getHistory();
  return collection[ticketNumber];
};

export const copyTicketToClipboard = async ({
  ticket,
  ticketNumber
}: TicketQuery) => {
  if (ticketNumber && !ticket) {
    ticket = await getTicketInfo(ticketNumber);
  }

  await clipboardy.write(ticket.url);
  log(`Copied ${ticket.url} to clipboard.`, "success");
};

const action = async (query: string, command: any) => {
  inquirer.registerPrompt("command", command);
  inquirer.registerPrompt("autocomplete", autocomplete);

  if (query != "" && query != null) {
    const ticket = await getTicketByQuery(query);

    if (ticket != null) {
      return await copyTicketToClipboard({
        ticket,
        ticketNumber: ticket.number
      });
    }
  }

  let ticket = await askForTicket();

  if (typeof ticket === "undefined") {
    await askToCreateNewTicket();
  }
};

export const add = (program: any) => {
  program
    .command("jira [ticket]", { isDefault: true })
    .description(
      "Creates a URL for the ticket number and copies it to your clipboard"
    )
    .option("-o --open", "Open the link, instead of copying it.")
    .action(action);
};
