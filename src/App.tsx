import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { opportunities } from "./data";
import { parseListState, serializeListState, type ListState } from "./listState";
import { navigate, useLocation } from "./router";
import { VisuallyHidden } from "./components/VisuallyHidden";
import { OpportunityListPage } from "./pages/OpportunityListPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";

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

const detailPattern = /^\/opportunities\/([\w-]+)\/?$/;

function matchDetailId(pathname: string): string | null {
  return detailPattern.exec(pathname)?.[1] ?? null;
}

export default function App() {
  const { pathname, search } = useLocation();
  const detailId = matchDetailId(pathname);
  const listState = parseListState(search);

  const [focusOpportunityId, setFocusOpportunityId] = useState<string | null>(null);
  const previousDetailId = useRef<string | null>(detailId);

  // Any detail -> list transition hands focus back, whether it came from the back
  // link, the browser back button or a swipe gesture.
  useEffect(() => {
    if (previousDetailId.current && !detailId) {
      setFocusOpportunityId(previousDetailId.current);
    }
    previousDetailId.current = detailId;
  }, [detailId]);

  const opportunity = detailId ? opportunities.find((o) => o.id === detailId) : undefined;
  const pageName = detailId ? (opportunity?.title ?? "Opportunity not found") : "Open opportunities";

  useEffect(() => {
    document.title = `${pageName} \u2014 Opportunity Board`;
  }, [pageName]);

  // replace: filter and sort tweaks should not pile up in the back stack.
  const handleListStateChange = useCallback((next: ListState) => {
    navigate(`/${serializeListState(next)}`, { replace: true });
  }, []);

  const handleFocusRestored = useCallback(() => setFocusOpportunityId(null), []);

  return (
    <>
      <SkipLink href="#main">Skip to content</SkipLink>
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
          {detailId ? (
            <OpportunityDetailPage id={detailId} backHref={`/${search}`} />
          ) : (
            <OpportunityListPage
              listState={listState}
              onListStateChange={handleListStateChange}
              focusOpportunityId={focusOpportunityId}
              onFocusRestored={handleFocusRestored}
            />
          )}
        </main>
      </Page>

      <VisuallyHidden role="status" aria-live="polite">
        {pageName}
      </VisuallyHidden>
    </>
  );
}
