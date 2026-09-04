import type { Opportunity } from "./types";

// Fictional sample data for a talent/opportunity matching board.
export const opportunities: Opportunity[] = [
  {
    id: "op-1",
    title: "Design Engineer",
    team: "Product",
    location: "Remote (EU)",
    seniority: "Senior",
    tags: ["React", "TypeScript", "Accessibility", "Figma"],
    postedDate: "2026-08-28",
  },
  {
    id: "op-2",
    title: "Accessibility Consultant",
    team: "Advisory",
    location: "Tampere, FI",
    seniority: "Lead",
    tags: ["WCAG", "Auditing", "Training"],
    postedDate: "2026-08-12",
  },
  {
    id: "op-3",
    title: "Frontend Engineer",
    team: "Platform",
    location: "Remote (Global)",
    seniority: "Mid",
    tags: ["React", "TypeScript", "Testing"],
    postedDate: "2026-09-01",
  },
  {
    id: "op-4",
    title: "Service Designer",
    team: "Design",
    location: "Stockholm, SE",
    seniority: "Senior",
    tags: ["Research", "Workshops", "Journeys"],
    postedDate: "2026-07-30",
  },
  {
    id: "op-5",
    title: "Solutions Architect",
    team: "Delivery",
    location: "Remote (EU)",
    seniority: "Lead",
    tags: ["Integration", "MCP", "AI Tooling"],
    postedDate: "2026-08-20",
  },
  {
    id: "op-6",
    title: "UX Researcher",
    team: "Product",
    location: "Helsinki, FI",
    seniority: "Mid",
    tags: ["Usability Testing", "Interviews"],
    postedDate: "2026-08-05",
  },
  {
    id: "op-7",
    title: "Junior Frontend Developer",
    team: "Platform",
    location: "Remote (EU)",
    seniority: "Junior",
    tags: ["React", "CSS", "Learning"],
    postedDate: "2026-09-02",
  },
  {
    id: "op-8",
    title: "Accessibility Engineer",
    team: "Platform",
    location: "Remote (Global)",
    seniority: "Senior",
    tags: ["WCAG", "React", "Automated Testing"],
    postedDate: "2026-08-15",
  },
];

// All unique tags across opportunities, used to power the combobox filter.
export const allTags: string[] = Array.from(
  new Set(opportunities.flatMap((o) => o.tags))
).sort((a, b) => a.localeCompare(b));
