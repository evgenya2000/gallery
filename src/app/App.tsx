import { HomePage } from '../pages/HomePage';
import { GlobalStyles } from './providers/GlobalStyles';
import { ThemeProvider } from './providers/ThemeProvider';

export function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <HomePage />
    </ThemeProvider>
  );
}
