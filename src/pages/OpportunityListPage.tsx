import { useMemo } from "react";
import styled from "styled-components";
import { allTags, opportunities } from "../data";
import { serializeListState, type ListState } from "../listState";
import type { SortState } from "../types";
import { ComboboxFilter } from "../components/ComboboxFilter";
import { OpportunityTable } from "../components/OpportunityTable";

const Toolbar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const ResultCount = styled.p`
  margin: 0;
  color: #52606d;
  font-size: 0.9rem;
`;

interface OpportunityListPageProps {
  listState: ListState;
  onListStateChange: (next: ListState) => void;
  focusOpportunityId: string | null;
  onFocusRestored: () => void;
}

export function OpportunityListPage({
  listState,
  onListStateChange,
  focusOpportunityId,
  onFocusRestored,
}: OpportunityListPageProps) {
  const { tag, sort } = listState;

  const filtered = useMemo(() => {
    const base = tag ? opportunities.filter((o) => o.tags.includes(tag)) : opportunities;

    return [...base].sort((a, b) => {
      const comparison = a[sort.key].localeCompare(b[sort.key]);
      return sort.direction === "ascending" ? comparison : -comparison;
    });
  }, [tag, sort]);

  const search = serializeListState(listState);

  return (
    <>
      <Toolbar>
        <ComboboxFilter
          label="Filter by tag"
          options={allTags}
          value={tag}
          onChange={(next: string | null) => onListStateChange({ ...listState, tag: next })}
        />
        <ResultCount>
          Showing {filtered.length} of {opportunities.length} opportunities
        </ResultCount>
      </Toolbar>

      <OpportunityTable
        opportunities={filtered}
        sort={sort}
        onSortChange={(next: SortState) => onListStateChange({ ...listState, sort: next })}
        focusOpportunityId={focusOpportunityId}
        onFocusRestored={onFocusRestored}
        detailHref={(op) => `/opportunities/${op.id}${search}`}
      />
    </>
  );
}
