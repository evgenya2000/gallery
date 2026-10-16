# Agent Instructions: Gallery

## Project Overview

`gallery` is a single-page React application that presents an interactive art collection titled **"Что такое дом?"** ("What is a home?").

On desktop, the experience is built around a fixed pan-and-zoom canvas (`1440×935 px`) rendered by `react-zoom-pan-pinch`. Users can drag, zoom, and click cards to reveal artwork descriptions, personal stories, and participation prompts. On compact viewports (`≤767 px`) the canvas switches to a scrollable mobile layout (`1040×800 px`).

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
    CardModal/         # Modal for card content
      ui/CardModal.tsx
      index.ts
    InfoModal/         # Information / about modal
      ui/InfoModal.tsx
      index.ts
    PanZoomCanvas/     # Pan/zoom wrapper around the grid
      ui/PanZoomCanvas.tsx
      index.ts
  entities/
    Card/              # Card data, types, and card UI
      model/
        cards.ts       # 36 cards + central participation card
        types.ts
      ui/
        Card.tsx
      index.ts
  shared/
    assets/            # Background images (PNG)
    hooks/             # useMediaQuery
    styles/            # theme, mixins, types
public/
  artworks/            # 20 SVG artwork files (artwork-01.svg … artwork-20.svg)
  fonts/               # RobotoMono variable + italic WOFF2
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

- Background: `#F7F7F7`
- Surface: `#141414`
- Primary text: `#000000`
- Muted text: `#8b8985`
- Category colors:
  - `text`: `#E63946`
  - `artwork`: `#2A9D8F`
  - `sketch`: `#57CC99`
  - `symbol`: `#E9C46A`
- Card border radius: `16px`
- Modal border radius: `24px`
- Breakpoints (see `src/shared/styles/mixins.ts`):
  - `phone`: `560px`
  - `tablet`: `768px`
  - `compact`: `1200px`
  - `xxl`: `1440px`

## Canvas & Layout

- Desktop canvas size: `1440×935 px` (defined in `PanZoomCanvas.tsx` and `InteractiveGrid.tsx`).
- Mobile canvas size: `1040×800 px`.
- Mobile switch: `PanZoomCanvas.tsx` uses `(max-width: 767px)`; `InteractiveGrid.tsx` uses `mediaBreakpointDown('tablet', true)` → `(max-width: 768px)`.
- On desktop, the page hides scrollbars and fills the viewport; on mobile it switches to a flowing, scrollable layout.

## Cards & Modals

- 36 numbered cards (`id` 1–36) plus one central participation card.
- Each card has a `category` (`text`, `artwork`, `sketch`, `symbol`) and a `presentation` (`image`, `quote`).
- Modal content types (`CardModalType`):
  - `photo-story`
  - `portrait-photo-story`
  - `artist-work`
  - `personal-story`
  - `participation` (used by the central card)
- Card data and positions are defined in `src/entities/Card/model/cards.ts`.

## Assets

- Artworks are stored as individual SVG files in `public/artworks/` (20 files: `artwork-01.svg` … `artwork-20.svg`) and referenced by filename in the card data.
- Background image assets live in `src/shared/assets/`.
- Fonts are loaded from `public/fonts/` via `GlobalStyles.ts`.

## Deployment Notes

- `vite.config.ts` sets `base: '/gallery/'`, so all asset paths are relative to that base.
- `npm run deploy` builds the project and pushes the `dist/` directory to the `gh-pages` branch.

## Notes for Agents

- Prefer adding new artwork by placing an SVG in `public/artworks/` and registering it in `src/entities/Card/model/cards.ts`.
- When editing the canvas layout, keep `DESKTOP_CANVAS_WIDTH` / `DESKTOP_CANVAS_HEIGHT` and `MOBILE_CANVAS_WIDTH` / `MOBILE_CANVAS_HEIGHT` in sync between `src/features/PanZoomCanvas/ui/PanZoomCanvas.tsx` and `src/widgets/InteractiveGrid/ui/InteractiveGrid.tsx`.
- On desktop, the page hides scrollbars and fills the viewport; on mobile (`≤767 px`) it switches to a flowing, scrollable layout.
- Avoid introducing new global CSS files; extend `GlobalStyles.ts` or use component-scoped styled-components.
