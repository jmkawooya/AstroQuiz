import { createContext, useState, useEffect, ReactNode } from 'react';
import { updateStarColors } from './WebGLStarsBackground';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light', // Changed default to light mode
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light'); // Changed default to light mode

  // Apply theme to document on theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update WebGL star colors based on theme
    if (theme === 'light') {
      // Slightly dimmer white stars for light theme
      updateStarColors([0.95, 0.95, 0.98]);
    } else {
      // Brighter white stars for dark theme
      updateStarColors([1.0, 1.0, 1.0]);
    }
  }, [theme]);

  // Set initial theme on component mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light'); // Changed to light
    // Set initial star colors
    updateStarColors([0.95, 0.95, 0.98]);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 