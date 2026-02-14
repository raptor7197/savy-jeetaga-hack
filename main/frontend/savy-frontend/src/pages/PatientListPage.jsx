import React, { useState } from 'react';

// Mock data for patients
const mockPatients = [
  { id: 'P001', name: 'John Smith', age: 45, condition: 'Epilepsy', status: 'Active', lastSession: '2024-01-15', sessions: 24 },
  { id: 'P002', name: 'Sarah Johnson', age: 32, condition: 'Sleep Disorder', status: 'Active', lastSession: '2024-01-14', sessions: 18 },
  { id: 'P003', name: 'Michael Chen', age: 58, condition: 'Alzheimer', status: 'Monitoring', lastSession: '2024-01-15', sessions: 42 },
  { id: 'P004', name: 'Emily Davis', age: 28, condition: 'Migraine', status: 'Active', lastSession: '2024-01-13', sessions: 12 },
  { id: 'P005', name: 'Robert Wilson', age: 65, condition: 'Parkinson', status: 'Critical', lastSession: '2024-01-15', sessions: 56 },
  { id: 'P006', name: 'Lisa Anderson', age: 41, condition: 'Anxiety', status: 'Active', lastSession: '2024-01-12', sessions: 8 },
  { id: 'P007', name: 'David Brown', age: 52, condition: 'TBI', status: 'Monitoring', lastSession: '2024-01-14', sessions: 31 },
  { id: 'P008', name: 'Jennifer Martinez', age: 36, condition: 'Depression', status: 'Active', lastSession: '2024-01-15', sessions: 15 },
];

const statusColors = {
  Active: 'bg-green-100 text-green-700',
  Monitoring: 'bg-blue-100 text-blue-700',
  Critical: 'bg-red-100 text-red-700',
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  <main className="flex-1 ml-[260px] p-8 space-y-8 overflow-y-auto bg-slate-950 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Patient List</h1>
          <p className="text-slate-400 mt-2">Manage and monitor all registered patients</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <PlusIcon /> Add Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-sm text-slate-400">Total Patients</p>
          <p className="text-2xl font-bold text-white mt-1">{mockPatients.length}</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {mockPatients.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-sm text-slate-400">Monitoring</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {mockPatients.filter(p => p.status === 'Monitoring').length}
          </p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
          <p className="text-sm text-slate-400">Critical</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {mockPatients.filter(p => p.status === 'Critical').length}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-slate-900 border border-slate-700 text-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-950 border-b border-slate-800">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Age</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sessions</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Session</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-cyan-400">{patient.id}</td>
                <td className="px-6 py-4 text-sm text-white font-medium">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{patient.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    patient.status === 'Monitoring' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{patient.sessions}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{patient.lastSession}</td>
                <td className="px-6 py-4">
                  <button className="text-slate-400 hover:text-cyan-400 transition-colors">
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No patients found matching your criteria</p>
          </div>
        )}
      </div>
    </main>
}
