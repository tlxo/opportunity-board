export const theme = {
  color: {
    text: "#1f2933",
    textMuted: "#52606d",
    textSubtle: "#3e4c59",
    link: "#1a5fb4",
    linkTint: "#e4edf7",
    border: "#d3dae0",
    borderStrong: "#b8c0c8",
    borderSubtle: "#e4e9ec",
    surface: "#fff",
    surfaceMuted: "#f4f6f8",
    surfaceHover: "#e9edf1",
    focusShadow: "rgba(15, 23, 30, 0.12)",
  },
  radius: {
    sm: "6px",
    md: "8px",
    pill: "999px",
  },
} as const;

// Centralized so every focus-visible rule in the app renders an identical ring.
export function focusRing(offset = "2px") {
  return `
    outline: 3px solid ${theme.color.link};
    outline-offset: ${offset};
  `;
}

export type AppTheme = typeof theme;
