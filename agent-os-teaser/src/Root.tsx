import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Decide } from "./scenes/Decide";
import { Intro } from "./scenes/Intro";
import { Say } from "./scenes/Say";
import { colors, FPS, HEIGHT, SCENE, WIDTH } from "./tokens";

const AgentOS: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Sequence durationInFrames={SCENE} name="Intro">
      <Intro />
    </Sequence>
    <Sequence from={SCENE} durationInFrames={SCENE} name="Say it">
      <Say />
    </Sequence>
    <Sequence from={SCENE * 2} durationInFrames={SCENE} name="You decide">
      <Decide />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AgentOS"
    component={AgentOS}
    durationInFrames={SCENE * 3}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
