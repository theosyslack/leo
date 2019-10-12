type TicketNumber = string;
type TicketBase = string;
type TicketUrl = string;
type TicketDescription = string;

interface Ticket {
  number: TicketNumber;
  base: TicketBase;
  url: TicketUrl; // url = base + number
  description?: TicketDescription;
  aliases: Array<String>;
}

interface TicketCollection {
  [key: string]: Ticket;
}

interface TicketQuery {
  ticket?: Ticket;
  ticketNumber?: TicketNumber;
}

interface CommandDefinition {
  name: string;
  description: string;
  action: (...rest: any) => any;
  options?: string[][];
}
