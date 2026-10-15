import { createGlobalStyle } from 'styled-components';
import { mediaBreakpointDown } from '../../shared/styles/mixins';

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Roboto Mono';
    src: url('${import.meta.env.BASE_URL}fonts/RobotoMono-VariableFont_wght.woff2')
      format('woff2-variations');
    font-weight: 100 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto Mono';
    src: url('${import.meta.env.BASE_URL}fonts/RobotoMono-Italic-VariableFont_wght.woff2')
      format('woff2-variations');
    font-weight: 100 700;
    font-style: italic;
    font-display: swap;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

  ${mediaBreakpointDown('compact')} {
    html,
    body,
    #root {
      height: auto;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }

    body {
      min-height: 100dvh;
    }
  }

  body {
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo,
      Consolas, 'Liberation Mono', monospace;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  button {
    color: inherit;
    font: inherit;
  }

  @media (hover: none) and (pointer: coarse) {
    button:active,
    a:active {
      opacity: 0.68;
      transition: opacity 140ms ease;
    }
  }

  :focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  ::selection {
    color: ${({ theme }) => theme.colors.bg};
    background: ${({ theme }) => theme.colors.categories.artwork};
  }
`;
