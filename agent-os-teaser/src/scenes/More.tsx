import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Orb } from "../components/Orb";
import { clamp, colors, ease, font, HEIGHT, size, WIDTH } from "../tokens";
import { PAIR } from "./Talk";

// Scene timing, in frames relative to the scene start (30.0s).
const T = {
  line: [24, 48],
  lineOut: [76, 92],
  orbIn: [98, 114],
  split: [116, 146],
} as const;

// "One more thing." Then the orb divides into two agents.
export const More: React.FC = () => {
  const frame = useCurrentFrame();

  const lineIn = interpolate(frame, T.line, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const lineOut = interpolate(frame, T.lineOut, [0, 1], {
    ...clamp,
    easing: ease.in,
  });
  const orbOpacity = interpolate(frame, T.orbIn, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const split = interpolate(frame, T.split, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });

  const orbAt = (target: { x: number; y: number }) => ({
    x: interpolate(split, [0, 1], [WIDTH / 2, target.x]),
    y: interpolate(split, [0, 1], [HEIGHT / 2, target.y]),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: size.decide,
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: font.tracking,
            opacity: lineIn * (1 - lineOut),
            transform: `translateY(${24 * (1 - lineIn)}px) scale(${1 - 0.04 * lineOut})`,
          }}
        >
          One more thing.
        </h1>
      </AbsoluteFill>

      {[PAIR.left, PAIR.right].map((target, i) => {
        const p = orbAt(target);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x - PAIR.size / 2,
              top: p.y - PAIR.size / 2,
            }}
          >
            <Orb
              color={colors.orbBlue}
              size={PAIR.size}
              breathe
              opacity={orbOpacity}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
