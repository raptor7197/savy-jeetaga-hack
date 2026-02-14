import React, { useState } from 'react';

const analyticsData = {
  totalPatients: 156,
  activeSessions: 23,
  totalSessions: 1247,
  avgSessionDuration: 42,
  alertsTriggered: 12,
  dataProcessed: 245.8,
};

const weeklyData = [
  { day: 'Mon', sessions: 45, patients: 28 },
  { day: 'Tue', sessions: 52, patients: 32 },
  { day: 'Wed', sessions: 48, patients: 30 },
  { day: 'Thu', sessions: 61, patients: 35 },
  { day: 'Fri', sessions: 55, patients: 33 },
  { day: 'Sat', sessions: 32, patients: 18 },
  { day: 'Sun', sessions: 18, patients: 12 },
];

const conditionData = [
  { condition: 'Epilepsy', patients: 42, percentage: 27, color: '#0ea5e9' },
  { condition: 'Sleep Disorders', patients: 35, percentage: 22, color: '#8b5cf6' },
  { condition: 'Alzheimer', patients: 28, percentage: 18, color: '#10b981' },
  { condition: 'Parkinson', patients: 22, percentage: 14, color: '#f59e0b' },
  { condition: 'Migraine', patients: 18, percentage: 12, color: '#ec4899' },
  { condition: 'Other', patients: 11, percentage: 7, color: '#6b7280' },
];

const recentActivity = [
  { type: 'session', patient: 'John Smith', action: 'New session recorded', time: '5 min ago' },
  { type: 'alert', patient: 'Robert Wilson', action: 'Seizure detected', time: '12 min ago' },
  { type: 'consent', patient: 'Sarah Johnson', action: 'Consent granted', time: '25 min ago' },
  { type: 'session', patient: 'Michael Chen', action: 'Session completed', time: '1 hour ago' },
  { type: 'consent', patient: 'Emily Davis', action: 'Consent updated', time: '2 hours ago' },
];

function TrendingUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function TrendingDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ActivityPulseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DonutChart({ data }) {
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  let accumulatedOffset = 0;
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {data.map((item, index) => {
        const segmentLength = (item.percentage / 100) * circumference;
        const offset = accumulatedOffset;
        accumulatedOffset += segmentLength;
        
        return (
          <circle
            key={item.condition}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            className="transition-all duration-500"
          />
        );
      })}
      <circle cx={center} cy={center} r={radius - strokeWidth / 2} fill="white" />
    </svg>
  );
}

function LineChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.sessions));
  const minValue = Math.min(...data.map(d => d.sessions));
  const range = maxValue - minValue || 1;
  
  const width = 500;
  const height = 150;
  const padding = 20;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.sessions - minValue) / range) * (height - 2 * padding);
    return { x, y, ...d };
  });
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <path d={areaPath} fill="url(#areaGradient)" />
      
      <path
        d={linePath}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {points.map((point, i) => (
        <g key={i}>
          <circle
            cx={point.x}
            cy={point.y}
            r="6"
            fill="white"
            stroke="#0ea5e9"
            strokeWidth="3"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#0ea5e9"
          />
        </g>
      ))}
      
      {points.map((point, i) => (
        <text
          key={i}
          x={point.x}
          y={height - 5}
          textAnchor="middle"
          className="text-xs fill-gray-400"
          style={{ fontSize: '11px' }}
        >
          {point.day}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  const totalPercentage = conditionData.reduce((acc, item) => acc + item.percentage, 0);

  return (
    <div className="ml-[260px] p-8 bg-gray-50 min-h-screen">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of neuro-monitoring system performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
              <UsersIcon />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUpIcon /> 12%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{analyticsData.totalPatients}</p>
          <p className="text-sm text-gray-500 mt-1">Total Sessions</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
              <ActivityIcon />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUpIcon /> 8%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{analyticsData.activeSessions}</p>
          <p className="text-sm text-gray-500 mt-1">Active Sessions</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <AlertIcon />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              <TrendingDownIcon /> 3%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{analyticsData.alertsTriggered}</p>
          <p className="text-sm text-gray-500 mt-1">Alerts This Week</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <DatabaseIcon />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <TrendingUpIcon /> 24%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{analyticsData.dataProcessed} GB</p>
          <p className="text-sm text-gray-500 mt-1">Data Processed</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-6">Weekly Activity</h3>
          <LineChart data={weeklyData} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-6">Conditions</h3>
          <div className="flex flex-col items-center">
            <DonutChart data={conditionData} />
            <div className="mt-6 w-full space-y-2">
              {conditionData.map((item) => (
                <div key={item.condition} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.condition}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          {/* <h3 className="font-medium text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'session' ? 'bg-sky-50' :
                  activity.type === 'alert' ? 'bg-rose-50' : 'bg-emerald-50'
                }`}>
                  {activity.type === 'session' ? <ActivityPulseIcon /> :
                   activity.type === 'alert' ? <AlertIcon /> : <ShieldIcon />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                  <ClockIcon /> {activity.time}
                </span>
              </div>
            ))}
          </div> */}
        </div>

        {/* <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-6">System Health</h3>
          <div className="space-y-5">
            {[
              { name: 'Blockchain Network', status: 'Healthy', percentage: 98 },
              { name: 'IPFS Storage', status: 'Healthy', percentage: 95 },
              { name: 'Encryption Service', status: 'Active', percentage: 100 },
              { name: 'Consent Registry', status: 'Synced', percentage: 100 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.status}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
