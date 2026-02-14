import React, { useState } from 'react';

// Mock analytics data
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
  { condition: 'Epilepsy', patients: 42, percentage: 27 },
  { condition: 'Sleep Disorders', patients: 35, percentage: 22 },
  { condition: 'Alzheimer', patients: 28, percentage: 18 },
  { condition: 'Parkinson', patients: 22, percentage: 14 },
  { condition: 'Migraine', patients: 18, percentage: 12 },
  { condition: 'Other', patients: 11, percentage: 7 },
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendingDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 5.28.55" />
      <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1-1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-5.28.55" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  <main className="flex-1 ml-[260px] p-8 space-y-8 overflow-y-auto bg-slate-950 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-2">Overview of neuro-monitoring system performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none cursor-pointer"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <UsersIcon />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400 font-medium">
              <TrendingUpIcon /> +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{analyticsData.totalPatients}</p>
          <p className="text-sm text-slate-400 mt-1">Total Patients</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <ActivityIcon />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400 font-medium">
              <TrendingUpIcon /> +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{analyticsData.activeSessions}</p>
          <p className="text-sm text-slate-400 mt-1">Active Sessions</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertIcon />
            </div>
            <span className="flex items-center gap-1 text-sm text-red-400 font-medium">
              <TrendingDownIcon /> -3%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{analyticsData.alertsTriggered}</p>
          <p className="text-sm text-slate-400 mt-1">Alerts This Week</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <DatabaseIcon />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-400 font-medium">
              <TrendingUpIcon /> +24%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{analyticsData.dataProcessed} GB</p>
          <p className="text-sm text-slate-400 mt-1">Data Processed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-semibold text-white mb-6">Weekly Activity</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyData.map((data, index) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-cyan-500 rounded-t-lg transition-all hover:bg-cyan-600 relative group"
                    style={{ height: `${(data.sessions / maxSessions) * 160}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.sessions} sessions
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-semibold text-white mb-6">Conditions Distribution</h3>
          <div className="space-y-4">
            {conditionData.map((item, index) => (
              <div key={item.condition}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">{item.condition}</span>
                  <span className="font-medium text-white">{item.patients}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'session' ? 'bg-blue-500/20' :
                  activity.type === 'alert' ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}>
                  {activity.type === 'session' ? <ActivityPulseIcon /> :
                   activity.type === 'alert' ? <AlertIcon /> : <ShieldIcon />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.patient}</p>
                  <p className="text-sm text-slate-400">{activity.action}</p>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ClockIcon /> {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-semibold text-white mb-6">System Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Blockchain Network</span>
                <span className="text-green-400 font-medium">Healthy</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-full w-[98%] bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">IPFS Storage</span>
                <span className="text-green-400 font-medium">Healthy</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-full w-[95%] bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Encryption Service</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Consent Registry</span>
                <span className="text-green-400 font-medium">Synced</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
}
