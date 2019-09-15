import inquirer from "inquirer";
import autocomplete from "inquirer-autocomplete-prompt";
import { getHistory } from "./getHistory";
import { askForTicket } from "./askForTicket";
import { askToCreateNewTicket } from "./askToCreateNewTicket";
import log from "../../common/log";
import clipboardy from "clipboardy";

export const isValidTicketNumber = async (
  ticketNumber: TicketNumber
): Promise<boolean> => {
  if (ticketNumber === "") return false;

  const validKeys = await getTicketNumbers();
  return validKeys.includes(ticketNumber);
};

export const getTicketNumbers = async () => {
  return Object.keys(await getHistory());
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

const action = async (ticketNumber: string, command: any) => {
  inquirer.registerPrompt("command", command);
  inquirer.registerPrompt("autocomplete", autocomplete);
  if (await isValidTicketNumber(ticketNumber)) {
    return await copyTicketToClipboard({ ticketNumber });
  }

  let ticket = await askForTicket();

  if (typeof ticket === "undefined") {
    ticket = await askToCreateNewTicket();
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
