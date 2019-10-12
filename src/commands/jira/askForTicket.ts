import log from "../../common/log";
import { askToCreateNewTicket } from "./askToCreateNewTicket";
import fuzzy, { FilterResult } from "fuzzy";
import * as inquirer from "inquirer";
import { copyTicketToClipboard, getTicketInfo } from ".";
import { getHistory } from "./getHistory";

const filterTicketsByString = (
  input: string,
  tickets: Ticket[]
): FilterResult<Ticket>[] => {
  return fuzzy.filter(input, tickets, {
    extract: convertTicketToString
  });
};

export const getTicketsAsArray = async (): Promise<Ticket[]> => {
  const history = await getHistory();
  return Object.values(history);
};

const askForFirstTicket = async (): Promise<Ticket> => {
  log("Let's save your first ticket!", "success");
  return askToCreateNewTicket();
};

export const convertTicketToString = ticket => JSON.stringify(ticket);

const getAutocompleteResults = async (__: string, input = "") => {
  const tickets = await getTicketsAsArray();
  const results = filterTicketsByString(input, tickets);

  const resultStrings = results.map((result: FilterResult<Ticket>) => {
    const { number, description } = result.original;
    return `${number} (${description})`;
  });

  if (input === "") {
    return [`Create New Ticket`, ...resultStrings];
  } else {
    return [...resultStrings, `Create New Ticket`];
  }
};

const askForTicketSelection = async (): Promise<Ticket> => {
  const { ticketNumber } = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "ticketNumber",
      message: "Select a Ticket.",
      source: getAutocompleteResults
    }
  ]);
  const [index] = ticketNumber.split(" ");
  const ticket = await getTicketInfo(index);

  if (ticket != null) {
    copyTicketToClipboard({ ticket });
  }
  return ticket;
};

const hasTicketHistory = async () => {
  const tickets = await getTicketsAsArray();
  return tickets.length === 0;
};

export const askForTicket = async () => {
  if (await hasTicketHistory()) {
    return askForFirstTicket();
  } else {
    return askForTicketSelection();
  }
};
