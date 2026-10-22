import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Orb } from "../components/Orb";
import {
  clamp,
  colors,
  ease,
  font,
  HEIGHT,
  size,
  springConfig,
  WIDTH,
} from "../tokens";
import { PAIR } from "./Talk";

// Lockup geometry: orb on top, title and subtitle below, centred as a block.
const LOCKUP = { orbSize: 252, gap: 66, subGap: 30 };
const LOCKUP_H =
  LOCKUP.orbSize + LOCKUP.gap + size.title + LOCKUP.subGap + size.subtitle * 1.2;
const LOCKUP_TOP = (HEIGHT - LOCKUP_H) / 2;
const ORB_Y = LOCKUP_TOP + LOCKUP.orbSize / 2;
const TITLE_TOP = LOCKUP_TOP + LOCKUP.orbSize + LOCKUP.gap;

// Scene timing, in frames relative to the scene start (40.0s).
const T = {
  merge: [0, 26],
  rise: [40, 70],
  title: 60,
  sub: 80,
  textOut: [118, 132],
  orbOut: [138, 150],
} as const;

// The two agents become one again, and the orb takes its place in the lockup.
export const Together: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const merge = interpolate(frame, T.merge, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const merged = frame >= T.merge[1];
  const mergePulse =
    1 + 0.15 * interpolate(frame, [26, 32, 44], [0, 1, 0], clamp);

  const rise = interpolate(frame, T.rise, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbY = interpolate(rise, [0, 1], [HEIGHT / 2, ORB_Y]);
  const orbSize = interpolate(rise, [0, 1], [PAIR.size, LOCKUP.orbSize]);

  const titleIn = spring({ frame: frame - T.title, fps, config: springConfig });
  const titleOpacity = interpolate(frame, [T.title, T.title + 22], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subIn = interpolate(frame, [T.sub, T.sub + 20], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const textOut = interpolate(frame, T.textOut, [0, 1], {
    ...clamp,
    easing: ease.in,
  });
  const orbOut = interpolate(frame, T.orbOut, [0, 1], {
    ...clamp,
    easing: ease.in,
  });

  const orbs = merged
    ? [{ x: WIDTH / 2, y: orbY }]
    : [PAIR.left, PAIR.right].map((p) => ({
        x: interpolate(merge, [0, 1], [p.x, WIDTH / 2]),
        y: interpolate(merge, [0, 1], [p.y, HEIGHT / 2]),
      }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {orbs.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - orbSize / 2,
            top: p.y - orbSize / 2,
          }}
        >
          <Orb
            color={colors.orbBlue}
            size={orbSize}
            breathe
            pulse={merged ? mergePulse : 1}
            opacity={1 - orbOut}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          top: TITLE_TOP,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: LOCKUP.subGap,
          opacity: 1 - textOut,
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
            fontSize: size.subtitle,
            lineHeight: 1.2,
            fontWeight: 300,
            color: colors.textSecondary,
            opacity: subIn,
            transform: `translateY(${14 * (1 - subIn)}px)`,
          }}
        >
          The phone that works for you.
        </div>
      </div>
    </AbsoluteFill>
  );
};
