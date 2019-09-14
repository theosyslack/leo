import * as file from "../../common/files";
import { JIRA_HISTORY_FILE_PATH } from "../../common/consts";

export const getHistory = async (): Promise<TicketCollection> => {
  if (await file.exists(JIRA_HISTORY_FILE_PATH)) {
    return JSON.parse(
      await file.getContents(JIRA_HISTORY_FILE_PATH)
    ) as TicketCollection;
  } else {
    file.writeObjectToFile(JIRA_HISTORY_FILE_PATH, {});
    return {};
  }
};
