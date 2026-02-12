import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import Dashboard from './components/Dashboard';
import WaterTankPage from './components/WaterTankPage';
import WelcomeSplash from './components/WelcomeSplash';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="App bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
          {showSplash && <WelcomeSplash onFinish={() => setShowSplash(false)} />}
          {!showSplash && (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tanks" element={<WaterTankPage />} />
            </Routes>
          )}
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
