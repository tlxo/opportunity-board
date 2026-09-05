import { useEffect, useRef } from "react";
import styled from "styled-components";
import { opportunities } from "../data";
import { FocusableLink } from "../components/ui/FocusableLink";
import { Surface } from "../components/ui/Surface";

const BackLink = styled(FocusableLink)`
  display: inline-block;
  margin-top: 1.25rem;
`;

const Article = styled(Surface)`
  padding: 1.5rem;
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.color.textSubtle};
  max-width: 65ch;
  margin: 0 0 1.5rem;
`;

const Facts = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.25rem;
  margin: 0 0 1.5rem;

  dt {
    font-weight: 600;
    color: ${({ theme }) => theme.color.textMuted};
  }

  dd {
    margin: 0;
  }
`;

const SubHeading = styled.h2`
  font-size: 1rem;
  margin: 0 0 0.5rem;
`;

const List = styled.ul`
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
  color: ${({ theme }) => theme.color.textSubtle};

  li {
    margin-bottom: 0.35rem;
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
  background: ${({ theme }) => theme.color.linkTint};
  color: ${({ theme }) => theme.color.link};
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.pill};
`;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface OpportunityDetailPageProps {
  id: string;
  backHref: string;
}

export function OpportunityDetailPage({ id, backHref }: OpportunityDetailPageProps) {
  const opportunity = opportunities.find((o) => o.id === id);
  const articleRef = useRef<HTMLElement>(null);

  // Client-side navigation leaves focus on the activated link; move it into the new page.
  useEffect(() => {
    articleRef.current?.focus();
  }, [id]);

  if (!opportunity) {
    return (
      <>
        <Article as="article" ref={articleRef} tabIndex={-1}>
          <Lead>Opportunity not found</Lead>
          <Lead>This opportunity may have been filled or removed.</Lead>
        </Article>
        <BackLink to={backHref}>&larr; Back to all opportunities</BackLink>
      </>
    );
  }

  return (
    <>
      <Article as="article" ref={articleRef} tabIndex={-1}>
        <Lead>{opportunity.description}</Lead>

        <Facts>
          <dt>Team</dt>
          <dd>{opportunity.team}</dd>
          <dt>Location</dt>
          <dd>{opportunity.location}</dd>
          <dt>Seniority</dt>
          <dd>{opportunity.seniority}</dd>
          <dt>Employment type</dt>
          <dd>{opportunity.employmentType}</dd>
          <dt>Posted</dt>
          <dd>
            <time dateTime={opportunity.postedDate}>{formatDate(opportunity.postedDate)}</time>
          </dd>
          <dt>Contact</dt>
          <dd>
            <a href={`mailto:${opportunity.contact}`}>{opportunity.contact}</a>
          </dd>
        </Facts>

        <SubHeading>What you would be doing</SubHeading>
        <List>
          {opportunity.responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>

        <SubHeading id="detail-tags-heading">Tags</SubHeading>
        <TagList aria-labelledby="detail-tags-heading">
          {opportunity.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagList>
      </Article>
      <BackLink to={backHref}>&larr; Back to all opportunities</BackLink>
    </>
  );
}
