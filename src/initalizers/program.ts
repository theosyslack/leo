const initializeProgram = () => {
  const program = require("commander");
  const { version } = require("../../package.json");

  program.version(version);
  program.option("-d, --debug", "Output options for easier debugging.");

  program.parse(process.argv);

  if (program.debug) console.log(program.opts());

  return program;
};

export default initializeProgram;
