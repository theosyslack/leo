import * as inquirer from "inquirer";
import log from "../../common/log";
import { URL } from "url";
import { JIRA_HISTORY_FILE_PATH } from "../../common/consts";
import { getHistory } from "./getHistory";

export const askToCreateNewTicket = async (): Promise<Ticket> => {
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
    log(`Thanks, I'll remember ${result.number} ticket for later.`, "success");
    return result;
  } else {
    console.clear();
    return askToCreateNewTicket();
  }
};
