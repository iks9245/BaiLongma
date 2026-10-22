import React from "react";
import { colors } from "../tokens";

// Blue tick whose stroke draws in as `progress` goes 0 → 1.
export const Check: React.FC<{ progress: number; size?: number }> = ({
  progress,
  size = 33,
}) => (
  <svg
    aria-hidden
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.orbBlue}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);
