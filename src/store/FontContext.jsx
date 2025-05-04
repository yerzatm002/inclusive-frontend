// src/store/FontContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fontFamilies } from '../styles/fonts';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 18);
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'open');

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const changeFontFamily = (family) => {
    setFontFamily(family);
    localStorage.setItem('fontFamily', family);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--font-family', fontFamilies[fontFamily]);
  }, [fontSize, fontFamily]);

  return (
    <FontContext.Provider value={{ fontSize, fontFamily, changeFontSize, changeFontFamily }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontSettings = () => useContext(FontContext);
