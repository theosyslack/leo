import * as tabtab from "tabtab";
import { getHistory } from "../commands/jira/getHistory";

const completion = async env => {
  if (!env.complete) return;
  if (env.prev === "leo") {
    tabtab.log(["jira"]);
    return;
  }

  if (env.prev === "jira") {
    const keys = Object.keys(await getHistory());
    return tabtab.log(keys);
  }
};

const initializeAutocomplete = async () => {
  const env = tabtab.parseEnv(process.env);
  return completion(env);
};

export default initializeAutocomplete;
