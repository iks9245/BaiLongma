# Agent OS — 15s keynote teaser

Remotion (TypeScript) project. 1920×1080, 30fps.

| Composition | Length | Rendered |
| --- | --- | --- |
| `AgentOS` | 0–15s: Introducing / Say it / You decide | `agent-os.mp4` |
| `AgentOSPart2` | 15–30s: It knows you / While you sleep / Finale | `agent-os-part2.mp4` |
| `AgentOSFull` | both, 30s | `agent-os-full.mp4` |

```bash
npm install
npm run dev                     # Remotion Studio preview
npm run render                  # → out/agent-os.mp4
npx remotion render AgentOSPart2 out/agent-os-part2.mp4
npx remotion render AgentOSFull out/agent-os-full.mp4
npx remotion still AgentOS out/f90.png --frame=90
```

- `src/tokens.ts` — colours, type sizes, easing
- `src/components/Orb.tsx` — the orb (`color`, `size`, `breathe`)
- `src/components/Check.tsx` — blue tick that draws in
- `src/scenes/` — six 150-frame scenes: `Intro`, `Say`, `Decide`, `Knows`, `Sleep`, `Finale`
- `public/fonts` — Inter (OFL), bundled so renders work offline
