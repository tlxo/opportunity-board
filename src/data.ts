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
    employmentType: "Full-time",
    description:
      "Sit between design and engineering, turning interface concepts into a production component library that holds up under real assistive technology.",
    responsibilities: [
      "Own the shared component library and its accessibility documentation",
      "Prototype interaction patterns and validate them with users",
      "Pair with designers to keep Figma tokens and code in sync",
    ],
    contact: "design-hiring@example.com",
  },
  {
    id: "op-2",
    title: "Accessibility Consultant",
    team: "Advisory",
    location: "Tampere, FI",
    seniority: "Lead",
    tags: ["WCAG", "Auditing", "Training"],
    postedDate: "2026-08-12",
    employmentType: "Full-time",
    description:
      "Advise client teams on meeting WCAG 2.2 AA, from early design review through to remediation and sign-off.",
    responsibilities: [
      "Run audits and write findings that developers can act on directly",
      "Facilitate training for design, engineering and content teams",
      "Support procurement and accessibility statement work",
    ],
    contact: "advisory@example.com",
  },
  {
    id: "op-3",
    title: "Frontend Engineer",
    team: "Platform",
    location: "Remote (Global)",
    seniority: "Mid",
    tags: ["React", "TypeScript", "Testing"],
    postedDate: "2026-09-01",
    employmentType: "Full-time",
    description:
      "Build and maintain the internal platform UI that other product teams depend on every day.",
    responsibilities: [
      "Ship features in a React and TypeScript codebase",
      "Grow the automated test suite alongside the code it covers",
      "Review pull requests and help keep the build fast",
    ],
    contact: "platform-hiring@example.com",
  },
  {
    id: "op-4",
    title: "Service Designer",
    team: "Design",
    location: "Stockholm, SE",
    seniority: "Senior",
    tags: ["Research", "Workshops", "Journeys"],
    postedDate: "2026-07-30",
    employmentType: "Full-time",
    description:
      "Map end-to-end service journeys across digital and non-digital touchpoints, then help teams act on what the map reveals.",
    responsibilities: [
      "Plan and facilitate co-design workshops with stakeholders",
      "Produce journey maps and service blueprints",
      "Translate research findings into concrete design direction",
    ],
    contact: "design-hiring@example.com",
  },
  {
    id: "op-5",
    title: "Solutions Architect",
    team: "Delivery",
    location: "Remote (EU)",
    seniority: "Lead",
    tags: ["Integration", "MCP", "AI Tooling"],
    postedDate: "2026-08-20",
    employmentType: "Full-time",
    description:
      "Shape the technical approach for client integrations, with a focus on AI tooling and Model Context Protocol servers.",
    responsibilities: [
      "Design integration architectures and document the trade-offs",
      "Prototype MCP servers and evaluate vendor tooling",
      "Support delivery teams through implementation",
    ],
    contact: "delivery@example.com",
  },
  {
    id: "op-6",
    title: "UX Researcher",
    team: "Product",
    location: "Helsinki, FI",
    seniority: "Mid",
    tags: ["Usability Testing", "Interviews"],
    postedDate: "2026-08-05",
    employmentType: "Full-time",
    description:
      "Run continuous discovery for two product teams, including usability sessions with participants who use assistive technology.",
    responsibilities: [
      "Recruit participants and moderate usability sessions",
      "Synthesise interview findings into actionable insight",
      "Maintain a shared research repository",
    ],
    contact: "research@example.com",
  },
  {
    id: "op-7",
    title: "Junior Frontend Developer",
    team: "Platform",
    location: "Remote (EU)",
    seniority: "Junior",
    tags: ["React", "CSS", "Learning"],
    postedDate: "2026-09-02",
    employmentType: "Full-time, with mentoring",
    description:
      "A first developer role with structured mentoring, paired work and dedicated learning time each week.",
    responsibilities: [
      "Implement UI features with guidance from a mentor",
      "Write and maintain component-level tests",
      "Take part in code review as both author and reviewer",
    ],
    contact: "platform-hiring@example.com",
  },
  {
    id: "op-8",
    title: "Accessibility Engineer",
    team: "Platform",
    location: "Remote (Global)",
    seniority: "Senior",
    tags: ["WCAG", "React", "Automated Testing"],
    postedDate: "2026-08-15",
    employmentType: "Full-time",
    description:
      "Own accessibility as an engineering concern: tooling, CI checks, and the hard fixes that automated tests cannot catch.",
    responsibilities: [
      "Build accessibility checks into the CI pipeline",
      "Remediate complex ARIA and keyboard interaction issues",
      "Coach engineers on testing with screen readers",
    ],
    contact: "platform-hiring@example.com",
  },
];

// All unique tags across opportunities, used to power the combobox filter.
export const allTags: string[] = Array.from(
  new Set(opportunities.flatMap((o) => o.tags))
).sort((a, b) => a.localeCompare(b));
