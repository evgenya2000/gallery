import 'styled-components';

export type ThemeCardCategory = 'text' | 'artwork' | 'sketch' | 'symbol';

export interface AppTheme {
  colors: {
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    categories: Record<ThemeCardCategory, string>;
  };
  radii: {
    card: string;
    modal: string;
  };
  shadows: {
    card: string;
    modal: string;
  };
  transitions: {
    card: string;
    modal: string;
  };
}

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
