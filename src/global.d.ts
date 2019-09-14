type TicketNumber = string;
type TicketBase = string;
type TicketUrl = string;
type TicketDescription = string;

interface Ticket {
  number: TicketNumber;
  base: TicketBase;
  url: TicketUrl; // url = base + number
  description?: TicketDescription;
}

interface TicketCollection {
  [key: string]: Ticket;
}

interface CommandDefinition {
  name: string;
  description: string;
  action: (...rest: any) => any;
  options?: string[][];
}
