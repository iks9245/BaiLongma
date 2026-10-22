import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Inter is bundled in public/fonts so renders never depend on the network.
const fontFamily = "Inter";
for (const weight of ["200", "300", "400", "600", "700"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`),
    weight,
  });
}

export const FPS = 30;
export const SCENE = 150;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  bg: "#000000",
  text: "#f5f5f7",
  textSecondary: "#98989d",
  textTertiary: "#d1d1d6",
  orbBlue: "#6cb6ff",
  orbBlueDeep: "#0b2b4d",
  orbAmber: "#ffb340",
  orbAmberDeep: "#5a3200",
  card: "#1c1c1e",
  cardBorder: "#2c2c2e",
  phone: "#0c0c0e",
};

export const font = {
  family: `${fontFamily}, -apple-system, "Helvetica Neue", sans-serif`,
  tracking: "-0.04em",
};

// Reference frames are 1280×720; everything here is ×1.5 for 1080p.
export const size = {
  title: 222,
  sayIt: 264,
  decide: 168,
  subtitle: 54,
  introducing: 36,
};

export const springConfig = { damping: 20 };

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
