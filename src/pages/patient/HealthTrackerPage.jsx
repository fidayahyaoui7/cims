import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaHeartbeat, 
  FaWeight, 
  FaTint, 
  FaThermometerHalf,
  FaChartLine,
  FaPlus
} from 'react-icons/fa';

const HealthTrackerPage = () => {
  const { t } = useTranslation();
  const [activeMetric, setActiveMetric] = useState('bloodPressure');
  
  // Mock data - replace with real data from your API
  const metrics = [
    { 
      id: 'bloodPressure', 
      name: t('healthTracker.bloodPressure'), 
      icon: <FaHeartbeat className="text-red-500" />,
      unit: 'mmHg',
      current: '120/80',
      trend: 'stable',
      lastUpdated: '2023-05-20',
    },
    { 
      id: 'weight', 
      name: t('healthTracker.weight'), 
      icon: <FaWeight className="text-blue-500" />,
      unit: 'kg',
      current: '72.5',
      trend: 'down',
      lastUpdated: '2023-05-19',
    },
    { 
      id: 'bloodSugar', 
      name: t('healthTracker.bloodSugar'), 
      icon: <FaTint className="text-green-500" />,
      unit: 'mg/dL',
      current: '95',
      trend: 'up',
      lastUpdated: '2023-05-20',
    },
    { 
      id: 'temperature', 
      name: t('healthTracker.temperature'), 
      icon: <FaThermometerHalf className="text-yellow-500" />,
      unit: '°C',
      current: '36.8',
      trend: 'stable',
      lastUpdated: '2023-05-20',
    },
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return <FaChartLine className="text-red-500" />;
      case 'down':
        return <FaChartLine className="text-green-500 transform rotate-180" />;
      default:
        return <FaChartLine className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('healthTracker.title')}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <FaPlus />
          <span>{t('healthTracker.addRecord')}</span>
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id}
            className={`bg-white p-4 rounded-xl shadow-sm border-2 ${activeMetric === metric.id ? 'border-blue-500' : 'border-transparent'} cursor-pointer hover:shadow-md transition-all`}
            onClick={() => setActiveMetric(metric.id)}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-gray-100">
                {metric.icon}
              </div>
              <div className={`flex items-center ${metric.trend === 'up' ? 'text-red-500' : metric.trend === 'down' ? 'text-green-500' : 'text-gray-500'}`}>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-500">{metric.name}</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{metric.current}</p>
              <span className="ml-2 text-sm text-gray-500">{metric.unit}</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {t('healthTracker.lastUpdated')}: {new Date(metric.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {metrics.find(m => m.id === activeMetric)?.name} {t('healthTracker.history')}
          </h2>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
            <option>{t('timePeriod.week')}</option>
            <option>{t('timePeriod.month')}</option>
            <option>{t('timePeriod.threeMonths')}</option>
            <option>{t('timePeriod.year')}</option>
          </select>
        </div>
        
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          <p>{t('healthTracker.chartPlaceholder')}</p>
        </div>

        {/* Recent Records */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            {t('healthTracker.recentRecords')}
          </h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    {t('common.date')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('healthTracker.value')}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('healthTracker.notes')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[1, 2, 3].map((item) => (
                  <tr key={item}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                      {new Date().toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {metrics.find(m => m.id === activeMetric)?.current} {metrics.find(m => m.id === activeMetric)?.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {t('healthTracker.sampleNote')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTrackerPage;
