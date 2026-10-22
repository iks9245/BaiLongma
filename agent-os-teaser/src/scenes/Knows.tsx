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

const ORB = { x: WIDTH / 2, y: 650, size: 150 };

// Memory chips, placed relative to the orb's centre.
const CHIPS = [
  { label: "Window seat", dx: -500, dy: -110 },
  { label: "No shellfish", dx: 500, dy: -150 },
  { label: "Quiet over busy", dx: -440, dy: 170 },
  { label: "Mum's birthday · 14 Nov", dx: 470, dy: 150 },
];

// Scene timing, in frames relative to the scene start (15.0s).
const T = {
  orbIn: [0, 18],
  title: 8,
  sub: 92,
  chips: 34,
  chipGap: 12,
  absorb: [116, 140],
  orbHome: [124, 150],
} as const;

export const Knows: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = interpolate(frame, [T.title, T.title + 22], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subIn = interpolate(frame, [T.sub, T.sub + 20], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const absorb = interpolate(frame, T.absorb, [0, 1], {
    ...clamp,
    easing: ease.in,
  });

  // The orb settles at frame centre so the next scene can pick it up there.
  const home = interpolate(frame, T.orbHome, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbY = interpolate(home, [0, 1], [ORB.y, HEIGHT / 2]);
  const orbOpacity = interpolate(frame, T.orbIn, [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // Each chip landing gives the orb a small kick.
  const landAt = (i: number) => T.chips + i * T.chipGap + 8;
  const pulse =
    1 +
    CHIPS.reduce(
      (sum, _, i) =>
        sum +
        0.06 *
          interpolate(frame - landAt(i), [0, 4, 14], [0, 1, 0], clamp),
      0,
    ) +
    0.08 * interpolate(frame, [130, 136, 146], [0, 1, 0], clamp);

  const orbEdge = (ORB.size / 2) * 1.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          opacity: 1 - absorb,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: size.decide,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            opacity: titleIn,
            transform: `translateY(${24 * (1 - titleIn)}px)`,
          }}
        >
          It knows you.
        </h1>
        <div
          style={{
            fontSize: size.subtitle,
            fontWeight: 300,
            color: colors.textSecondary,
            opacity: subIn,
            transform: `translateY(${12 * (1 - subIn)}px)`,
          }}
        >
          Your tastes. Your people. Your time.
        </div>
      </div>

      {/* Threads from the orb to each memory */}
      <svg
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        style={{ position: "absolute", inset: 0, opacity: 1 - absorb }}
      >
        {CHIPS.map((c, i) => {
          const start = T.chips + i * T.chipGap;
          const draw = interpolate(frame, [start, start + 12], [0, 1], {
            ...clamp,
            easing: ease.inOut,
          });
          const len = Math.hypot(c.dx, c.dy);
          const ux = c.dx / len;
          const uy = c.dy / len;
          return (
            <line
              key={c.label}
              x1={ORB.x + ux * orbEdge}
              y1={ORB.y + uy * orbEdge}
              x2={ORB.x + c.dx * (1 - absorb)}
              y2={ORB.y + c.dy * (1 - absorb)}
              stroke={colors.orbBlue}
              strokeOpacity={0.35}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
          );
        })}
      </svg>

      {/* Memory chips */}
      {CHIPS.map((c, i) => {
        const land = landAt(i);
        const pop = spring({ frame: frame - land, fps, config: springConfig });
        const chipOpacity = interpolate(frame, [land, land + 8], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: ORB.x + c.dx * (1 - absorb),
              top: ORB.y + c.dy * (1 - absorb),
              transform: `translate(-50%, -50%) scale(${(0.9 + 0.1 * pop) * (1 - 0.7 * absorb)})`,
              opacity: chipOpacity * (1 - absorb),
              padding: "22px 36px",
              borderRadius: 999,
              background: colors.card,
              border: `1.5px solid ${colors.cardBorder}`,
              fontSize: 33,
              whiteSpace: "nowrap",
            }}
          >
            {c.label}
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: ORB.x - ORB.size / 2,
          top: orbY - ORB.size / 2,
        }}
      >
        <Orb
          color={colors.orbBlue}
          size={ORB.size}
          breathe
          pulse={pulse}
          opacity={orbOpacity}
        />
      </div>
    </AbsoluteFill>
  );
};
