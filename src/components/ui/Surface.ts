import styled from "styled-components";

// Shared bordered/rounded container used for cards, panels and dropdowns.
export const Surface = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
`;
