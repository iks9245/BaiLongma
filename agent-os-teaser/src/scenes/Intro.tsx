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

// Scene 1 (0–150): the orb arrives, then the name.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0–30: orb fades in. 30–60: grows to ~250px.
  const orbOpacity = interpolate(frame, [0, 30], [0, 1], {
    ...clamp,
    easing: ease.out,
  });
  const orbSize = interpolate(frame, [30, 60], [150, 252], {
    ...clamp,
    easing: ease.inOut,
  });

  // 30–60: "Introducing".
  const introOpacity = interpolate(frame, [36, 60], [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // 60–105: title rises 36px.
  const titleIn = spring({ frame: frame - 60, fps, config: springConfig });
  const titleOpacity = interpolate(frame, [60, 84], [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // 105–135: subtitle.
  const subIn = interpolate(frame, [105, 133], [0, 1], {
    ...clamp,
    easing: ease.out,
  });

  // 135–150: everything shrinks slightly and fades.
  const outT = interpolate(frame, [135, 150], [0, 1], {
    ...clamp,
    easing: ease.in,
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
          gap: 66,
          transform: `scale(${1 - 0.05 * outT})`,
          opacity: 1 - outT,
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
          <div
            style={{
              fontSize: size.introducing,
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: colors.textSecondary,
              opacity: introOpacity,
            }}
          >
            Introducing
          </div>
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
  );
};
