import clipboardy from "clipboardy";

type CommandDefinition = {
  name: string;
  description: string;
  action: (...rest: any) => any;
  options?: string[][];
};

const commandAdder = (program: any) => ({
  name,
  description,
  action,
  options
}: CommandDefinition) => {
  program.command(name).description(description);

  if (options && options.length > 0) {
    options.forEach(option => {
      program.option(...option);
    });
  }

  return program.action(action);
};

const addJiraCommand = (program: any) => {
  // const add = commandAdder(program);
  // add({
  //   name: "jira [tickets...]",
  //   description:
  //     "Creates a url URL for the ticket number and copies it to your clipboard",
  //   action: (tickets: string[], command) => {
  //     // const [command] = args.slice(-1); // Last arg is the command description.
  //     // const numbers = args.slice(0, -1);
  //     console.log(tickets);
  //   },
  //   options: [["-b --base", "Set a base string for the ticket."]]
  // });

  program
    .command("jira [tickets...]")
    .description(
      "Creates a URL for the ticket number and copies it to your clipboard"
    )
    .option("-b --base [url]", "Set a url base for the ticket.")
    .action(async (tickets: string[], command: any) => {
      if (!tickets.length) {
        console.log("Enter a ticket number.");
        command.help();
        return;
      }

      console.log(tickets);
      const base = command.base || "http://jira.com/";
      const url = `${base}/browse/${tickets[0]}`;
      await clipboardy.write(url);

      console.log(`${url} added to clipboard.`);
    });
};

const initializeProgram = () => {
  const program = require("commander");
  const { version } = require("../../package.json");

  program.name("leo");
  program.version(version);
  program.option("-d, --debug", "Output options for easier debugging.");

  addJiraCommand(program);

  program.parse(process.argv);

  if (!program.args.length) program.help();
  if (program.debug) console.log(program.opts());

  return program;
};

export default initializeProgram;
