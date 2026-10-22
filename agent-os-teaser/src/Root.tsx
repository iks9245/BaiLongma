import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { Decide } from "./scenes/Decide";
import { Finale } from "./scenes/Finale";
import { Intro } from "./scenes/Intro";
import { Knows } from "./scenes/Knows";
import { Say } from "./scenes/Say";
import { Sleep } from "./scenes/Sleep";
import { colors, FPS, HEIGHT, SCENE, WIDTH } from "./tokens";

const Scenes: React.FC<{
  scenes: { name: string; component: React.FC }[];
}> = ({ scenes }) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    {scenes.map(({ name, component: Scene }, i) => (
      <Sequence key={name} from={SCENE * i} durationInFrames={SCENE} name={name}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const PART_1 = [
  { name: "Intro", component: Intro },
  { name: "Say it", component: Say },
  { name: "You decide", component: Decide },
];

const PART_2 = [
  { name: "It knows you", component: Knows },
  { name: "While you sleep", component: Sleep },
  { name: "Finale", component: Finale },
];

const AgentOS: React.FC = () => <Scenes scenes={PART_1} />;
const AgentOSPart2: React.FC = () => <Scenes scenes={PART_2} />;
const AgentOSFull: React.FC = () => <Scenes scenes={[...PART_1, ...PART_2]} />;

const video = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AgentOS"
      component={AgentOS}
      durationInFrames={SCENE * 3}
      {...video}
    />
    <Composition
      id="AgentOSPart2"
      component={AgentOSPart2}
      durationInFrames={SCENE * 3}
      {...video}
    />
    <Composition
      id="AgentOSFull"
      component={AgentOSFull}
      durationInFrames={SCENE * 6}
      {...video}
    />
  </>
);
