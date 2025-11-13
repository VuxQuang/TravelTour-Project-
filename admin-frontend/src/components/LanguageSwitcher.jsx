import { useState, useEffect, useRef } from 'react';
import { useLanguageManager } from '../hooks/useLanguageManager';

export default function LanguageSwitcher() {
  const { 
    currentLanguage, 
    isLoading, 
    availableLanguages, 
    changeLanguage,
    getCurrentLanguageInfo 
  } = useLanguageManager();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguageInfo = getCurrentLanguageInfo();

  const handleLanguageChange = async (langCode) => {
    await changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <div 
        className="language-current" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <span className="flag">{currentLanguageInfo.flag}</span>
        <span className="language-name">{currentLanguageInfo.name}</span>
        <i className={`fas fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
        {isLoading && <i className="fas fa-spinner fa-spin" style={{ marginLeft: '8px' }}></i>}
      </div>
      
      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map((lang) => (
            <div
              key={lang.code}
              className={`language-option ${lang.isActive ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
