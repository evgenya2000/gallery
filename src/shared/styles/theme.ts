import type { AppTheme } from './types';

export const theme: AppTheme = {
  colors: {
    bg: '#F7F7F7',
    surface: '#141414',
    text: '#000',
    textMuted: '#8b8985',
    categories: {
      text: '#E63946',
      artwork: '#2A9D8F',
      sketch: '#57CC99',
      symbol: '#E9C46A',
    },
    guide: {
      badge: {
        projects: '#8B2E3D',
        stories: '#6E7D8B',
        photos: '#2A2A2A',
      },
    },
  },
  radii: {
    card: '16px',
    modal: '24px',
  },
  shadows: {
    card: '0 18px 44px rgba(0, 0, 0, 0.38)',
    modal: '0 32px 100px rgba(0, 0, 0, 0.62)',
  },
  transitions: {
    card: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    modal: 'all 420ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
};