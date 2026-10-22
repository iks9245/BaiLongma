import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { colors } from "../tokens";

// 90 frames (3s) per breath, scale 1.0 → 1.06 → 1.0.
const BREATH = 90;

export const breath = (frame: number) =>
  0.5 - 0.5 * Math.cos((2 * Math.PI * frame) / BREATH);

type OrbProps = {
  color: string;
  size: number;
  // true/false, or 0–1 to fade breathing in and out smoothly.
  breathe: boolean | number;
  // 0 = blue, 1 = amber; lets a scene cross-fade the state colour.
  amber?: number;
  // Extra multiplicative scale (typing pulse, etc).
  pulse?: number;
  opacity?: number;
  style?: React.CSSProperties;
};

export const Orb: React.FC<OrbProps> = ({
  color,
  size,
  breathe,
  amber,
  pulse = 1,
  opacity = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const b = breath(frame) * Number(breathe);
  const scale = (1 + 0.06 * b) * pulse;

  const mix = amber ?? 0;
  const tint =
    amber === undefined
      ? color
      : interpolateColors(mix, [0, 1], [colors.orbBlue, colors.orbAmber]);
  const deep = interpolateColors(
    mix,
    [0, 1],
    [colors.orbBlueDeep, colors.orbAmberDeep],
  );

  // Halo is a radial gradient rather than a box-shadow: Chrome clips large
  // shadow blurs, which leaves a visible square edge on pure black.
  const glowOpacity = 0.3 + 0.12 * b;
  const halo = size * (0.95 + 0.1 * b);

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `scale(${scale})`,
        opacity,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -halo,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, ${tint} 28%, transparent 100%)`,
          opacity: glowOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 32%, #ffffff 0%, ${tint} 38%, ${deep} 100%)`,
        }}
      />
    </div>
  );
};
