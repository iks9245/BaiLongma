import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Check } from "../components/Check";
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

// Mirror of the "Say it." layout: phone on the left, words on the right.
const PAD_X = 168;
const PHONE_W = 510;
const PHONE_H = 960;
const PHONE_BORDER = 3;
const PHONE_PAD = { top: 54, side: 45, bottom: 48 };
const PHONE_LEFT = PAD_X;
const PHONE_TOP = (HEIGHT - PHONE_H) / 2;
const TEXT_LEFT = PHONE_LEFT + PHONE_W + 150;
const ORB_SIZE = 72;

const FEED = [
  { time: "02:14", text: "Rebooked delayed flight", at: 50 },
  { time: "05:40", text: "Moved gym to 7:30", at: 68 },
  { time: "06:55", text: "Morning brief ready", at: 86 },
];
const ASK = { time: "07:00", text: "One thing needs you", at: 104 };

// Scene timing, in frames relative to the scene start (20.0s).
const T = {
  // Headline waits until the orb has crossed to the phone.
  head: 12,
  sub: 30,
  phoneIn: [10, 34],
  amber: [104, 116],
  out: [125, 150],
} as const;

const clockAt = (frame: number) => {
  const changes = [
    { at: 0, time: FEED[0].time },
    ...FEED.slice(1).map((f) => ({ at: f.at, time: f.time })),
    { at: ASK.at, time: ASK.time },
  ];
  return [...changes].reverse().find((c) => frame >= c.at) ?? changes[0];
};

export const Sleep: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Words slide in from the right.
  const headIn = spring({ frame: frame - T.head, fps, config: springConfig });
  const headOpacity = interpolate(frame, [T.head, T.head + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subOpacity = interpolate(frame, [T.sub, T.sub + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // Phone floats up.
  const phoneIn = spring({
    frame: frame - T.phoneIn[0],
    fps,
    config: springConfig,
  });
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });
  const phoneY = 160 * (1 - phoneIn) + 140 * outT;
  const phoneOpacity =
    interpolate(frame, T.phoneIn, [0, 1], { ...clamp, easing: ease.out }) *
    (1 - outT);

  // Orb: picked up at frame centre, shrinks into the phone's top-left.
  const orbT = interpolate(frame, [0, T.phoneIn[1]], [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbX = interpolate(
    orbT,
    [0, 1],
    [WIDTH / 2, PHONE_LEFT + PHONE_BORDER + PHONE_PAD.side + ORB_SIZE / 2],
  );
  const orbY = interpolate(
    orbT,
    [0, 1],
    [
      HEIGHT / 2,
      PHONE_TOP + PHONE_BORDER + PHONE_PAD.top + ORB_SIZE / 2 + phoneY,
    ],
  );
  const orbSize = interpolate(orbT, [0, 1], [150, ORB_SIZE]);
  const amber = interpolate(frame, T.amber, [0, 1], clamp);
  const pulse =
    1 +
    [...FEED, ASK].reduce(
      (sum, f) =>
        sum + 0.1 * interpolate(frame - f.at, [0, 4, 14], [0, 1, 0], clamp),
      0,
    );

  // Clock jumps forward as each overnight task lands.
  const clock = clockAt(frame);
  const tick =
    clock.at === 0
      ? 1
      : interpolate(frame - clock.at, [0, 8], [0, 1], {
          ...clamp,
          easing: ease.out,
        });

  const rowIn = (at: number) =>
    interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: ease.out });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      {/* Right: headline */}
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
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
            transform: `translateX(${120 * (1 - headIn)}px)`,
          }}
        >
          Even while
          <br />
          you sleep.
        </h1>
        <div
          style={{
            fontSize: 57,
            lineHeight: 1.25,
            fontWeight: 300,
            color: colors.textSecondary,
            opacity: subOpacity,
            transform: `translateY(${12 * (1 - subOpacity)}px)`,
          }}
        >
          It keeps working. Quietly.
        </div>
      </div>

      {/* Left: phone at night */}
      <div
        style={{
          position: "absolute",
          left: PHONE_LEFT,
          top: PHONE_TOP,
          width: PHONE_W,
          height: PHONE_H,
          boxSizing: "border-box",
          borderRadius: 84,
          border: `${PHONE_BORDER}px solid ${colors.cardBorder}`,
          background: colors.phone,
          padding: `${PHONE_PAD.top}px ${PHONE_PAD.side}px ${PHONE_PAD.bottom}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 60px 180px rgba(108, 182, 255, 0.12)",
          opacity: phoneOpacity,
          transform: `translateY(${phoneY}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {/* Slot the orb lands in. */}
          <div style={{ width: ORB_SIZE, height: ORB_SIZE }} />
          <div
            style={{
              fontSize: 132,
              lineHeight: 1,
              fontWeight: 200,
              letterSpacing: font.tracking,
              fontVariantNumeric: "tabular-nums",
              opacity: 0.4 + 0.6 * tick,
              transform: `translateY(${10 * (1 - tick)}px)`,
            }}
          >
            {clock.time}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 30,
            fontSize: 28.5,
            color: colors.textTertiary,
          }}
        >
          {FEED.map((f) => {
            const t = rowIn(f.at);
            const draw = interpolate(frame, [f.at + 2, f.at + 14], [0, 1], {
              ...clamp,
              easing: ease.inOut,
            });
            return (
              <div
                key={f.text}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 21,
                  opacity: t,
                  transform: `translateY(${10 * (1 - t)}px)`,
                }}
              >
                <div style={{ paddingTop: 30 }}>
                  <Check progress={draw} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 22.5, color: colors.textSecondary }}>
                    {f.time}
                  </div>
                  <div>{f.text}</div>
                </div>
              </div>
            );
          })}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 21,
              opacity: rowIn(ASK.at),
              transform: `translateY(${10 * (1 - rowIn(ASK.at))}px)`,
            }}
          >
            <div style={{ paddingTop: 32, paddingLeft: 3, paddingRight: 3 }}>
              <div
                aria-hidden
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 38% 32%, #ffffff 0%, ${colors.orbAmber} 42%, ${colors.orbAmberDeep} 100%)`,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 22.5, color: colors.textSecondary }}>
                {ASK.time}
              </div>
              <div style={{ color: colors.orbAmber, fontWeight: 600 }}>
                {ASK.text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orb, in frame space so it can travel into the phone. */}
      <div
        style={{
          position: "absolute",
          left: orbX - orbSize / 2,
          top: orbY - orbSize / 2,
        }}
      >
        <Orb
          color={colors.orbBlue}
          size={orbSize}
          breathe={1 - amber}
          amber={amber}
          pulse={pulse}
          opacity={1 - outT}
        />
      </div>
    </AbsoluteFill>
  );
};
