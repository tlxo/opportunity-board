# Open Opportunities

A small SPA built to demonstrate a specific combination: design sensibility, 
frontend engineering, and accessibility that's built in instead of an 
afterthought (or patched on after an audit, which is the least cost-effective option). 

The PSA consists of the kind of views I imagine a talent-matching or careers product 
ships constantly: a filterable, sortable list of open opportunities paired with 
individual pages for each sample opportunity, an extra dimension that forced me to 
think about state saving. 

**[Live demo](https://opportunity-board.netlify.app/)**

[![Netlify Status](https://api.netlify.com/api/v1/badges/24af0b4e-02f9-43a0-b64e-84f78c623cbd/deploy-status)](https://app.netlify.com/projects/opportunity-board/deploys)

## What it is

Two 
components carry the interesting work:

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

## Stack
- React, TypeScript, and styled-components.
- Absolutely no UI kit, no headless-component library
- Native HTML elements whenever possible

## Accessibility approach

This project treats accessibility as part of the interaction model, not a final
checklist. A few concrete choices matter here:

- Full keyboard-only flow: every control is reachable without a mouse,
  including the combobox, listbox options, sort buttons, and row links.
- Screen-reader feedback: live regions announce sort changes and result counts so
  state changes are not silent.
- Focus management: skip links, heading focus on detail pages, and row focus
  restoration keep users oriented when moving through the app.
- The table uses semantic HTML and ARIA state: real buttons, real links, real
  table semantics, and `aria-sort` on the active column.
- Focus styles are consistently visible and contrasted against the background to
  remain obvious without being decorative.

## Built with AI assistance — and where I overrode it

AI was useful for scaffolding the first pass of the combobox, table, and routing
patterns, and for getting the component structure in place quickly.

Every accessibility decision after the fact was made by me deliberately. I did
not want to be limited to options a library would have been able to offer me.

## Significant changes along the way, and why they were needed

Improvements focused on the practical product problems that matter most in a
real filtered table: preserving context, keeping state shareable, and making
keyboard navigation feel consistent rather than fragile.

- **Custom client-side routing**
  The app uses a lightweight router built on `useSyncExternalStore` and the
  browser history APIs instead of pulling in a large routing library. This keeps
  the app small while still supporting the browser back button, direct links to
  detail pages, and a natural SPA flow.

- **Filter and sort state is synced to the URL**
  The list state is serialized into the query string and parsed back on each load.
  This makes filtered views bookmarkable and shareable, and it keeps the UI in a
  predictable state even when a user reloads. Every value is validated against an
  allowlist before it is used, which guards against bad or unexpected query params.

- **Focus is restored when moving between list and detail**
  When the user goes from the list into a detail page and then returns, focus is
  restored to the row they came from rather than dropping to the top of the page.
  This matters to keyboard users because it preserves their place and reduces
  disorientation.

- **Accessible interaction patterns were implemented intentionally**
  The combobox and table follow real ARIA patterns: proper keyboard handling,
  active-option tracking, `aria-live` announcements, visible focus states, and
  semantic HTML. The goal was to make the app usable without a mouse and not just
  look correct at a glance.

## Design system foundations

Separate from the accessibility work, the styled-components usage was refactored
from one-off literals into a small shared design system:

- **A single theme object** (`src/theme.ts`) holds every color, radius, and the
  `focusRing()` mixin, wired in via styled-components' `ThemeProvider`. Colors like
  the brand blue used for links and focus rings previously appeared as the literal
  `#1a5fb4` independently in four different files; now every component reads
  `theme.color.link`.
- **Typed theme access**: `src/styled.d.ts` augments styled-components'
  `DefaultTheme`, so `props.theme.color.*` is type-checked and autocompletes
  instead of relying on string literals matching by convention.
- **Shared primitives** (`src/components/ui/`): `FocusableLink` and `Surface`
  extract patterns that were being redefined per-file (a link with the app's
  focus-ring treatment, a bordered/rounded card container). Feature components
  like `TitleLink` and `Article` now compose from these rather than duplicating
  the CSS.

This isn't about accessibility itself, it's about making the accessible styling
choices (contrast, focus-ring shape/offset) impossible to accidentally drift out
of sync as the app grows.

## Running locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and produce a production build
npm run preview  # serve the production build locally
```
