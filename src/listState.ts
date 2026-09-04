import { allTags } from "./data";
import type { SortDirection, SortKey, SortState } from "./types";

export interface ListState {
  tag: string | null;
  sort: SortState;
}

export const defaultSort: SortState = { key: "postedDate", direction: "descending" };

const sortKeys: SortKey[] = ["title", "team", "location", "seniority", "postedDate"];
const sortDirections: SortDirection[] = ["ascending", "descending"];

/** Query values are attacker-controlled, so every one is checked against an allowlist. */
export function parseListState(search: string): ListState {
  const params = new URLSearchParams(search);

  const rawTag = params.get("tag");
  const tag = rawTag !== null && allTags.includes(rawTag) ? rawTag : null;

  const rawKey = params.get("sort");
  const key = sortKeys.find((k) => k === rawKey) ?? defaultSort.key;

  const rawDir = params.get("dir");
  const direction = sortDirections.find((d) => d === rawDir) ?? defaultSort.direction;

  return { tag, sort: { key, direction } };
}

export function serializeListState(state: ListState): string {
  const params = new URLSearchParams();
  if (state.tag) params.set("tag", state.tag);
  if (state.sort.key !== defaultSort.key) params.set("sort", state.sort.key);
  if (state.sort.direction !== defaultSort.direction) params.set("dir", state.sort.direction);

  const query = params.toString();
  return query ? `?${query}` : "";
}
