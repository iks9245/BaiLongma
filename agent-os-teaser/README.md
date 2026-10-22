# Agent OS — 15s keynote teaser

Remotion (TypeScript) project. 1920×1080, 30fps.

| Composition | Length | Rendered |
| --- | --- | --- |
| `AgentOS` | 0–15s: Introducing / Say it / You decide | `agent-os.mp4` |
| `AgentOSPart2` | 15–30s: It knows you / While you sleep / Finale | `agent-os-part2.mp4` |
| `AgentOSPart3` | 30–45s: One more thing / It talks to theirs / Together | `agent-os-part3.mp4` |
| `AgentOSPart4` | 45–60s: Private by design / One agent. Every app. / Simple. Personal. Yours. | `agent-os-part4.mp4` |
| `AgentOSFull` | all four, 60s | `agent-os-full.mp4` |

```bash
npm install
npm run dev                     # Remotion Studio preview
npm run render                  # → out/agent-os.mp4
npx remotion render AgentOSPart2 out/agent-os-part2.mp4
npx remotion render AgentOSPart3 out/agent-os-part3.mp4
npx remotion render AgentOSPart4 out/agent-os-part4.mp4
npx remotion render AgentOSFull out/agent-os-full.mp4
npx remotion still AgentOS out/f90.png --frame=90
```

- `src/tokens.ts` — colours, type sizes, easing
- `src/components/Orb.tsx` — the orb (`color`, `size`, `breathe`)
- `src/components/Check.tsx` — blue tick that draws in
- `src/scenes/` — twelve 150-frame scenes: `Intro`, `Say`, `Decide`, `Knows`, `Sleep`, `Finale`, `More`, `Talk`, `Together`, `Private`, `Apps`, `Words`
- `public/fonts` — Inter (OFL), bundled so renders work offline
