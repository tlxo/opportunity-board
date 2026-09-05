# Open Opportunities

A small Single-Page Application built to demonstrate a specific combination: design sensibility,
frontend engineering, and accessibility that's built in instead of an
afterthought (or patched on after an audit, which is the least cost-effective option).

The app consists of the kind of views I imagine a talent-matching or careers product
ships constantly: a filterable, sortable list of open opportunities paired with
individual pages for each sample opportunity, an extra dimension that forced me to
think about state saving.

**[Live demo](https://opportunities.tlxo.fi/)**

[![Netlify Status](https://api.netlify.com/api/v1/badges/24af0b4e-02f9-43a0-b64e-84f78c623cbd/deploy-status)](https://app.netlify.com/projects/opportunity-board/deploys)

## What it is

Two components carry the interesting work:

- **`ComboboxFilter`** — a native `<select>` tag filter with a clear button,
  controlled React state, and the same visible focus treatment as the rest of
  the app. The selected option is also reflected back to the DOM so accessibility
  inspections see the current state on the native control.
- **`OpportunityTable`** — a sortable table where sort state lives on
  `aria-sort` (not just a visual arrow icon), every column header is a real
  `<button>` so it's keyboard-operable without extra scripting, and a live
  region announces what changed and how many results remain after every sort.
  Row links use roving focus so keyboard users can move through the table with
  ArrowUp, ArrowDown, Home, and End without tabbing through every row.

## Stack

- React 19, TypeScript 6, Vite 8, and styled-components 6.
- `oxlint` for linting.
- Absolutely no UI kit, no headless-component library.
- Native HTML elements whenever possible.

## Accessibility approach

This project treats accessibility as part of the interaction model, not a final
checklist. A few concrete choices matter here:

- Full keyboard-only flow: every control is reachable without a mouse,
  including the native tag filter, clear button, sort buttons, and row links.
- Screen-reader feedback: live regions announce sort changes, result counts,
  and page-name changes so state changes are not silent.
- Focus management: the skip link, detail-page article focus, and list-row focus
  restoration keep users oriented when moving through the app.
- The table uses semantic HTML and ARIA state: real buttons, real links, real
  table semantics, and `aria-sort` on the active column.
- Focus styles are consistently visible and contrasted against the background to
  remain obvious without being decorative.

## Built with AI, and the calls I made along the way

AI scaffolded the first pass of the combobox, the table, and the routing. Here's
where I stepped in.

**Replaced the combobox with a native `<select>`.** The first version was a
hand-built combobox following the WAI-ARIA APG pattern — `aria-expanded`,
`aria-activedescendant`, all of it. It looked correct in an ARIA inspector, but
testing showed it behaved inconsistently across real screen reader and browser
combinations, which is a known failure mode for custom comboboxes. A native
`<select>` has no custom keyboard handling to get wrong, and every browser and
screen reader already supports it.

**Fixed a keyboard-reachability bug in Safari.** The Clear button wasn't
tabbable there. Chrome testing alone wouldn't have caught it.

**Moved the result-count announcement.** It lived in the filter component;
screen reader users need it announced with the results, not the control that
triggered them. It now sits with `ResultCount`.

**Routing, URL state, and focus were deliberate builds, not left as
scaffolding.** A router on `useSyncExternalStore` instead of a routing library.
Filter and sort state serialized to the URL, with every value checked against
an allowlist before use — query params are attacker-controlled input. Focus
moves to the detail page on navigation and back to the exact row on return.

**Kept roving-tabindex row navigation without `role="grid"`, after a reviewer
flagged it.** Grid semantics fit two-dimensional navigation; this table has one
interactive element per row, so grid roles would add row/column announcements
with no real columns to navigate. Tested it to confirm rather than reasoning it
out abstractly, then decided against the change.

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
npm run lint     # run oxlint
npm run build    # run tsc -b, then produce a production build
npm run preview  # serve the production build locally
```
