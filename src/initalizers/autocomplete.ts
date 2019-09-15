import { map } from "ramda";
import * as tabtab from "tabtab";
import { getTicketsAsArray } from "../commands/jira/askForTicket";
import { getNumberFromTicket } from "../common/getNumberFromTicket";

export const installAutocomplete = async () => {
  await tabtab
    .install({
      name: "leo",
      completer: "leo"
    })
    .catch(err => console.error("INSTALL ERROR", err));

  return;
};

const completion = async env => {
  if (!env.complete) return;

  switch (env.prev) {
    case "leo":
      tabtab.log(["jira"]);
      return;
    case "jira":
      const suggestions = map(getNumberFromTicket, await getTicketsAsArray());
      return tabtab.log(suggestions);
  }
};

const initializeAutocomplete = async () => {
  const env = tabtab.parseEnv(process.env);
  return completion(env);
};

export default initializeAutocomplete;
