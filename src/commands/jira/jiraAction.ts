import clipboardy from "clipboardy";

const action = async (tickets: string[], command: any) => {
  if (!tickets.length) {
    console.log("Enter a ticket number.");
    return;
  }

  const base = command.base || "https://vikingtravel.atlassian.net";
  const url = `${base}/browse/${tickets[0]}`;
  await clipboardy.write(url);

  console.log(`${url} added to clipboard.`);
};
export default action;
