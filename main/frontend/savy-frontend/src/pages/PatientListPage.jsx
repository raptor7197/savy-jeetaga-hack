import React, { useState } from 'react';

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

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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

  return (
    <div className="ml-[260px] p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient List</h1>
          <p className="text-gray-500 mt-2">Manage and monitor all registered patients</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <PlusIcon /> Add Patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Patients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockPatients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {mockPatients.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Monitoring</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {mockPatients.filter(p => p.status === 'Monitoring').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Critical</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {mockPatients.filter(p => p.status === 'Critical').length}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sessions</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Session</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-cyan-600">{patient.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{patient.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-700' :
                    patient.status === 'Monitoring' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{patient.sessions}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{patient.lastSession}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-cyan-600 transition-colors">
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No patients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
