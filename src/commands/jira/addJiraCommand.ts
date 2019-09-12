import action from "./jiraAction";

const addJiraCommand = (program: any) => {
  program
    .command("jira [ticket]")
    .description(
      "Creates a URL for the ticket number and copies it to your clipboard"
    )
    .option("-b --base [url]", "Set a url base for the ticket.")
    .action(action);
};

export default addJiraCommand;
