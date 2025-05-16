export type Guest = {
  id: string;
  name: string;
  ticketType: "pista" | "vip" | "cortesia";
  observations?: string;
  entered: boolean;
  createdAt: number;
  entryTime: number | null;
};

export type InsertGuest = {
  name: string;
  ticketType: "pista" | "vip" | "cortesia";
  observations?: string;
};

export type FilterType = "all" | "pista" | "vip" | "cortesia" | "entered";
