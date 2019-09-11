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
    .action();
};

export default addJiraCommand;
