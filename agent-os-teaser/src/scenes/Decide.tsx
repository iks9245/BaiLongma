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

// Scene timing, in frames relative to the scene start (10.0s).
const T = {
  acts: 0,
  decide: 15,
  card: [30, 60],
  amber: [30, 48],
  press: 105,
  release: 109,
  out: [120, 135],
  orbHome: [120, 140],
  orbOut: [138, 150],
} as const;

// Offset from the orb's slot in the card header to frame centre, so it can
// drift there once the card is gone (card is 960 wide, centred; header row
// sits ~36px above frame centre).
const ORB_TO_CENTRE = { x: 960 - (480 + 54 + 27), y: 36 };

export const Decide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeUp = (start: number) =>
    interpolate(frame, [start, start + 20], [0, 1], {
      ...clamp,
      easing: ease.out,
    });
  const actsIn = fadeUp(T.acts);
  const decideIn = fadeUp(T.decide);

  const cardIn = spring({ frame: frame - T.card[0], fps, config: springConfig });
  const cardOpacity = interpolate(frame, T.card, [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const outT = interpolate(frame, T.out, [0, 1], { ...clamp, easing: ease.in });

  // Orb: blue → amber as the card arrives (and stops breathing), back to
  // blue once approved.
  const amber =
    interpolate(frame, T.amber, [0, 1], clamp) *
    (1 - interpolate(frame, T.out, [0, 1], clamp));
  const breathe = 1 - amber;
  const holding = frame >= T.card[1] && frame < T.press;
  const flicker = holding
    ? 0.95 + 0.05 * Math.sin(frame * 0.9) * Math.sin(frame * 0.37 + 1)
    : 1;
  const orbOpacity =
    cardOpacity *
    flicker *
    (1 - interpolate(frame, T.orbOut, [0, 1], { ...clamp, easing: ease.in }));

  // Approve: dip to 96%, spring back, brighten.
  const dip = interpolate(frame, [T.press, T.release], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const rebound = spring({
    frame: frame - T.release,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const pressScale = 1 - 0.04 * dip * (1 - rebound);
  const lit = interpolate(frame, [T.release, T.release + 6], [0, 1], clamp);

  const contentOpacity = cardOpacity * (1 - outT);
  const home = interpolate(frame, T.orbHome, [0, 1], {
    ...clamp,
    easing: ease.inOut,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 90,
          marginTop: -24,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: size.decide,
            lineHeight: 1,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            textAlign: "center",
            whiteSpace: "nowrap",
            opacity: 1 - outT,
          }}
        >
          <span
            style={{
              display: "inline-block",
              opacity: actsIn,
              transform: `translateY(${24 * (1 - actsIn)}px)`,
            }}
          >
            It acts.
          </span>{" "}
          <span
            style={{
              display: "inline-block",
              opacity: decideIn,
              transform: `translateY(${24 * (1 - decideIn)}px)`,
            }}
          >
            You decide.
          </span>
        </h1>

        {/* Confirmation card. Background and content fade separately so the
            orb can stay behind on black. */}
        <div
          style={{
            position: "relative",
            width: 960,
            boxSizing: "border-box",
            padding: 54,
            display: "flex",
            flexDirection: "column",
            gap: 45,
            transform: `translateY(${220 * (1 - cardIn)}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              border: `1.5px solid ${colors.cardBorder}`,
              background: colors.card,
              boxShadow: "0 45px 150px rgba(255, 179, 64, 0.10)",
              opacity: contentOpacity,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 21,
            }}
          >
            <div
              style={{
                transform: `translate(${ORB_TO_CENTRE.x * home}px, ${ORB_TO_CENTRE.y * home}px) scale(${1 + 0.5 * home})`,
              }}
            >
              <Orb
                color={colors.orbBlue}
                size={54}
                breathe={breathe}
                amber={amber}
                opacity={orbOpacity}
              />
            </div>
            <div
              style={{
                fontSize: 31.5,
                fontWeight: 400,
                color: colors.orbAmber,
                opacity: contentOpacity,
              }}
            >
              Your agent needs a yes
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 15,
              opacity: contentOpacity,
            }}
          >
            <div
              style={{
                fontSize: 54,
                lineHeight: 1.15,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Book flight to Tokyo
            </div>
            <div
              style={{
                fontSize: 33,
                fontWeight: 300,
                color: colors.textSecondary,
              }}
            >
              Thu 6 Nov · Economy · HK$2,400
            </div>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              gap: 24,
              opacity: contentOpacity,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 96,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 33,
                fontWeight: 600,
                color: "#000000",
                background: interpolateColors(
                  lit,
                  [0, 1],
                  [colors.text, "#ffffff"],
                ),
                boxShadow: `0 0 ${60 * lit}px rgba(255, 255, 255, ${0.35 * lit})`,
                transform: `scale(${pressScale})`,
              }}
            >
              Approve
            </div>
            <div
              style={{
                flex: 1,
                height: 96,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 33,
                fontWeight: 600,
                background: colors.cardBorder,
                color: colors.text,
              }}
            >
              Not now
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
