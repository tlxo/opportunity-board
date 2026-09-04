# Open Opportunities — an accessible table & filter

A small, self-contained UI piece built to demonstrate a specific combination:
design sensibility, frontend engineering, and accessibility that's designed
in from the start rather than patched on at the end. React, TypeScript, and
styled-components — no UI kit, no headless-component library — so every
accessibility decision below is one I made deliberately, not one a library
made for me.

**[Live demo](https://opportunity-board.netlify.app/)** [![Netlify Status](https://api.netlify.com/api/v1/badges/24af0b4e-02f9-43a0-b64e-84f78c623cbd/deploy-status)](https://app.netlify.com/projects/opportunity-board/deploys)  

## What it is

A filterable, sortable list of open opportunities — the kind of screen a
talent-matching or careers product ships constantly. Two components carry
the interesting work:

- **`ComboboxFilter`** — a combobox-with-list-autocomplete filter, built to
  the [WAI-ARIA APG combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/):
  full keyboard support (arrow keys, Home/End, Enter, Escape), `aria-expanded`
  / `aria-controls` / `aria-activedescendant` wiring, and a visually-hidden
  live region announcing result counts as you type.
- **`OpportunityTable`** — a sortable table where sort state lives on
  `aria-sort` (not just a visual arrow icon), every column header is a real
  `<button>` so it's keyboard-operable without extra scripting, and a live
  region announces what changed and how many results remain after every
  sort or filter action.

## Accessibility approach

_(Fill this in with specifics once you've actually run through it —
this is the section that does the real work in an application, so don't
leave it generic.)_

- [ ] Full keyboard-only pass: can you reach and operate every control —
      filter input, listbox options, each sort button — without a mouse?
- [ ] Screen reader pass (VoiceOver on macOS, or NVDA on Windows): do the
      live-region announcements actually make sense out loud, or do they
      fire too often / not enough?
- [ ] Color contrast check on text, the focus ring, and the tag pills
      against their backgrounds.
- [ ] Zoom to 200% and reflow — does anything clip or overlap?
- [ ] `prefers-reduced-motion` respected (there's not much motion here yet,
      but the base stylesheet accounts for it).
- [ ] Note anything you found and fixed — that's more convincing in an
      interview than a clean checklist with no history.

## Built with AI assistance — and where I overrode it

_(This is the section that actually answers "good taste, can build,
can evaluate AI output." Be specific and honest — a couple of real
examples of judgment calls beat a vague "AI helped me code faster.")_

- What you used (Claude Code / Cursor / etc.) and for which parts.
- At least one place the AI's first suggestion was wrong, inaccessible,
  or just not how you'd do it — and what you changed and why.
- Anything you had to actively research or verify rather than trust.

## Tech stack

React 19, TypeScript, Vite, styled-components. No component library, no
CSS framework — deliberately, so the accessibility work is visible rather
than inherited.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and produce a production build
npm run preview  # serve the production build locally
```
