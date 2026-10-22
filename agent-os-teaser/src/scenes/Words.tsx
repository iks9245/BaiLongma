import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Orb } from "../components/Orb";
import { clamp, colors, ease, font, size, springConfig } from "../tokens";

// One word at a time: [in, out] frames.
const WORDS = [
  { text: "Simple.", at: [0, 26] },
  { text: "Personal.", at: [26, 52] },
  { text: "Yours.", at: [52, 82] },
] as const;

// Scene timing, in frames relative to the scene start (55.0s).
const T = {
  orbIn: [86, 102],
  title: 94,
  sub: 110,
  out: [138, 150],
} as const;

// Three words, then the horizontal lockup that closes the series.
export const Words: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbIn = spring({ frame: frame - T.orbIn[0], fps, config: springConfig });
  const orbOpacity = interpolate(frame, T.orbIn, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const titleIn = spring({ frame: frame - T.title, fps, config: springConfig });
  const titleOpacity = interpolate(frame, [T.title, T.title + 20], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subIn = interpolate(frame, [T.sub, T.sub + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {WORDS.map((w) => {
        const [start, end] = w.at;
        const t =
          interpolate(frame, [start, start + 8], [0, 1], {
            ...clamp,
            easing: ease.out,
          }) *
          (1 -
            interpolate(frame, [end - 6, end], [0, 1], {
              ...clamp,
              easing: ease.in,
            }));
        return (
          <AbsoluteFill
            key={w.text}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: size.title,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                opacity: t,
                transform: `scale(${0.96 + 0.04 * t})`,
              }}
            >
              {w.text}
            </h1>
          </AbsoluteFill>
        );
      })}

      {/* Horizontal lockup */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - outT,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
            <Orb
              color={colors.orbBlue}
              size={168}
              breathe
              opacity={orbOpacity}
              pulse={0.85 + 0.15 * orbIn}
            />
            <h1
              style={{
                margin: 0,
                fontSize: size.title,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: font.tracking,
                opacity: titleOpacity,
                transform: `translateX(${40 * (1 - titleIn)}px)`,
              }}
            >
              Agent OS
            </h1>
          </div>
          <div
            style={{
              fontSize: size.subtitle,
              fontWeight: 300,
              color: colors.textSecondary,
              opacity: subIn,
              transform: `translateY(${12 * (1 - subIn)}px)`,
            }}
          >
            The phone that works for you.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
