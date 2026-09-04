export interface Opportunity {
  id: string;
  title: string;
  team: string;
  location: string;
  seniority: "Junior" | "Mid" | "Senior" | "Lead";
  tags: string[];
  postedDate: string; // ISO date
  employmentType: string;
  description: string;
  responsibilities: string[];
  contact: string;
}

export type SortKey = "title" | "team" | "location" | "seniority" | "postedDate";
export type SortDirection = "ascending" | "descending";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}
