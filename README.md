# Shuffman

Personal site for Scott Huffman — UI/UX development portfolio with an interactive fluid simulation background.

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [fluid-canvas](https://github.com/canderis/Fluid-JS) (`github:canderis/Fluid-JS#v1.0.0`) for the WebGL background

## Getting started

```bash
npm install
npm start
```

The dev server runs at [http://localhost:8080](http://localhost:8080).

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Build and preview the production output |
| `npm run ts:lint` | Type-check with TypeScript |
| `npm run lint` | Lint `src/` with ESLint |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run prettier` | Format project files |

## Project structure

```
src/
  app.tsx              App shell
  home.tsx             Landing page with fluid canvas
  fluid-sim.ts         Re-exports the fluid simulation entry
  fluid/
    index.ts           Simulation loop orchestrator
    constants.ts       Tunable sim parameters
    pointers.ts        Spawn / densify pointers
    population.ts      Appear / disappear oscillation
    forces.ts          Attract, repel, and motion
    repel.ts           Pairwise repel timers
    math.ts            Shared math helpers
  styles.css           Tailwind theme and global styles
  index.tsx            Entry point
assets/                Texture used by the fluid sim
public/                Static hosting config
```

## Fluid background

The canvas background is powered by `fluid-canvas`. Pointer movement and keyboard shortcuts are configured in `src/home.tsx`:

- **Mouse** — steers the primary pointer
- **N** — pause / resume the simulation

Simulation behavior lives under `src/fluid/`.
