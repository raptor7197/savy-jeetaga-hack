import React, { useState } from 'react';

const mockSessions = [
  { id: 'S001', patientId: 'P001', patientName: 'John Smith', date: '2024-01-15', duration: '45 min', type: 'Diagnostic', status: 'Completed', dataSize: '2.4 GB', ipfsCid: 'QmXyZ123...', consent: 'Granted' },
  { id: 'S002', patientId: 'P002', patientName: 'Sarah Johnson', date: '2024-01-14', duration: '30 min', type: 'Monitoring', status: 'Completed', dataSize: '1.8 GB', ipfsCid: 'QmAbc456...', consent: 'Granted' },
  { id: 'S003', patientId: 'P003', patientName: 'Michael Chen', date: '2024-01-15', duration: '60 min', type: 'Research', status: 'Completed', dataSize: '3.2 GB', ipfsCid: 'QmDef789...', consent: 'Granted' },
  { id: 'S004', patientId: 'P001', patientName: 'John Smith', date: '2024-01-13', duration: '45 min', type: 'Diagnostic', status: 'Completed', dataSize: '2.4 GB', ipfsCid: 'QmGhi012...', consent: 'Granted' },
  { id: 'S005', patientId: 'P004', patientName: 'Emily Davis', date: '2024-01-13', duration: '25 min', type: 'Monitoring', status: 'Completed', dataSize: '1.2 GB', ipfsCid: 'QmJkl345...', consent: 'Pending' },
  { id: 'S006', patientId: 'P005', patientName: 'Robert Wilson', date: '2024-01-15', duration: '90 min', type: 'Critical', status: 'Completed', dataSize: '4.8 GB', ipfsCid: 'QmMno678...', consent: 'Granted' },
  { id: 'S007', patientId: 'P003', patientName: 'Michael Chen', date: '2024-01-12', duration: '60 min', type: 'Research', status: 'Completed', dataSize: '3.2 GB', ipfsCid: 'QmPqr901...', consent: 'Granted' },
  { id: 'S008', patientId: 'P007', patientName: 'David Brown', date: '2024-01-14', duration: '40 min', type: 'Monitoring', status: 'Processing', dataSize: '2.1 GB', ipfsCid: 'Pending...', consent: 'Granted' },
];

const sessionTypes = ['Diagnostic', 'Monitoring', 'Research', 'Critical'];

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function SessionArchivesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || session.type === filterType;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalSize = mockSessions.reduce((acc, s) => acc + parseFloat(s.dataSize), 0);

  return (
    <div className="ml-[260px] p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Archives</h1>
          <p className="text-gray-500 mt-2">View and manage all recorded EEG sessions</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <DownloadIcon /> Export All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Data</p>
              <p className="text-2xl font-bold text-gray-900">{totalSize.toFixed(1)} GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consented</p>
              <p className="text-2xl font-bold text-green-600">
                {mockSessions.filter(s => s.consent === 'Granted').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <LockIcon />
            </div>
            <div>
              <p className="text-sm text-gray-500">Encrypted</p>
              <p className="text-2xl font-bold text-gray-900">{mockSessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search by patient name or session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">All Types</option>
          {sessionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Session ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Patient</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Size</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Consent</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-cyan-600">{session.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{session.patientName}</p>
                    <p className="text-xs text-gray-400">{session.patientId}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.type}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.dataSize}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    session.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    session.consent === 'Granted' ? 'text-green-600' :
                    session.consent === 'Pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {session.consent}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="text-gray-400 hover:text-cyan-600 transition-colors" title="View">
                      <EyeIcon />
                    </button>
                    <button className="text-gray-400 hover:text-cyan-600 transition-colors" title="Download">
                      <DownloadIcon />
                    </button>
                    <button className="text-gray-400 hover:text-cyan-600 transition-colors" title="Blockchain Record">
                      <ShieldIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
