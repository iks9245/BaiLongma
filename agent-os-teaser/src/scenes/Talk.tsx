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
import { clamp, colors, ease, font, size, springConfig } from "../tokens";

// Where the two agents sit; shared with the scenes either side.
export const PAIR = {
  left: { x: 360, y: 640 },
  right: { x: 1560, y: 640 },
  size: 120,
};

const CHAT = { left: 600, top: 450, width: 720 };

const MESSAGES = [
  { from: "left", text: "Dinner Friday?", at: 34 },
  { from: "right", text: "Sam's free after 7.", at: 56 },
  { from: "left", text: "Quiet place near Central, 7:30?", at: 78 },
  { from: "right", text: "Works. Book it.", at: 100 },
] as const;

// Scene timing, in frames relative to the scene start (35.0s).
const T = {
  title: 0,
  sub: 20,
  labels: 8,
  booked: 118,
  out: [128, 148],
} as const;

const kick = (frame: number, at: number) =>
  interpolate(frame - at, [0, 4, 14], [0, 1, 0], clamp);

// Two agents settle a plan between themselves.
export const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeUp = (start: number) =>
    interpolate(frame, [start, start + 20], [0, 1], {
      ...clamp,
      easing: ease.out,
    });
  const titleIn = fadeUp(T.title);
  const subIn = fadeUp(T.sub);
  const labelsIn = fadeUp(T.labels);
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });

  const bookedIn = spring({ frame: frame - T.booked, fps, config: springConfig });
  const bookedOpacity = fadeUp(T.booked);
  const bookedDraw = interpolate(frame, [T.booked + 2, T.booked + 14], [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });

  // Each agent pulses as it sends; both pulse when the booking lands.
  const pulseFor = (side: "left" | "right") =>
    1 +
    MESSAGES.filter((m) => m.from === side).reduce(
      (sum, m) => sum + 0.1 * kick(frame, m.at),
      0,
    ) +
    0.12 * kick(frame, T.booked);

  const bubbleBase: React.CSSProperties = {
    padding: "18px 30px",
    background: colors.card,
    border: `1.5px solid ${colors.cardBorder}`,
    fontSize: 31.5,
    lineHeight: 1.25,
    maxWidth: 560,
  };

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
            opacity: titleIn,
            transform: `translateY(${24 * (1 - titleIn)}px)`,
          }}
        >
          It talks to theirs.
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
          So you don't have to.
        </div>
      </div>

      {/* Conversation */}
      <div
        style={{
          position: "absolute",
          left: CHAT.left,
          top: CHAT.top,
          width: CHAT.width,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          opacity: 1 - outT,
        }}
      >
        {MESSAGES.map((m) => {
          const t = interpolate(frame, [m.at, m.at + 12], [0, 1], {
            ...clamp,
            easing: ease.out,
          });
          const left = m.from === "left";
          return (
            <div
              key={m.text}
              style={{
                ...bubbleBase,
                alignSelf: left ? "flex-start" : "flex-end",
                borderRadius: left ? "36px 36px 36px 12px" : "36px 36px 12px 36px",
                opacity: t,
                transform: `translateX(${(left ? -40 : 40) * (1 - t)}px)`,
              }}
            >
              {m.text}
            </div>
          );
        })}
        <div
          style={{
            alignSelf: "center",
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 15,
            fontSize: 31.5,
            fontWeight: 600,
            opacity: bookedOpacity,
            transform: `translateY(${16 * (1 - bookedIn)}px)`,
          }}
        >
          <Check progress={bookedDraw} />
          <div>Booked for both · Fri 7:30 PM</div>
        </div>
      </div>

      {/* The two agents */}
      {(["left", "right"] as const).map((side) => {
        const p = PAIR[side];
        return (
          <React.Fragment key={side}>
            <div
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
                pulse={pulseFor(side)}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: p.x - 150,
                width: 300,
                top: p.y + PAIR.size / 2 + 42,
                textAlign: "center",
                fontSize: 30,
                fontWeight: 300,
                color: colors.textSecondary,
                opacity: labelsIn * (1 - outT),
              }}
            >
              {side === "left" ? "Your agent" : "Sam's agent"}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
