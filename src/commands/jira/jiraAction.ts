import fuzzy from "fuzzy";
import inquirer from "inquirer";
import log from "../../common/log";
import clipboardy from "clipboardy";
import { fileURLToPath, URL } from "url";
import * as file from "../../common/files";
import command from "inquirer-command-prompt";
import autocomplete from "inquirer-autocomplete-prompt";
import { JIRA_HISTORY_FILE_PATH } from "../../common/consts";

type TicketNumber = string;
type TicketBase = string;
type TicketUrl = string;
type TicketDescription = string;

type Ticket = {
  number: TicketNumber;
  base: TicketBase;
  url: TicketUrl; // url = base + number
  description?: TicketDescription;
};

type TicketCollection = {
  [key: string]: Ticket;
};

const getHistory = async (): Promise<TicketCollection> => {
  if (await file.exists(JIRA_HISTORY_FILE_PATH)) {
    return JSON.parse(
      await file.getContents(JIRA_HISTORY_FILE_PATH)
    ) as TicketCollection;
  } else {
    file.writeObjectToFile(JIRA_HISTORY_FILE_PATH, {});
    return {};
  }
};

const askForTicket = async () => {
  const history = await getHistory();
  const tickets: Ticket[] = Object.values(history);
  const result = await inquirer.prompt([
    {
      type: "autocomplete",
      name: "number",
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
  const [index] = result.number.split(" ");
  return history[index];
};

const askToCreateNewTicket = async (): Promise<Ticket> => {
  console.clear();
  let result: Ticket;

  const { url, description } = await inquirer.prompt([
    {
      type: "text",
      name: "url",
      message: "What's the URL?",
      validate: (input: string) => {
        try {
          let url = new URL(input);

          if (!input.includes("browse/")) {
            return "JIRA URLs contain 'browse/'";
          }

          return true;
        } catch (e) {
          return `${input} is not a URL.`;
        }
      }
    },
    {
      type: "text",
      name: "description",
      message: "Add a description:"
    }
  ]);

  const [base, number] = url.split("browse/");

  result = {
    base: base + "browse/",
    url,
    number,
    description
  };

  log(result);

  const { isConfirmed } = await inquirer.prompt({
    type: "confirm",
    name: "isConfirmed",
    message: "Does that look right?"
  });

  if (isConfirmed) {
    const history = await getHistory();

    const updatedHistory = Object.assign({}, history, {
      [result.number]: result
    });

    file.writeObjectToFile(JIRA_HISTORY_FILE_PATH, updatedHistory);

    return result;
  } else {
    return askToCreateNewTicket();
  }
};

const action = async () => {
  console.clear();
  inquirer.registerPrompt("command", command);
  inquirer.registerPrompt("autocomplete", autocomplete);

  let ticket = await askForTicket();

  if (typeof ticket === "undefined") {
    ticket = await askToCreateNewTicket();
  }

  log(`Copied ${ticket.url} to clipboard.`, "success");
  await clipboardy.write(ticket.url);
};
export default action;
