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
  color: ${({ theme }) => theme.color.text};
`;

const SkipLink = styled.a`
  position: absolute;
  left: -999px;
  top: auto;
  background: ${({ theme }) => theme.color.link};
  color: ${({ theme }) => theme.color.surface};
  padding: 0.6rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
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
  margin: 0;
`;

const Footer = styled.footer`
  color: ${({ theme }) => theme.color.textMuted};
  margin-top: 2rem;
  padding-top: 1.25rem;
  max-width: 60ch;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.color.link};
  text-decoration: underline;
  text-underline-offset: 0.15em;

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.color.linkVisited};
  }
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
          <Title>{pageName}</Title>
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

        <Footer>
          This project currently covers a small accessible opportunity board: a
          filterable, sortable list, shareable URL state, detail pages for sample
          opportunities, keyboard row navigation, focus restoration, and live
          status updates. View the <FooterLink href="https://github.com/tlxo/opportunity-board" target="_blank" rel="noreferrer">GitHub repository</FooterLink>.
        </Footer>
      </Page>

      <VisuallyHidden role="status" aria-live="polite">
        {pageName}
      </VisuallyHidden>
    </>
  );
}
