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
  springConfig,
  WIDTH,
} from "../tokens";

const PAD_X = 168;
const RING = { x: 1400, y: 540, r: 330, tight: 306 };
const ORB_SIZE = 120;

const CHIPS = [
  { label: "Messages", dx: -150, dy: -150 },
  { label: "Photos", dx: 150, dy: -150 },
  { label: "Health", dx: -150, dy: 150 },
  { label: "Location", dx: 150, dy: 150 },
];

// Scene timing, in frames relative to the scene start (45.0s).
const T = {
  orbIn: [0, 16],
  orbMove: [10, 34],
  head: 20,
  sub: 40,
  ring: [24, 54],
  chips: 48,
  chipGap: 9,
  lock: [106, 122],
  out: [124, 140],
  orbHome: [126, 150],
} as const;

const kick = (frame: number, at: number) =>
  interpolate(frame - at, [0, 4, 14], [0, 1, 0], clamp);

// The orb, its memories, and a boundary that closes around them.
export const Private: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({ frame: frame - T.head, fps, config: springConfig });
  const headOpacity = interpolate(frame, [T.head, T.head + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subIn = interpolate(frame, [T.sub, T.sub + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });

  // Orb: fades in at centre, moves into the ring, returns to centre at the end.
  const move = interpolate(frame, T.orbMove, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const home = interpolate(frame, T.orbHome, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbX = interpolate(home, [0, 1], [
    interpolate(move, [0, 1], [WIDTH / 2, RING.x]),
    WIDTH / 2,
  ]);
  const orbY = interpolate(move, [0, 1], [HEIGHT / 2, RING.y]);
  const orbOpacity = interpolate(frame, T.orbIn, [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // Ring draws in, then tightens and brightens as it locks.
  const ringDraw = interpolate(frame, T.ring, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const lock = spring({ frame: frame - T.lock[0], fps, config: springConfig });
  const lockOpacity = interpolate(frame, T.lock, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const ringR = interpolate(lock, [0, 1], [RING.r, RING.tight]);
  const landAt = (i: number) => T.chips + i * T.chipGap;

  const pulse =
    1 +
    CHIPS.reduce((sum, _, i) => sum + 0.06 * kick(frame, landAt(i)), 0) +
    0.12 * kick(frame, T.lock[0] + 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {/* Left: headline */}
      <div
        style={{
          position: "absolute",
          left: PAD_X,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 42,
          opacity: 1 - outT,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 180,
            lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            opacity: headOpacity,
            transform: `translateX(${-120 * (1 - headIn)}px)`,
          }}
        >
          Private
          <br />
          by design.
        </h1>
        <div
          style={{
            fontSize: 57,
            lineHeight: 1.25,
            fontWeight: 300,
            color: colors.textSecondary,
            opacity: subIn,
            transform: `translateY(${12 * (1 - subIn)}px)`,
          }}
        >
          What it knows
          <br />
          stays on your phone.
        </div>
      </div>

      {/* Right: the boundary */}
      <svg
        aria-hidden
        width={WIDTH}
        height={HEIGHT}
        style={{ position: "absolute", inset: 0, opacity: 1 - outT }}
      >
        <circle
          cx={RING.x}
          cy={RING.y}
          r={ringR}
          fill="none"
          stroke={colors.orbBlue}
          strokeOpacity={0.35 + 0.3 * lockOpacity}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ringDraw}
          transform={`rotate(-90 ${RING.x} ${RING.y})`}
        />
      </svg>

      {/* Padlock sitting on the ring's top edge */}
      <div
        style={{
          position: "absolute",
          left: RING.x - 45,
          top: RING.y - ringR - 45,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: lockOpacity * (1 - outT),
          transform: `scale(${0.8 + 0.2 * lock})`,
        }}
      >
        <svg
          aria-hidden
          width={51}
          height={51}
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.orbBlue}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x={5} y={11} width={14} height={10} rx={2.5} />
          <path d={`M8 11V${8 - 1.5 * (1 - lock)}a4 4 0 0 1 8 0v3`} />
        </svg>
      </div>

      {/* What it knows, kept inside */}
      {CHIPS.map((c, i) => {
        const land = landAt(i);
        const pop = spring({ frame: frame - land, fps, config: springConfig });
        const t = interpolate(frame, [land, land + 8], [0, 1], {
          ...clamp,
          easing: ease.out,
        });
        const squeeze = interpolate(lock, [0, 1], [1, 0.92]);
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: RING.x + c.dx * squeeze,
              top: RING.y + c.dy * squeeze,
              transform: `translate(-50%, -50%) scale(${0.9 + 0.1 * pop})`,
              opacity: t * (1 - outT),
              padding: "18px 30px",
              borderRadius: 999,
              background: colors.card,
              border: `1.5px solid ${colors.cardBorder}`,
              fontSize: 30,
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
          left: orbX - ORB_SIZE / 2,
          top: orbY - ORB_SIZE / 2,
        }}
      >
        <Orb
          color={colors.orbBlue}
          size={ORB_SIZE}
          breathe
          pulse={pulse}
          opacity={orbOpacity}
        />
      </div>
    </AbsoluteFill>
  );
};
