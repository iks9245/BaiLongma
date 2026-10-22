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

const ORB = { x: WIDTH / 2, y: 680, size: 120 };
const TILE = 132;
const ELLIPSE = { rx: 460, ry: 230 };

// Generic app glyphs (24×24, stroked). No real products or brands.
const GLYPHS: React.ReactNode[] = [
  // Calendar
  <>
    <rect x={3} y={5} width={18} height={16} rx={3} />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>,
  // Mail
  <>
    <rect x={3} y={5} width={18} height={14} rx={3} />
    <path d="M3.5 7.5l8.5 6 8.5-6" />
  </>,
  // Map pin
  <>
    <path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11z" />
    <circle cx={12} cy={10} r={2.2} />
  </>,
  // Music
  <>
    <path d="M9 18V6l10-2v12" />
    <circle cx={6.5} cy={18} r={2.5} />
    <circle cx={16.5} cy={16} r={2.5} />
  </>,
  // Payment card
  <>
    <rect x={3} y={6} width={18} height={12} rx={3} />
    <path d="M3 10h18M7 15h3" />
  </>,
  // Camera
  <>
    <rect x={3} y={7} width={18} height={13} rx={3} />
    <path d="M8.5 7l1.5-3h4l1.5 3" />
    <circle cx={12} cy={13.5} r={3.5} />
  </>,
];

// Six tiles on an ellipse around the orb, starting top-left, clockwise.
const TILES = GLYPHS.map((glyph, i) => {
  const angle = Math.PI + (i * 2 * Math.PI) / GLYPHS.length + Math.PI / 6;
  return {
    glyph,
    dx: Math.cos(angle) * ELLIPSE.rx,
    dy: Math.sin(angle) * ELLIPSE.ry,
  };
});

// Scene timing, in frames relative to the scene start (50.0s).
const T = {
  title: 4,
  orbMove: [0, 22],
  tiles: 18,
  tileGap: 5,
  links: 56,
  linkGap: 8,
  out: [120, 138],
  orbOut: [136, 150],
} as const;

const kick = (frame: number, at: number) =>
  interpolate(frame - at, [0, 4, 14], [0, 1, 0], clamp);

// The apps stay; the agent drives them.
export const Apps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = interpolate(frame, [T.title, T.title + 22], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const move = interpolate(frame, T.orbMove, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbY = interpolate(move, [0, 1], [HEIGHT / 2, ORB.y]);
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });
  const orbOut = interpolate(frame, T.orbOut, [0, 1], {
    ...clamp,
    easing: ease.in,
  });

  const linkAt = (i: number) => T.links + i * T.linkGap;
  const pulse =
    1 + TILES.reduce((sum, _, i) => sum + 0.07 * kick(frame, linkAt(i) + 8), 0);
  const orbEdge = (ORB.size / 2) * 1.15;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: 1 - outT,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: size.decide,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            whiteSpace: "nowrap",
            opacity: titleIn,
            transform: `translateY(${24 * (1 - titleIn)}px)`,
          }}
        >
          One agent. Every app.
        </h1>
      </div>

      {/* Links from the orb to each app, one after another */}
      <svg
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        style={{ position: "absolute", inset: 0, opacity: 1 - outT }}
      >
        {TILES.map((t, i) => {
          const draw = interpolate(frame, [linkAt(i), linkAt(i) + 10], [0, 1], {
            ...clamp,
            easing: ease.inOut,
          });
          const len = Math.hypot(t.dx, t.dy);
          return (
            <line
              key={i}
              x1={ORB.x + (t.dx / len) * orbEdge}
              y1={ORB.y + (t.dy / len) * orbEdge}
              x2={ORB.x + t.dx}
              y2={ORB.y + t.dy}
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

      {/* App tiles */}
      {TILES.map((t, i) => {
        const at = T.tiles + i * T.tileGap;
        const pop = spring({ frame: frame - at, fps, config: springConfig });
        const tileOpacity = interpolate(frame, [at, at + 10], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        const lit = interpolate(frame, [linkAt(i) + 8, linkAt(i) + 14], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: ORB.x + t.dx - TILE / 2,
              top: ORB.y + t.dy - TILE / 2,
              width: TILE,
              height: TILE,
              boxSizing: "border-box",
              borderRadius: 33,
              background: colors.card,
              border: `1.5px solid ${interpolateColors(lit, [0, 1], [
                colors.cardBorder,
                "rgba(108, 182, 255, 0.55)",
              ])}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: tileOpacity * (1 - outT),
              transform: `scale(${(0.85 + 0.15 * pop) * (1 + 0.06 * kick(frame, linkAt(i) + 8))})`,
            }}
          >
            <svg
              aria-hidden
              width={60}
              height={60}
              viewBox="0 0 24 24"
              fill="none"
              stroke={interpolateColors(lit, [0, 1], [
                colors.textSecondary,
                colors.orbBlue,
              ])}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {t.glyph}
            </svg>
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
          opacity={1 - orbOut}
        />
      </div>
    </AbsoluteFill>
  );
};
