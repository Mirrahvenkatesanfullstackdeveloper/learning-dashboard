import { useContext, createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem('theme-primary');
    return savedColor || '#667EEA';
  });

  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('theme-font-size');
    return savedSize || 'medium';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('theme-primary', primaryColor);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }, [primaryColor]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('theme-font-size', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  const getThemeClasses = () => {
    return {
      light: mode === 'light',
      dark: mode === 'dark',
      fontSize: fontSize,
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        primaryColor,
        fontSize,
        toggleMode,
        updatePrimaryColor,
        updateFontSize,
        getThemeClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for theme-aware styles
export const useThemedStyles = () => {
  const { mode, primaryColor } = useTheme();

  const getBackgroundColor = () => {
    return mode === 'light' ? '#FFFFFF' : '#1A202C';
  };

  const getTextColor = () => {
    return mode === 'light' ? '#2D3748' : '#F7FAFC';
  };

  const getBorderColor = () => {
    return mode === 'light' ? '#E2E8F0' : '#2D3748';
  };

  const getHoverColor = () => {
    return mode === 'light' ? '#F7F9FC' : '#2D3748';
  };

  const getCardGradient = () => {
    return mode === 'light'
      ? 'linear-gradient(135deg, #FFFFFF 0%, #F7F9FC 100%)'
      : 'linear-gradient(135deg, #1A202C 0%, #2D3748 100%)';
  };

  return {
    backgroundColor: getBackgroundColor(),
    textColor: getTextColor(),
    borderColor: getBorderColor(),
    hoverColor: getHoverColor(),
    cardGradient: getCardGradient(),
    primaryColor,
  };
};