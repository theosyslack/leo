import * as inquirer from "inquirer";
import * as file from "../../common/files";
import log from "../../common/log";
import { URL } from "url";
import { JIRA_HISTORY_FILE_PATH } from "../../common/consts";
import { getHistory } from "./getHistory";
import { getTicketByAlias } from './index';

export const askToCreateNewTicket = async (): Promise<Ticket> => {
  let result: Ticket;
  const { url, description, aliases: aliasesString } = await inquirer.prompt([
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
    },
    {
      type: "text",
      name: "aliases",
      message: "Add comma-separated aliases for easy searching.",
      validate: async (input: string) => {
        if (input == null || input.trim() === "") {
          return true;
        }

        const aliases = input.split(",").map(str => str.trim());

        const mappedAliases: Array<string> = await Promise.all(aliases.map(async alias => {
          const ticket = await getTicketByAlias(alias);

          return (ticket != null) ? alias : null;
        }));
        const alreadyUsed = mappedAliases.filter(val => val != null);

        if (alreadyUsed.length > 0) {
          const usedAliases = alreadyUsed.join(", ");
          return `Aliases '${usedAliases}' are already in use.`;
        }

        return true;
      }
    }
  ]);

  const aliases = aliasesString.split(",").map(str => str.trim());
  const [base, number] = url.split("browse/");
  result = {
    base: base + "browse/",
    url,
    number,
    description,
    aliases: aliases
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
    log(`Thanks, I'll remember ${result.number} ticket for later.`, "success");
    return result;
  } else {
    console.clear();
    return askToCreateNewTicket();
  }
};
