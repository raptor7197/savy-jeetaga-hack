import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import EEGChart from './components/EEGChart';

// Simple Icon Components
function HeartRateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78 7.65 7.65 7.65-7.65.78-.78a5.4 5.4 0 0 0 0-7.65z"></path>
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10z"></path>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      <path d="M12 16v6"></path>
      <path d="M12 2v6"></path>
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
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

function App() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header Section */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Real-time analysis for Patient #NEU-2024-0892</p>
            </div>
            <div className="flex gap-3">
              <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none hover:border-gray-300 transition-colors cursor-pointer">
                <option>Last 30 Minutes</option>
                <option>Last Hour</option>
                <option>Last 24 Hours</option>
              </select>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-orange-200">
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={BrainIcon}
              label="Brain Activity"
              value={84}
              suffix="Hz"
              change={12.5}
              changeType="increase"
              delay={0}
            />
            <MetricCard
              icon={FocusIcon}
              label="Focus Score"
              value={92}
              suffix="%"
              change={4.2}
              changeType="increase"
              delay={100}
            />
            <MetricCard
              icon={ActivityIcon}
              label="Stress Level"
              value={24}
              suffix="Low"
              change={8.1}
              changeType="decrease"
              delay={200}
            />
            <MetricCard
              icon={HeartRateIcon}
              label="Heart Rate"
              value={72}
              suffix="BPM"
              change={1.2}
              changeType="neutral"
              delay={300}
            />
          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
            {/* Live EEG Stream */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Live EEG Stream</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Channels Fp1, Fp2, C3, C4 active</p>
                </div>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-green-600">LIVE</span>
                </div>
              </div>
              <div className="flex-1 relative w-full h-[300px] bg-slate-50 rounded-xl overflow-hidden">
                <EEGChart />
              </div>
            </div>

            {/* Spectral Analysis (Placeholder since component is empty) */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-6">Spectral Analysis</h3>
              <div className="flex-1 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                     <path d="M12 20V10"></path>
                     <path d="M18 20V4"></path>
                     <path d="M6 20v-4"></path>
                   </svg>
                 </div>
                 <p className="text-sm font-medium text-gray-900">Visualizations Loading</p>
                 <p className="text-xs text-gray-500 mt-1">Generating spectral density maps...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
