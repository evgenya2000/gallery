import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }

  @media (max-width: 1199px) {
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
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  button {
    color: inherit;
    font: inherit;
  }

  ::selection {
    color: ${({ theme }) => theme.colors.bg};
    background: ${({ theme }) => theme.colors.categories.artwork};
  }
`;
