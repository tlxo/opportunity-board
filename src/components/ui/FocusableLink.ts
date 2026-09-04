import styled from "styled-components";
import { Link } from "../../router";
import { focusRing } from "../../theme";

// Shared link treatment: brand color, underline, and the app-wide focus ring.
export const FocusableLink = styled(Link)`
  color: ${({ theme }) => theme.color.link};
  text-decoration: underline;

  &:focus-visible {
    ${focusRing()}
    border-radius: 3px;
  }
`;
