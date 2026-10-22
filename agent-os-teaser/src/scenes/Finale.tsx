import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Orb } from "../components/Orb";
import { clamp, colors, ease, font, size, springConfig } from "../tokens";

// Scene timing, in frames relative to the scene start (25.0s).
const T = {
  less: 0,
  more: 18,
  dim: [44, 58],
  lineOut: [66, 80],
  orbIn: [78, 98],
  title: 88,
  sub: 104,
  out: [138, 150],
} as const;

// The closing line, then the opening lockup again as a bookend.
export const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineIn = (start: number) =>
    interpolate(frame, [start, start + 20], [0, 1], {
      ...clamp,
      easing: ease.out,
    });
  const lessIn = lineIn(T.less);
  const moreIn = lineIn(T.more);
  const dim = interpolate(frame, T.dim, [0, 1], { ...clamp, easing: ease.inOut });
  const lineOut = interpolate(frame, T.lineOut, [0, 1], {
    ...clamp,
    easing: ease.in,
  });

  const orbOpacity = interpolate(frame, T.orbIn, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const orbSize = interpolate(frame, [T.orbIn[0], T.orbIn[1] + 12], [190, 252], {
    ...clamp,
    easing: ease.out,
  });
  const titleIn = spring({ frame: frame - T.title, fps, config: springConfig });
  const titleOpacity = interpolate(frame, [T.title, T.title + 22], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subIn = interpolate(frame, [T.sub, T.sub + 20], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });

  const lineStyle: React.CSSProperties = {
    margin: 0,
    fontSize: size.title,
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: "-0.045em",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {/* "Less phone. More life." */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - lineOut,
          transform: `scale(${1 - 0.05 * lineOut})`,
        }}
      >
        <h1 style={{ ...lineStyle, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              opacity: lessIn,
              transform: `translateY(${24 * (1 - lessIn)}px)`,
              color: interpolateColors(dim, [0, 1], [
                colors.text,
                colors.textSecondary,
              ]),
            }}
          >
            Less phone.
          </span>
          <br />
          <span
            style={{
              display: "inline-block",
              opacity: moreIn,
              transform: `translateY(${24 * (1 - moreIn)}px)`,
            }}
          >
            More life.
          </span>
        </h1>
      </AbsoluteFill>

      {/* Lockup */}
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
            gap: 66,
          }}
        >
          <div
            style={{
              width: 252,
              height: 252,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Orb
              color={colors.orbBlue}
              size={orbSize}
              breathe
              opacity={orbOpacity}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: size.title,
                lineHeight: 1,
                fontWeight: 600,
                letterSpacing: font.tracking,
                opacity: titleOpacity,
                transform: `translateY(${36 * (1 - titleIn)}px)`,
              }}
            >
              Agent OS
            </h1>
            <div
              style={{
                marginTop: 12,
                fontSize: size.subtitle,
                fontWeight: 300,
                color: colors.textSecondary,
                opacity: subIn,
                transform: `translateY(${14 * (1 - subIn)}px)`,
              }}
            >
              The phone that works for you.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
