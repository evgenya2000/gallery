import type { PropsWithChildren } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from '../../shared/styles/theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
