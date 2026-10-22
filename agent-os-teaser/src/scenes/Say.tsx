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
  size,
  springConfig,
  WIDTH,
} from "../tokens";

const COMMAND = "Book a quiet table for two. Friday, near Central.";
const STEPS = [
  "Found 3 quiet places",
  "Checked both calendars",
  "Reserved for 7:30 PM",
];

const PAD_X = 168;
const PHONE_W = 510;
const PHONE_H = 960;
const PHONE_BORDER = 3;
const PHONE_PAD = { top: 54, side: 45, bottom: 48 };
const PHONE_LEFT = WIDTH - PAD_X - PHONE_W;
const PHONE_TOP = (HEIGHT - PHONE_H) / 2;
const ORB_SIZE = 72;

// Scene timing, in frames relative to the scene start (5.0s).
const T = {
  subIn: 21,
  phoneIn: [21, 45],
  typing: [45, 81],
  steps: 81,
  stepGap: 15,
  out: [125, 150],
} as const;

export const Say: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Say it." slides in from the left.
  const sayIn = spring({ frame, fps, config: springConfig });
  const sayOpacity = interpolate(frame, [0, 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const subOpacity = interpolate(frame, [T.subIn, T.subIn + 18], [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // Phone floats up from below.
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

  // Orb: appears where the phone will be, then shrinks into its top.
  const orbOpacity =
    interpolate(frame, [0, 15], [0, 1], { ...clamp, easing: ease.out }) *
    (1 - outT);
  const orbT = interpolate(frame, T.phoneIn, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });
  const orbTargetX =
    PHONE_LEFT + PHONE_BORDER + PHONE_PAD.side + ORB_SIZE / 2;
  const orbTargetY =
    PHONE_TOP + PHONE_BORDER + PHONE_PAD.top + ORB_SIZE / 2 + phoneY;
  const orbX = interpolate(orbT, [0, 1], [PHONE_LEFT + PHONE_W / 2, orbTargetX]);
  const orbY = interpolate(orbT, [0, 1], [HEIGHT / 2, orbTargetY]);
  const orbSize = interpolate(orbT, [0, 1], [150, ORB_SIZE]);

  // Typing: one character at a time, orb pulses with it.
  const typed = Math.round(
    interpolate(frame, T.typing, [0, COMMAND.length], clamp),
  );
  const typing = frame >= T.typing[0] && frame < T.typing[1] + 4;
  const pulse = typing ? 1 + 0.1 * Math.abs(Math.sin(frame * 0.55)) : 1;
  const caretOn =
    frame >= T.typing[0] - 6 && frame < T.typing[1] + 10 && frame % 16 < 10;

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
            fontSize: size.sayIt,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            opacity: sayOpacity,
            transform: `translateX(${-120 * (1 - sayIn)}px)`,
          }}
        >
          Say it.
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            fontSize: 57,
            lineHeight: 1.25,
            fontWeight: 300,
            color: colors.textSecondary,
            opacity: subOpacity,
            transform: `translateY(${12 * (1 - subOpacity)}px)`,
          }}
        >
          <div>No apps. No menus.</div>
          <div>Just what you want.</div>
        </div>
      </div>

      {/* Right: phone outline */}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          {/* Slot the orb lands in. */}
          <div style={{ width: ORB_SIZE, height: ORB_SIZE }} />
          <div
            style={{
              fontSize: 45,
              lineHeight: 1.25,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{COMMAND.slice(0, typed)}</span>
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: 46,
                marginLeft: 2,
                marginRight: -5,
                verticalAlign: "-8px",
                background: colors.orbBlue,
                opacity: caretOn ? 1 : 0,
              }}
            />
            {/* Reserve the full layout so lines never reflow while typing. */}
            <span style={{ color: "transparent" }}>{COMMAND.slice(typed)}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 27,
            fontSize: 28.5,
            color: colors.textTertiary,
          }}
        >
          {STEPS.map((step, i) => {
            const start = T.steps + i * T.stepGap;
            const rowIn = interpolate(frame, [start, start + 10], [0, 1], {
              ...clamp,
              easing: ease.out,
            });
            const draw = interpolate(frame, [start + 2, start + 14], [0, 1], {
              ...clamp,
              easing: ease.inOut,
            });
            const last = i === STEPS.length - 1;
            return (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 21,
                  opacity: rowIn,
                  transform: `translateY(${10 * (1 - rowIn)}px)`,
                  color: last ? colors.text : undefined,
                  fontWeight: last ? 600 : 400,
                }}
              >
                <Check progress={draw} />
                <div>{step}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orb, positioned in frame space so it can travel into the phone. */}
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
          breathe
          pulse={pulse}
          opacity={orbOpacity}
        />
      </div>
    </AbsoluteFill>
  );
};
