import { getDarkMode, setDarkMode } from '@/utils/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadDarkMode();
  }, []);

  const loadDarkMode = async () => {
    const darkMode = await getDarkMode();
    setIsDark(darkMode);
  };

  const toggleDarkMode = async () => {
    const newValue = !isDark;
    setIsDark(newValue);
    await setDarkMode(newValue);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
