// Centralized theme configuration
export const theme = {
  colors: {
    primary: {
      400: "#FF4444", // bright blood red
      500: "#DC143C", // crimson
      600: "#8B0000", // dark red
      700: "#660000", // very dark red
    },
  },
  styles: {
    primaryGradient: { background: "linear-gradient(90deg, #8B0000, #DC143C)" },
    primaryGradientHover: { background: "linear-gradient(90deg, #660000, #8B0000)" },
  },
  hex: {
    primary400: "#FF4444",
    primary500: "#DC143C",
    primary600: "#8B0000",
  },
  rgb: {
    primary400: "220, 20, 60", // RGB for crimson
  },
} as const;
