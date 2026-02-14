import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import EEGChart from './components/EEGChart';
import PatientListPage from './pages/PatientListPage';
import SessionArchivesPage from './pages/SessionArchivesPage';
import AnalyticsPage from './pages/AnalyticsPage';

function HeartRateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.78-.78a5.4 5.4 0 0 0 0-7.65z"></path>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10z"></path>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      <path d="M12 16v6"></path>
      <path d="M12 2v6"></path>
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

function DashboardPage() {
  return (
    <div className="ml-[260px] p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2">Real-time analysis for Patient #NEU-2024-0892</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none cursor-pointer">
            <option>Last 30 Minutes</option>
            <option>Last Hour</option>
            <option>Last 24 Hours</option>
          </select>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={BrainIcon} label="Brain Activity" value={84} suffix="Hz" change={12.5} changeType="increase" delay={0} />
        <MetricCard icon={FocusIcon} label="Focus Score" value={92} suffix="%" change={4.2} changeType="increase" delay={100} />
        <MetricCard icon={ActivityIcon} label="Stress Level" value={24} suffix="Low" change={8.1} changeType="decrease" delay={200} />
        <MetricCard icon={HeartRateIcon} label="Heart Rate" value={72} suffix="BPM" change={1.2} changeType="neutral" delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Live EEG Stream</h3>
              <p className="text-xs text-gray-500 mt-1">Channels Fp1, Fp2, C3, C4 active</p>
            </div>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-green-500">LIVE</span>
            </div>
          </div>
          <div className="relative w-full h-[300px] bg-gray-50 rounded-xl overflow-hidden">
            <EEGChart />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6">Spectral Analysis</h3>
          <div className="rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center p-8 text-center h-[250px]">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Spectral Density</p>
            <p className="text-xs text-gray-500 mt-2">Alpha: 12.4 Hz • Beta: 18.2 Hz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patients" element={<PatientListPage />} />
            <Route path="/archives" element={<SessionArchivesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
