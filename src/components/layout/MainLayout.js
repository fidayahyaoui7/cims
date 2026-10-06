import React from 'react';
import Header from './Header';

export default function MainLayout({ children, isDarkMode, toggleDarkMode, isRTL, toggleRTL }) {
  return (
    <>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isRTL={isRTL}
        toggleRTL={toggleRTL}
      />
      <main className="pt-16 min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}
