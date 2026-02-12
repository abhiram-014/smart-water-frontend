import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Settings, RefreshCw, Globe, Menu, X, Sun, Moon, Container } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SENSOR_OPTIONS = [
  { key: 'tds', label: 'Total Dissolved Solids' },
  { key: 'temperature', label: 'Temperature' },
  { key: 'turbidity', label: 'Turbidity' },
  { key: 'ph', label: 'pH Level' },
];

const Header = ({ onRefresh, isRefreshing, lastUpdated, selectedSensors, onSensorChange, onOpenSettings }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  // Removed isSettingsOpen, tempSensors, and related handlers

  // Effect to update <html> class and localStorage
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' }
  ];

  const formatLastUpdated = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('time.now');
    if (minutes < 60) return `${minutes} ${minutes === 1 ? t('time.minute') : t('time.minutes')} ${t('time.ago')}`;
    if (hours < 24) return `${hours} ${hours === 1 ? t('time.hour') : t('time.hours')} ${t('time.ago')}`;
    return `${days} ${days === 1 ? t('time.day') : t('time.days')} ${t('time.ago')}`;
  };

  const handleRefresh = () => {
    onRefresh();
    setIsMobileMenuOpen(false); // Close mobile menu after refresh
  };

  const handleSensorToggle = (sensor) => {
    // setTempSensors((prev) =>
    //   prev.includes(sensor)
    //     ? prev.filter((s) => s !== sensor)
    //     : [...prev, sensor]
    // );
  };

  const handleSaveSensors = () => {
    // setIsSettingsOpen(false);
    // if (onSensorChange) onSensorChange(tempSensors);
  };

  return (
    <header className="bg-slate-700 shadow-md backdrop-blur-md border-b border-slate-600 sticky top-0 z-50 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <img src="/Bluefuture logo.png" alt="Team Zenith Logo" className="h-8 w-8" />
              <div className="ml-3 min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-white truncate">
                  Smart Water Management Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 hidden sm:block">
                  Real-time IoT Water Quality Monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Water Tanks Button */}
            <button
              onClick={() => navigate('/tanks')}
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md transition-colors ${
                location.pathname === '/tanks'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700'
              }`}
            >
              <Container className="h-4 w-4 mr-2" />
              Water Tanks
            </button>

            {/* Last Updated */}
            {lastUpdated && location.pathname === '/' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.lastUpdated')}: {formatLastUpdated(lastUpdated)}
              </div>
            )}

            {/* Refresh Button */}
            {location.pathname === '/' && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t('dashboard.refresh')}
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Settings Button */}
            {location.pathname === '/' && (
              <button
                onClick={onOpenSettings}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                {t('dashboard.settings')}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="inline-flex items-center px-2 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4 flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-lg bg-slate-500 hover:bg-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-600 border-t border-slate-500">
          {/* Water Tanks Button - Mobile */}
          <button
            onClick={() => {
              navigate('/tanks');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/tanks'
                ? 'bg-sky-500 text-white'
                : 'text-white bg-slate-500 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500'
            }`}
          >
            <Container className="h-4 w-4 mr-3" />
            Water Tanks
          </button>

          {/* Last Updated - Mobile */}
          {lastUpdated && location.pathname === '/' && (
            <div className="px-3 py-2 text-sm text-slate-300 bg-slate-500 rounded-md">
              <div className="font-medium">{t('dashboard.lastUpdated')}</div>
              <div>{formatLastUpdated(lastUpdated)}</div>
            </div>
          )}

          {/* Refresh Button - Mobile */}
          {location.pathname === '/' && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-500 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('dashboard.refresh')}
            </button>
          )}

          {/* Language Switcher - Mobile */}
          <div className="px-3 py-2 bg-slate-500 rounded-md">
            <div className="flex items-center mb-2">
              <Globe className="h-4 w-4 text-slate-300 mr-2" />
              <span className="text-sm font-medium text-white">{t('dashboard.language')}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-sky-500 text-white font-medium'
                      : 'bg-slate-400 text-white hover:bg-slate-300'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Button - Mobile */}
          {location.pathname === '/' && (
            <button
              onClick={onOpenSettings}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-500 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3" />
              {t('dashboard.settings')}
            </button>
          )}

          {/* Dark Mode Toggle - Mobile */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-slate-500 rounded-md hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors mb-2"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
      {/* Settings Modal removed from here */}
    </header>
  );
};

export default Header; 