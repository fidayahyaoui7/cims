import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format, subDays, parseISO, isAfter, isBefore } from 'date-fns';
import { fr, arTN } from 'date-fns/locale';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface HealthMetric {
  id: string;
  type: 'bloodPressure' | 'bloodSugar' | 'weight' | 'heartRate' | 'steps';
  value: number;
  date: string;
  notes?: string;
}

interface BloodPressureMetric extends Omit<HealthMetric, 'value'> {
  type: 'bloodPressure';
  systolic: number;
  diastolic: number;
  pulse?: number;
}

const HealthTrackerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState<string>('bloodPressure');
  const [timeRange, setTimeRange] = useState('week');
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [newMetric, setNewMetric] = useState<Partial<HealthMetric | BloodPressureMetric>>({ 
    type: 'bloodPressure',
    date: new Date().toISOString().slice(0, 16) // Current date and time in local format
  });
  const [metrics, setMetrics] = useState<(HealthMetric | BloodPressureMetric)[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('healthMetrics');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Save to localStorage whenever metrics change
  useEffect(() => {
    if (metrics.length > 0) {
      localStorage.setItem('healthMetrics', JSON.stringify(metrics));
    }
  }, [metrics]);
  const currentLanguage = i18n.language;

  // Generate mock data for demonstration
  useEffect(() => {
    // Check if we already have metrics in localStorage
    const savedMetrics = localStorage.getItem('healthMetrics');
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
      return;
    }
    
    // Generate mock data if no saved metrics
    const mockMetrics: (HealthMetric | BloodPressureMetric)[] = [];
    const today = new Date();
    
    // Generate blood pressure data
    for (let i = 30; i >= 0; i--) {
      const date = subDays(today, i);
      mockMetrics.push({
        id: `bp-${i}`,
        type: 'bloodPressure',
        systolic: Math.floor(110 + Math.random() * 30), // 110-140
        diastolic: Math.floor(70 + Math.random() * 20), // 70-90
        pulse: Math.floor(60 + Math.random() * 30), // 60-90
        date: date.toISOString(),
      });
      
      // Generate blood sugar data (2-3 readings per day)
      const readingsPerDay = 2 + Math.floor(Math.random() * 2);
      for (let j = 0; j < readingsPerDay; j++) {
        mockMetrics.push({
          id: `bs-${i}-${j}`,
          type: 'bloodSugar',
          value: Math.floor(80 + Math.random() * 100), // 80-180 mg/dL
          date: new Date(date.setHours(8 + j * 6, 0, 0, 0)).toISOString(),
        });
      }
      
      // Generate weight data (every few days)
      if (i % 3 === 0) {
        mockMetrics.push({
          id: `wt-${i}`,
          type: 'weight',
          value: 70 + (Math.random() * 10 - 2), // 68-78 kg
          date: new Date(date.setHours(12, 0, 0, 0)).toISOString(),
        });
      }
      
      // Generate heart rate data (multiple times a day)
      for (let j = 0; j < 3; j++) {
        mockMetrics.push({
          id: `hr-${i}-${j}`,
          type: 'heartRate',
          value: 60 + Math.floor(Math.random() * 40), // 60-100 bpm
          date: new Date(date.setHours(8 + j * 6, 0, 0, 0)).toISOString(),
        });
      }
      
      // Generate steps data (once per day)
      mockMetrics.push({
        id: `st-${i}`,
        type: 'steps',
        value: Math.floor(2000 + Math.random() * 8000), // 2000-10000 steps
        date: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      });
    }
    
    setMetrics(mockMetrics);
    // Save to localStorage for persistence
    localStorage.setItem('healthMetrics', JSON.stringify(mockMetrics));
  }, []);

  // Filter metrics based on selected time range
  const getFilteredMetrics = () => {
    const now = new Date();
    let fromDate: Date;
    
    switch (timeRange) {
      case 'day':
        fromDate = subDays(now, 1);
        break;
      case 'week':
        fromDate = subDays(now, 7);
        break;
      case 'month':
        fromDate = subDays(now, 30);
        break;
      case 'year':
        fromDate = subDays(now, 365);
        break;
      default:
        fromDate = subDays(now, 7);
    }
    
    return metrics.filter(metric => new Date(metric.date) >= fromDate);
  };

  // Group metrics by date for the chart
  const getChartData = () => {
    const filtered = getFilteredMetrics();
    const metricType = selectedMetric;
    
    if (metricType === 'bloodPressure') {
      // Group blood pressure metrics by date
      const groupedByDate: Record<string, { systolic: number; diastolic: number; count: number }> = {};
      
      filtered
        .filter((m): m is BloodPressureMetric => m.type === 'bloodPressure')
        .forEach(metric => {
          const dateStr = format(parseISO(metric.date), 'yyyy-MM-dd');
          if (!groupedByDate[dateStr]) {
            groupedByDate[dateStr] = {
              systolic: 0,
              diastolic: 0,
              count: 0,
            };
          }
          groupedByDate[dateStr].systolic += metric.systolic;
          groupedByDate[dateStr].diastolic += metric.diastolic;
          groupedByDate[dateStr].count++;
        });
      
      // Calculate averages and format for chart
      return Object.entries(groupedByDate).map(([date, data]) => ({
        date,
        systolic: Math.round(data.systolic / data.count),
        diastolic: Math.round(data.diastolic / data.count),
      }));
    } else {
      // Group other metrics by date
      const groupedByDate: Record<string, { value: number; count: number }> = {};
      
      filtered
        .filter(m => m.type === metricType)
        .forEach(metric => {
          const dateStr = format(parseISO(metric.date), 'yyyy-MM-dd');
          if (!groupedByDate[dateStr]) {
            groupedByDate[dateStr] = {
              value: 0,
              count: 0,
            };
          }
          groupedByDate[dateStr].value += 'value' in metric ? metric.value : 0;
          groupedByDate[dateStr].count++;
        });
      
      // Calculate averages and format for chart
      return Object.entries(groupedByDate).map(([date, data]) => ({
        date,
        value: Math.round((data.value / data.count) * 10) / 10,
      }));
    }
  };

  const chartData = getChartData();
  
  const getMetricLabel = (type: string) => {
    switch (type) {
      case 'bloodPressure':
        return t('healthTracker.bloodPressure');
      case 'bloodSugar':
        return t('healthTracker.bloodSugar');
      case 'weight':
        return t('healthTracker.weight');
      case 'heartRate':
        return t('healthTracker.heartRate');
      case 'steps':
        return t('healthTracker.steps');
      default:
        return type;
    }
  };

  const getMetricUnit = (type: string) => {
    switch (type) {
      case 'bloodPressure':
        return 'mmHg';
      case 'bloodSugar':
        return 'mg/dL';
      case 'weight':
        return 'kg';
      case 'heartRate':
        return 'bpm';
      case 'steps':
        return '';
      default:
        return '';
    }
  };

  const renderChart = () => {
    if (selectedMetric === 'bloodPressure') {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM d', {
                  locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                })}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                labelFormatter={(date) => format(parseISO(date), 'PPP', {
                  locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                })}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="systolic"
                name={`${t('healthTracker.systolic')} (mmHg)`}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="diastolic"
                name={`${t('healthTracker.diastolic')} (mmHg)`}
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), 'MMM d', {
                  locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(parseISO(date), 'PPP', {
                  locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                })}
                formatter={(value: number) => [`${value} ${getMetricUnit(selectedMetric)}`, getMetricLabel(selectedMetric)]}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name={`${getMetricLabel(selectedMetric)} (${getMetricUnit(selectedMetric)})`}
                fill="#8884d8" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  const renderMetricCard = (type: string) => {
    const filtered = metrics.filter(m => m.type === type);
    if (filtered.length === 0) return null;
    
    const latest = filtered[filtered.length - 1];
    let value = '';
    let subValue = '';
    
    if (type === 'bloodPressure' && 'systolic' in latest) {
      value = `${latest.systolic}/${latest.diastolic}`;
      subValue = `Pulse: ${latest.pulse} bpm`;
    } else if ('value' in latest) {
      value = latest.value.toString();
      if (type === 'weight') {
        value = `${latest.value} kg`;
      } else if (type === 'heartRate') {
        value = `${latest.value} bpm`;
      } else if (type === 'bloodSugar') {
        value = `${latest.value} mg/dL`;
      } else if (type === 'steps') {
        value = latest.value.toLocaleString();
      }
    }
    
    return (
      <div 
        key={type}
        className={`p-4 rounded-lg shadow cursor-pointer transition-all hover:shadow-md ${
          selectedMetric === type ? 'ring-2 ring-blue-500' : 'bg-white dark:bg-gray-800'
        }`}
        onClick={() => setSelectedMetric(type)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {getMetricLabel(type)}
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {subValue && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subValue}
              </p>
            )}
          </div>
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
            {getMetricIcon(type)}
          </div>
        </div>
      </div>
    );
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'bloodPressure':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'bloodSugar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'weight':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3.9 1.63M12 16.5a3 3 0 01-3-3 3 3 0 013-3 3 3 0 013 3 3 3 0 01-3 3zm9-6h-6m6 0l-3-3m3 3l-3 3" />
          </svg>
        );
      case 'heartRate':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'steps':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('healthTracker.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('healthTracker.subtitle')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="day">{t('timeRanges.day')}</option>
            <option value="week">{t('timeRanges.week')}</option>
            <option value="month">{t('timeRanges.month')}</option>
            <option value="year">{t('timeRanges.year')}</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setIsAddingMetric(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t('healthTracker.addMetric')}
          </button>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {['bloodPressure', 'bloodSugar', 'weight', 'heartRate', 'steps']
          .filter(type => metrics.some(m => m.type === type))
          .map(type => renderMetricCard(type))}
      </div>

      {/* Main chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {getMetricLabel(selectedMetric)} {t('healthTracker.overview')}
          </h2>
          <div className="flex space-x-2">
            {['bloodPressure', 'bloodSugar', 'weight', 'heartRate', 'steps']
              .filter(type => metrics.some(m => m.type === type))
              .map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedMetric(type)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    selectedMetric === type
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {getMetricLabel(type)}
                </button>
              ))}
          </div>
        </div>
        {renderChart()}
      </div>

      {/* Recent entries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('healthTracker.recentEntries')}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('healthTracker.date')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('healthTracker.metric')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('healthTracker.value')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('healthTracker.notes')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...metrics]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((metric) => (
                  <tr key={metric.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(parseISO(metric.date), 'PPPp', {
                        locale: currentLanguage === 'fr' ? fr : currentLanguage === 'ar' ? arTN : undefined
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {getMetricLabel(metric.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {metric.type === 'bloodPressure' ? (
                        <span className="text-gray-900 dark:text-white">
                          {(metric as BloodPressureMetric).systolic}/{(metric as BloodPressureMetric).diastolic} mmHg
                        </span>
                      ) : (
                        <span className="text-gray-900 dark:text-white">
                          {('value' in metric ? metric.value : '')} {getMetricUnit(metric.type)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {metric.notes || '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right text-sm">
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Navigate to detailed view
            }}
          >
            {t('healthTracker.viewAll')}
          </a>
        </div>
      </div>

      {/* Add Metric Modal */}
      {isAddingMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('healthTracker.addMetric')}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setIsAddingMetric(false);
                    setNewMetric({ type: 'bloodPressure' });
                  }}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('healthTracker.metricType')}
                </label>
                <select
                  value={newMetric.type || ''}
                  onChange={(e) => setNewMetric({ ...newMetric, type: e.target.value as any })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <option value="bloodPressure">{t('healthTracker.bloodPressure')}</option>
                  <option value="bloodSugar">{t('healthTracker.bloodSugar')}</option>
                  <option value="weight">{t('healthTracker.weight')}</option>
                  <option value="heartRate">{t('healthTracker.heartRate')}</option>
                  <option value="steps">{t('healthTracker.steps')}</option>
                </select>
              </div>
              
              {newMetric.type === 'bloodPressure' ? (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('healthTracker.systolic')} (mmHg)
                    </label>
                    <input
                      type="number"
                      value={(newMetric as BloodPressureMetric).systolic || ''}
                      onChange={(e) => setNewMetric({
                        ...newMetric,
                        systolic: parseInt(e.target.value) || undefined
                      } as BloodPressureMetric)}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('healthTracker.diastolic')} (mmHg)
                    </label>
                    <input
                      type="number"
                      value={(newMetric as BloodPressureMetric).diastolic || ''}
                      onChange={(e) => setNewMetric({
                        ...newMetric,
                        diastolic: parseInt(e.target.value) || undefined
                      } as BloodPressureMetric)}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      placeholder="80"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('healthTracker.pulse')} (bpm)
                    </label>
                    <input
                      type="number"
                      value={(newMetric as BloodPressureMetric).pulse || ''}
                      onChange={(e) => setNewMetric({
                        ...newMetric,
                        pulse: parseInt(e.target.value) || undefined
                      } as BloodPressureMetric)}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      placeholder="72"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('healthTracker.value')} ({getMetricUnit(newMetric.type || '')})
                  </label>
                  <input
                    type="number"
                    step={newMetric.type === 'weight' ? '0.1' : '1'}
                    value={'value' in newMetric ? newMetric.value || '' : ''}
                    onChange={(e) => setNewMetric({
                      ...newMetric,
                      value: newMetric.type === 'weight' 
                        ? parseFloat(e.target.value) 
                        : parseInt(e.target.value) || undefined
                    })}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    placeholder={t('healthTracker.enterValue')}
                  />
                </div>
              )}
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('healthTracker.dateTime')}
                </label>
                <input
                  type="datetime-local"
                  value={newMetric.date ? new Date(newMetric.date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setNewMetric({
                    ...newMetric,
                    date: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString()
                  })}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('healthTracker.notes')} ({t('common.optional')})
                </label>
                <textarea
                  value={newMetric.notes || ''}
                  onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  placeholder={t('healthTracker.notesPlaceholder')}
                />
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingMetric(false);
                    setNewMetric({ type: 'bloodPressure' });
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Validate required fields
                    if (newMetric.type === 'bloodPressure') {
                      const bpMetric = newMetric as BloodPressureMetric;
                      if (!bpMetric.systolic || !bpMetric.diastolic) {
                        alert(t('healthTracker.validation.requiredFields'));
                        return;
                      }
                    } else if (!('value' in newMetric) || newMetric.value === undefined) {
                      alert(t('healthTracker.validation.requiredFields'));
                      return;
                    }
                    
                    // Create new metric
                    const metric: any = {
                      ...newMetric,
                      id: `new-${Date.now()}`,
                      date: newMetric.date || new Date().toISOString(),
                    };
                    
                    // Add to metrics
                    setMetrics(prev => [...prev, metric]);
                    
                    // Reset form and close modal
                    setNewMetric({ type: 'bloodPressure' });
                    setIsAddingMetric(false);
                    
                    // In a real app, you would also save to the backend here
                    // await saveMetricToBackend(metric);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthTrackerPage;
