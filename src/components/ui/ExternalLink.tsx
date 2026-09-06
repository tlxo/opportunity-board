import type { AnchorHTMLAttributes } from "react";
import { VisuallyHidden } from "../VisuallyHidden";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">;

// Every external link is a context change (WCAG 3.2.5): flag it visually and for assistive tech.
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        width="0.75em"
        height="0.75em"
        style={{ marginLeft: "0.25em", verticalAlign: "middle" }}
      >
        <path
          fill="currentColor"
          d="M6 2h8v8h-1.5V4.56L4.06 13 3 11.94 11.44 3.5H6V2Z"
        />
      </svg>
      <VisuallyHidden> (opens in new tab)</VisuallyHidden>
    </a>
  );
}
