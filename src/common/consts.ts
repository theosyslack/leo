import * as path from "path";
import { homedir } from "os";

export const DATABASE_PATH = path.resolve(homedir(), ".leo", "db/");

export const JIRA_HISTORY_FILE_PATH = path.resolve(
  DATABASE_PATH,
  "./jira/history.json"
);
