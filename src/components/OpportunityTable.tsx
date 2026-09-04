import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styled from "styled-components";
import type { Opportunity, SortDirection, SortKey, SortState } from "../types";
import { Link } from "../router";
import { VisuallyHidden } from "./VisuallyHidden";

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid #d3dae0;
  border-radius: 8px;

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: 2px;
  }
`;
 
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  min-width: 640px;
`;

const Th = styled.th`
  text-align: left;
  background: #f4f6f8;
  border-bottom: 2px solid #d3dae0;
  padding: 0;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: none;
  border: none;
  font: inherit;
  font-weight: 600;
  color: #1f2933;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #e9edf1;
  }

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: -3px;
  }
`;

const SortIcon = styled.span`
  font-size: 0.75rem;
  color: #52606d;
  /* aria-hidden — the accessible sort state lives on aria-sort, not this glyph */
`;

const Td = styled.td`
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid #e4e9ec;
  color: #1f2933;
`;

const Row = styled.tr`
  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: -3px;
  }
`;

const TitleLink = styled(Link)`
  color: #1a5fb4;
  font-weight: 600;
  text-decoration: underline;

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: 2px;
    border-radius: 3px;
  }
`;

const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tag = styled.li`
  background: #e4edf7;
  color: #1a5fb4;
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
`;

const EmptyState = styled.p`
  padding: 1.5rem;
  color: #52606d;
  text-align: center;
`;

const VisuallyHiddenCaption = styled.caption`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

interface Column {
  key: SortKey;
  label: string;
}

const columns: Column[] = [
  { key: "title", label: "Role" },
  { key: "team", label: "Team" },
  { key: "location", label: "Location" },
  { key: "seniority", label: "Seniority" },
  { key: "postedDate", label: "Posted" },
];

interface OpportunityTableProps {
  opportunities: Opportunity[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  /** Detail page we just returned from; its row link regains focus. */
  focusOpportunityId?: string | null;
  onFocusRestored?: () => void;
  detailHref: (opportunity: Opportunity) => string;
}

function nextDirection(current: SortDirection): SortDirection {
  return current === "ascending" ? "descending" : "ascending";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Accessible sortable table. Sort state is exposed via aria-sort on each
 * <th> (not just visually, via an icon), and every sort action is announced
 * through a visually-hidden aria-live region so screen reader users get the
 * same feedback as sighted users watching the icon flip.
 */
export function OpportunityTable({
  opportunities,
  sort,
  onSortChange,
  focusOpportunityId,
  onFocusRestored,
  detailHref,
}: OpportunityTableProps) {
  const [activeRow, setActiveRow] = useState(0);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  linkRefs.current.length = opportunities.length;

  function handleSort(key: SortKey) {
    if (sort.key === key) {
      onSortChange({ key, direction: nextDirection(sort.direction) });
    } else {
      onSortChange({ key, direction: "ascending" });
    }
  }

  // Roving tabindex: one row link is tab-stoppable at a time, arrows move between rows
  const effectiveActiveRow = Math.min(activeRow, Math.max(0, opportunities.length - 1));

  function focusRow(index: number) {
    const clamped = Math.max(0, Math.min(opportunities.length - 1, index));
    setActiveRow(clamped);
    linkRefs.current[clamped]?.focus();
  }

  useEffect(() => {
    if (!focusOpportunityId) return;
    const index = opportunities.findIndex((o) => o.id === focusOpportunityId);
    // The row may have been filtered out in the meantime; fall back to the first one.
    const target = index >= 0 ? index : 0;
    setActiveRow(target);
    linkRefs.current[target]?.focus();
    onFocusRestored?.();
  }, [focusOpportunityId, opportunities, onFocusRestored]);

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusRow(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusRow(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusRow(0);
        break;
      case "End":
        event.preventDefault();
        focusRow(opportunities.length - 1);
        break;
    }
  }

  const activeColumn = columns.find((c) => c.key === sort.key);
  const announcement = activeColumn
    ? `Sorted by ${activeColumn.label}, ${sort.direction}. Showing ${opportunities.length} opportunit${
        opportunities.length === 1 ? "y" : "ies"
      }.`
    : "";

  return (
    // tabIndex: the wrapper scrolls horizontally, so it must be reachable by keyboard
    <TableWrapper role="region" aria-label="Open opportunities" tabIndex={0}>
      <Table>
        <VisuallyHiddenCaption>
          Open opportunities, sortable by role, team, location, seniority, or date posted
        </VisuallyHiddenCaption>
        <thead>
          <tr>
            {columns.map((col) => {
              const isActive = sort.key === col.key;
              const ariaSort = isActive ? sort.direction : "none";
              return (
                <Th key={col.key} scope="col" aria-sort={ariaSort}>
                  <SortButton type="button" onClick={() => handleSort(col.key)}>
                    {col.label}
                    <SortIcon aria-hidden="true">
                      {isActive ? (sort.direction === "ascending" ? "▲" : "▼") : "↕"}
                    </SortIcon>
                  </SortButton>
                </Th>
              );
            })}
            <Th scope="col">
              <VisuallyHidden>Tags</VisuallyHidden>
            </Th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((op, index) => (
            <Row
              key={op.id}
              onKeyDown={(event) => handleRowKeyDown(event, index)}
              onFocus={() => setActiveRow(index)}
            >
              <Td>
                <TitleLink
                  ref={(el: HTMLAnchorElement | null) => {
                    linkRefs.current[index] = el;
                  }}
                  to={detailHref(op)}
                  tabIndex={index === effectiveActiveRow ? 0 : -1}
                >
                  {op.title}
                </TitleLink>
              </Td>
              <Td>{op.team}</Td>
              <Td>{op.location}</Td>
              <Td>{op.seniority}</Td>
              <Td>
                <time dateTime={op.postedDate}>{formatDate(op.postedDate)}</time>
              </Td>
              <Td>
                <TagList>
                  {op.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </Td>
            </Row>
          ))}
        </tbody>
      </Table>

      {opportunities.length === 0 && (
        <EmptyState>No opportunities match the current filter.</EmptyState>
      )}

      <VisuallyHidden role="status" aria-live="polite">
        {announcement}
      </VisuallyHidden>
    </TableWrapper>
  );
}
