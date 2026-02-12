import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Droplets, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import firebaseService from '../services/firebase';

const WaterTankPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tankData, setTankData] = useState({
    tankA: { 
      level: 75, 
      capacity: 1000, 
      current: 750,
      usageRate: 2.5, // liters per hour
      mostUsageTime: '08:00-10:00',
      lastRefill: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    tankB: { 
      level: 60, 
      capacity: 1000, 
      current: 600,
      usageRate: 3.2,
      mostUsageTime: '18:00-20:00',
      lastRefill: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)
    },
    tankC: { 
      level: 85, 
      capacity: 1000, 
      current: 850,
      usageRate: 1.8,
      mostUsageTime: '12:00-14:00',
      lastRefill: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    tankD: { 
      level: 45, 
      capacity: 1000, 
      current: 450,
      usageRate: 4.1,
      mostUsageTime: '06:00-08:00',
      lastRefill: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Calculate time to empty
  const calculateTimeToEmpty = (current, usageRate) => {
    if (usageRate <= 0) return 'N/A';
    const hoursToEmpty = current / usageRate;
    if (hoursToEmpty >= 24) {
      const days = Math.floor(hoursToEmpty / 24);
      const hours = Math.floor(hoursToEmpty % 24);
      return `${days}d ${hours}h`;
    }
    return `${Math.floor(hoursToEmpty)}h ${Math.floor((hoursToEmpty % 1) * 60)}m`;
  };

  // Format time since last refill
  const formatTimeSinceRefill = (lastRefill) => {
    const now = new Date();
    const diffMs = now - lastRefill;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h ago`;
    }
    return `${diffHours}h ago`;
  };

  // Simulate real-time updates (in a real app, this would come from Firebase)
  useEffect(() => {
    const interval = setInterval(() => {
      setTankData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(tankKey => {
          const tank = newData[tankKey];
          
          // Simulate water consumption based on usage rate
          const consumptionPerUpdate = (tank.usageRate / 3600) * 3; // 3 seconds worth of consumption
          const newCurrent = Math.max(0, tank.current - consumptionPerUpdate);
          const newLevel = (newCurrent / tank.capacity) * 100;
          
          // Simulate small variations in usage rate
          const usageRateVariation = (Math.random() - 0.5) * 0.2; // ±0.1 L/h variation
          const newUsageRate = Math.max(0.5, tank.usageRate + usageRateVariation);
          
          newData[tankKey] = {
            ...tank,
            level: newLevel,
            current: newCurrent,
            usageRate: newUsageRate
          };
        });
        return newData;
      });
    }, 3000); // Update every 3 seconds

    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);

    return () => clearInterval(interval);
  }, []);

  const getTankColor = (level) => {
    if (level >= 80) return '#10B981'; // Green
    if (level >= 60) return '#3B82F6'; // Blue
    if (level >= 40) return '#F59E0B'; // Yellow
    if (level >= 20) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getTankStatus = (level) => {
    if (level >= 80) return 'excellent';
    if (level >= 60) return 'good';
    if (level >= 40) return 'warning';
    if (level >= 20) return 'danger';
    return 'critical';
  };

  // Cylindrical Tank Visualization Component (Updated design)
  const CylindricalTank = ({ level, color, capacity, current, width = 200, height = 280 }) => {
    const waterHeight = (level / 100) * (height - 60); // 60px for top/bottom margins
    const waterY = height - 30 - waterHeight; // 30px bottom margin
    const tankWidth = 80; // Fixed tank width
    const tankX = 20; // Tank position from left
    
    // Calculate percentage markers
    const percentageMarkers = [
      { label: "100%", value: 100, y: 30 },
      { label: "80%", value: 80, y: 30 + (height - 60) * 0.2 },
      { label: "60%", value: 60, y: 30 + (height - 60) * 0.4 },
      { label: "40%", value: 40, y: 30 + (height - 60) * 0.6 },
      { label: "20%", value: 20, y: 30 + (height - 60) * 0.8 },
      { label: "0%", value: 0, y: height - 30 }
    ];
    
    return (
      <div className="relative mx-auto" style={{ width, height }}>
        <svg width={width} height={height} className="drop-shadow-lg">
          {/* Tank outline - transparent cylindrical tank */}
          <rect
            x={tankX}
            y="30"
            width={tankWidth}
            height={height - 60}
            fill="none"
            stroke="#666"
            strokeWidth="2"
            rx="4"
            className="dark:stroke-gray-400"
          />
          
          {/* Tank top and bottom caps */}
          <ellipse
            cx={tankX + tankWidth / 2}
            cy="30"
            rx={tankWidth / 2}
            ry="6"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            className="dark:stroke-gray-400"
          />
          <ellipse
            cx={tankX + tankWidth / 2}
            cy={height - 30}
            rx={tankWidth / 2}
            ry="6"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            className="dark:stroke-gray-400"
          />
          
          {/* Water level - light blue like in reference */}
          <rect
            x={tankX + 2}
            y={waterY}
            width={tankWidth - 4}
            height={waterHeight}
            fill="#87CEEB"
            fillOpacity="0.9"
            rx="2"
          />
          
          {/* Water surface */}
          <ellipse
            cx={tankX + tankWidth / 2}
            cy={waterY}
            rx={(tankWidth - 4) / 2}
            ry="3"
            fill="#87CEEB"
            fillOpacity="1"
          />
          
          {/* Percentage scale on the right */}
          <line
            x1={tankX + tankWidth + 10}
            y1="30"
            x2={tankX + tankWidth + 10}
            y2={height - 30}
            stroke="#666"
            strokeWidth="2"
            className="dark:stroke-gray-400"
          />
          
          {/* Percentage markers and labels */}
          {percentageMarkers.map((marker, index) => (
            <g key={index}>
              {/* Tick marks */}
              <line
                x1={tankX + tankWidth + 8}
                y1={marker.y}
                x2={tankX + tankWidth + 12}
                y2={marker.y}
                stroke="#666"
                strokeWidth="2"
                className="dark:stroke-gray-400"
              />
              {/* Labels */}
              <text
                x={tankX + tankWidth + 18}
                y={marker.y + 4}
                fontSize="12"
                fill="#666"
                className="dark:fill-gray-400"
              >
                {marker.label}
              </text>
            </g>
          ))}
          
          {/* Additional tick marks between main markers */}
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((ratio, index) => {
            const y = 30 + (height - 60) * ratio;
            return (
              <line
                key={index}
                x1={tankX + tankWidth + 9}
                y1={y}
                x2={tankX + tankWidth + 11}
                y2={y}
                stroke="#666"
                strokeWidth="1"
                className="dark:stroke-gray-400"
              />
            );
          })}
        </svg>
        
        {/* Current level percentage display - moved to side */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-2 shadow-lg">
            <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {Math.round(level)}%
            </span>
          </div>
        </div>
        
        {/* Branding text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
          <div className="text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('waterTanks.smartWaterSystem')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const TankBlock = ({ tankKey, tankInfo, label }) => {
    const color = getTankColor(tankInfo.level);
    
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {label}
          </h3>
          
          {/* Cylindrical Water Tank Visualization */}
          <div className="relative mb-6">
            <CylindricalTank 
              level={tankInfo.level} 
              color={color} 
              capacity={tankInfo.capacity}
              current={tankInfo.current}
            />
          </div>

          {/* Tank Information */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('waterTanks.currentLevel')}:
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(tankInfo.level)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('waterTanks.capacity')}:
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {tankInfo.capacity} L
              </span>
            </div>

            {/* Most Usage Time */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('waterTanks.peakUsage')}:
                </span>
              </div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {tankInfo.mostUsageTime}
              </span>
            </div>

            {/* Usage Rate - no decimals */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('waterTanks.usageRate')}:
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(tankInfo.usageRate)} L/h
              </span>
            </div>

            {/* Last Refill */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('waterTanks.lastRefill')}:
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatTimeSinceRefill(tankInfo.lastRefill)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${tankInfo.level}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <svg className="mx-auto mb-4 animate-bounce" width="64" height="64" viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="waterDropGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <path
              d="M32 6C32 6 12 30 12 42C12 53.0457 21.9543 62 32 62C42.0457 62 52 53.0457 52 42C52 30 32 6 32 6Z"
              fill="url(#waterDropGradient)"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <ellipse cx="32" cy="48" rx="12" ry="4" fill="#3b82f6" fillOpacity="0.15" />
            <circle cx="32" cy="40" r="8" fill="#fff" fillOpacity="0.25" />
          </svg>
          <p className="mt-4 text-blue-700 dark:text-blue-200 font-semibold animate-pulse">
            {t('waterTanks.loadingTanks')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('waterTanks.backToDashboard')}
              </button>
            </div>
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <img src="/Bluefuture logo.png" alt="Team Zenith Logo" className="h-8 w-8 mr-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t('waterTanks.title')}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('waterTanks.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('waterTanks.subtitle')}
          </p>
        </div>

        {/* Tank Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <TankBlock 
            tankKey="tankA" 
            tankInfo={tankData.tankA} 
            label="A Block" 
          />
          <TankBlock 
            tankKey="tankB" 
            tankInfo={tankData.tankB} 
            label="B Block" 
          />
          <TankBlock 
            tankKey="tankC" 
            tankInfo={tankData.tankC} 
            label="C Block" 
          />
          <TankBlock 
            tankKey="tankD" 
            tankInfo={tankData.tankD} 
            label="D Tank" 
          />
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            {t('waterTanks.systemOverview')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(tankData).map(([tankKey, tankInfo]) => (
              <div key={tankKey} className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {tankInfo.level.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {tankKey.charAt(4).toUpperCase()} Block
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  {Math.round(tankInfo.current)}L / {tankInfo.capacity}L
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {t('waterTanks.peakUsage')}: {tankInfo.mostUsageTime}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {t('waterTanks.usageRate')}: {Math.round(tankInfo.usageRate)} L/h
                </div>
              </div>
            ))}
          </div>
          
          {/* Overall System Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {Object.values(tankData).filter(tank => tank.level >= 60).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('waterTanks.blocksAbove60')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {Math.round(Object.values(tankData).reduce((sum, tank) => sum + tank.usageRate, 0))} L/h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('waterTanks.totalUsageRate')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {Object.values(tankData).reduce((sum, tank) => sum + tank.current, 0)} L
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('waterTanks.totalWaterAvailable')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaterTankPage;
