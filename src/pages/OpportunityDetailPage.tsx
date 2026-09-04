import { useEffect, useRef } from "react";
import styled from "styled-components";
import { opportunities } from "../data";
import { Link } from "../router";

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1.25rem;
  color: #1a5fb4;

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: 2px;
    border-radius: 3px;
  }
`;

const Article = styled.article`
  border: 1px solid #d3dae0;
  border-radius: 8px;
  padding: 1.5rem;
  background: #fff;
`;

const Heading = styled.h2`
  font-size: 1.35rem;
  margin: 0 0 0.75rem;

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: 4px;
  }
`;

const Lead = styled.p`
  color: #3e4c59;
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
    color: #52606d;
  }

  dd {
    margin: 0;
  }
`;

const SubHeading = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem;
`;

const List = styled.ul`
  margin: 0 0 1.5rem;
  padding-left: 1.25rem;
  color: #3e4c59;

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
  background: #e4edf7;
  color: #1a5fb4;
  font-size: 0.78rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
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
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Client-side navigation leaves focus on the activated link; move it into the new page.
  useEffect(() => {
    headingRef.current?.focus();
  }, [id]);

  if (!opportunity) {
    return (
      <>
        <BackLink to={backHref}>&larr; Back to all opportunities</BackLink>
        <Article>
          <Heading ref={headingRef} tabIndex={-1}>
            Opportunity not found
          </Heading>
          <Lead>This opportunity may have been filled or removed.</Lead>
        </Article>
      </>
    );
  }

  return (
    <>
      <BackLink to={backHref}>&larr; Back to all opportunities</BackLink>
      <Article aria-labelledby="opportunity-heading">
        <Heading id="opportunity-heading" ref={headingRef} tabIndex={-1}>
          {opportunity.title}
        </Heading>
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
    </>
  );
}
