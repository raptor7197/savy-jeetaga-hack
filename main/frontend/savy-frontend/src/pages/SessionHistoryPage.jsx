import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockSessions = [
  { id: 'S001', patientName: 'John Smith', patientId: 'P001', date: '2024-01-15', duration: '45 min', type: 'Routine Checkup', status: 'Completed', dataSize: '12.5 MB' },
  { id: 'S002', patientName: 'Sarah Johnson', patientId: 'P002', date: '2024-01-14', duration: '60 min', type: 'EEG Monitoring', status: 'Completed', dataSize: '18.2 MB' },
  { id: 'S003', patientName: 'Michael Brown', patientId: 'P003', date: '2024-01-15', duration: '90 min', type: 'Deep Brain Analysis', status: 'Completed', dataSize: '25.8 MB' },
  { id: 'S004', patientName: 'Emily Davis', patientId: 'P004', date: '2024-01-13', duration: '30 min', type: 'Quick Scan', status: 'Completed', dataSize: '8.3 MB' },
  { id: 'S005', patientName: 'Robert Wilson', patientId: 'P005', date: '2024-01-15', duration: '120 min', type: 'Long-term Monitoring', status: 'Completed', dataSize: '32.1 MB' },
  { id: 'S006', patientName: 'Jennifer Martinez', patientId: 'P006', date: '2024-01-12', duration: '40 min', type: 'Follow-up Check', status: 'Completed', dataSize: '10.7 MB' },
  { id: 'S007', patientName: 'David Garcia', patientId: 'P007', date: '2024-01-14', duration: '75 min', type: 'Brain Mapping', status: 'Completed', dataSize: '22.4 MB' },
  { id: 'S008', patientName: 'Lisa Anderson', patientId: 'P008', date: '2024-01-15', duration: '50 min', type: 'Cognitive Assessment', status: 'Completed', dataSize: '14.9 MB' },
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

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function SessionHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hexCodes, setHexCodes] = useState([]);

  // Generate random hex codes
  const generateHexCodes = () => {
    const codes = [];
    for (let i = 0; i < 100; i++) {
      const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      codes.push(hex);
    }
    return codes;
  };

  // Handle view data - redirect to dashboard
  const handleViewData = () => {
    navigate('/dashboard');
  };

  // Handle download JSON file
  const handleDownload = (session) => {
    const data = {
      sessionId: session.id,
      patientName: session.patientName,
      patientId: session.patientId,
      date: session.date,
      duration: session.duration,
      type: session.type,
      status: session.status,
      dataSize: session.dataSize,
      hexCodes: generateHexCodes(),
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `session_${session.id}_${session.date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || session.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ml-[260px] p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-500 mt-2">View and manage all EEG monitoring sessions</p>
        </div>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <PlusIcon /> New Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{mockSessions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {mockSessions.filter(s => s.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {mockSessions.filter(s => s.status === 'In Progress').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Data</p>
          <p className="text-2xl font-bold text-cyan-600 mt-1">144 MB</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search sessions by patient name, ID, or session ID..."
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
          <option value="Routine Checkup">Routine Checkup</option>
          <option value="EEG Monitoring">EEG Monitoring</option>
          <option value="Deep Brain Analysis">Deep Brain Analysis</option>
          <option value="Quick Scan">Quick Scan</option>
          <option value="Long-term Monitoring">Long-term Monitoring</option>
          <option value="Follow-up Check">Follow-up Check</option>
          <option value="Brain Mapping">Brain Mapping</option>
          <option value="Cognitive Assessment">Cognitive Assessment</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Session ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Size</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-cyan-600">{session.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{session.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.patientId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    session.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{session.dataSize}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleViewData}
                      className="text-gray-400 hover:text-cyan-600 transition-colors"
                      title="View Data"
                    >
                      <EyeIcon />
                    </button>
                    <button 
                      onClick={() => handleDownload(session)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Download JSON"
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSessions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No sessions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}