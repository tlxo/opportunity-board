import { useMemo, useState } from "react";
import styled from "styled-components";
import { allTags, opportunities } from "./data";
import type { SortState } from "./types";
import { ComboboxFilter } from "./components/ComboboxFilter";
import { OpportunityTable } from "./components/OpportunityTable";

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  color: #1f2933;
`;

const SkipLink = styled.a`
  position: absolute;
  left: -999px;
  top: auto;
  background: #1a5fb4;
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  z-index: 100;

  &:focus {
    left: 1rem;
    top: 1rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  margin: 0 0 0.4rem;
`;

const Subtitle = styled.p`
  color: #52606d;
  margin: 0;
  max-width: 60ch;
`;

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

export default function App() {
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({ key: "postedDate", direction: "descending" });

  const filtered = useMemo(() => {
    const base = tagFilter
      ? opportunities.filter((o) => o.tags.includes(tagFilter))
      : opportunities;

    const sorted = [...base].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      const comparison = aVal.localeCompare(bVal);
      return sort.direction === "ascending" ? comparison : -comparison;
    });

    return sorted;
  }, [tagFilter, sort]);

  return (
    <>
      <SkipLink href="#main">Skip to opportunities</SkipLink>
      <Page>
        <Header>
          <Title>Open Opportunities</Title>
          <Subtitle>
            A small accessible-by-default table and filter, built as a portfolio
            piece: React, TypeScript, and styled-components, with keyboard and
            screen-reader support designed in from the start rather than
            patched on afterward.
          </Subtitle>
        </Header>

        <main id="main">
          <Toolbar>
            <ComboboxFilter
              label="Filter by tag"
              options={allTags}
              value={tagFilter}
              onChange={setTagFilter}
            />
            <ResultCount>
              Showing {filtered.length} of {opportunities.length} opportunities
            </ResultCount>
          </Toolbar>

          <OpportunityTable opportunities={filtered} sort={sort} onSortChange={setSort} />
        </main>
      </Page>
    </>
  );
}
