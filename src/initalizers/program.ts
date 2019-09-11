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
