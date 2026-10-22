# Agent OS — 15s keynote teaser

Remotion (TypeScript) project. 1920×1080, 30fps, 450 frames, composition `AgentOS`.
Rendered output: `agent-os.mp4`.

```bash
npm install
npm run dev                     # Remotion Studio preview
npm run render                  # → out/agent-os.mp4
npx remotion still AgentOS out/f90.png --frame=90
```

- `src/tokens.ts` — colours, type sizes, easing
- `src/components/Orb.tsx` — the orb (`color`, `size`, `breathe`)
- `src/scenes/Intro.tsx`, `Say.tsx`, `Decide.tsx` — 150 frames each
- `public/fonts` — Inter (OFL), bundled so renders work offline
