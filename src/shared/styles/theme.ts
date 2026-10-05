import type { AppTheme } from './types';

export const theme: AppTheme = {
  colors: {
    bg: '#0a0a0a',
    surface: '#141414',
    text: '#f4f1ec',
    textMuted: '#8b8985',
    categories: {
      text: '#E63946',
      artwork: '#2A9D8F',
      sketch: '#57CC99',
      symbol: '#E9C46A',
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
