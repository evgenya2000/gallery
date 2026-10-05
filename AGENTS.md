# Agent Instructions: Gallery

## Project Overview

`gallery` is a single-page React application that presents an interactive, pan-and-zoom art collection titled **"Что такое дом?"** ("What is a home?"). The UI is built around a large fixed canvas (`1400×1100 px`) where users can drag, zoom, and click cards to reveal artwork descriptions. On compact viewports the canvas becomes a scrollable grid instead.

The project is deployed to GitHub Pages under the `/gallery/` base path.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Build tool | Vite 8.x |
| Framework | React 18.x |
| Language | TypeScript 5.8.x (strict mode) |
| Styling | styled-components 6.x |
| Animation | framer-motion 12.x |
| Pan / zoom | react-zoom-pan-pinch 4.x |
| Deployment | gh-pages |

## Project Structure

The codebase follows a lightweight Feature-Sliced Design (FSD) layout:

```
src/
  app/                 # App shell, providers, global styles
    App.tsx
    providers/
      GlobalStyles.ts
      ThemeProvider.tsx
  pages/
    HomePage/          # Single page composing the experience
      ui/HomePage.tsx
      index.ts
  widgets/
    InteractiveGrid/   # Grid of cards rendered on the canvas
      ui/InteractiveGrid.tsx
      index.ts
  features/
    CardModal/         # Detail modal for a selected card
    InfoModal/         # Guide / contacts modal
    PanZoomCanvas/     # Zoom/pan wrapper around the grid
  entities/
    Card/              # Card data model, types, and card UI
      model/
      ui/
      index.ts
  shared/
    assets/            # Background images
    styles/            # Theme, theme types
public/
  artworks/            # 20 SVG artworks (artwork-01.svg … artwork-20.svg)
```

## Development Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview

# Deploy the `dist/` folder to GitHub Pages
npm run deploy
```

## Key Conventions

- **Strict TypeScript**: `strict`, `noUnusedLocals`, and `noUnusedParameters` are enabled. Unused imports and variables will fail the build.
- **Module system**: ES modules (`"type": "module"`). Use `.ts`/`.tsx` and ES import syntax.
- **Component exports**: Each FSD slice exposes its public API through an `index.ts` file (e.g., `export { CardModal } from './ui/CardModal';`).
- **Styled components**: All styling is done with `styled-components`. Theme values live in `src/shared/styles/theme.ts` and are accessed via `${({ theme }) => ...}`.
- **Russian UI copy**: The visible interface is in Russian. Keep new user-facing text in Russian unless explicitly asked otherwise.
- **Accessibility**: Modals use `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and close on `Escape` and overlay click.

## Theme & Styling

- Background: `#0a0a0a`
- Surface: `#141414`
- Primary text: `#f4f1ec`
- Muted text: `#8b8985`
- Category colors:
  - `text`: `#E63946`
  - `artwork`: `#2A9D8F`
  - `sketch`: `#57CC99`
  - `symbol`: `#E9C46A`
- Card border radius: `16px`
- Modal border radius: `24px`
- Breakpoints:
  - Compact / mobile layout: `< 1200px`
  - Small modal adjustments: `< 560px`

## Assets

- Artworks are stored as individual SVG files in `public/artworks/` and referenced by filename in the card data.
- Background image assets live in `src/shared/assets/`.

## Deployment Notes

- `vite.config.ts` sets `base: '/gallery/'`, so all asset paths are relative to that base.
- `npm run deploy` builds the project and pushes the `dist/` directory to the `gh-pages` branch.

## Notes for Agents

- Prefer adding new artwork by placing an SVG in `public/artworks/` and registering it in `src/entities/Card/model/cards.ts` (or the equivalent card data source).
- When editing the canvas layout, keep `CANVAS_WIDTH` / `CANVAS_HEIGHT` in sync with `src/features/PanZoomCanvas/ui/PanZoomCanvas.tsx` and the grid definitions in `InteractiveGrid`.
- On desktop, the page hides scrollbars and fills the viewport; on mobile (`< 1200px`) it switches to a flowing, scrollable layout.
- Avoid introducing new global CSS files; extend `GlobalStyles.ts` or use component-scoped styled-components.
