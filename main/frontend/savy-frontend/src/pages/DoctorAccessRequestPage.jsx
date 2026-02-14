import React, { useState, useEffect } from 'react';

const DoctorAccessRequestPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-001',
      patientId: 'USR-2024-001',
      patientName: 'Rahul Sharma',
      age: 34,
      condition: 'Migraine',
      status: 'active',
      requestDate: '2024-01-25',
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      scope: 'EEG Records, Medical History'
    },
    {
      id: 'REQ-002',
      patientId: 'USR-2024-002',
      patientName: 'Priya Patel',
      age: 28,
      condition: 'Anxiety',
      status: 'active',
      requestDate: '2024-01-20',
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      scope: 'Mental Health Records'
    },
    {
      id: 'REQ-003',
      patientId: 'USR-2024-003',
      patientName: 'Amit Kumar',
      age: 42,
      condition: 'Epilepsy',
      status: 'expired',
      requestDate: '2024-01-15',
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      scope: 'EEG Records'
    },
    {
      id: 'REQ-004',
      patientId: 'USR-2024-004',
      patientName: 'Neha Singh',
      age: 31,
      condition: 'Insomnia',
      status: 'pending',
      requestDate: '2024-01-28',
      expiryDate: null,
      scope: 'Sleep Study Records'
    },
    {
      id: 'REQ-005',
      patientId: 'USR-2024-005',
      patientName: 'Rajesh Gupta',
      age: 45,
      condition: 'Depression',
      status: 'denied',
      requestDate: '2024-01-22',
      expiryDate: null,
      scope: 'Medical History'
    }
  ]);

  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      setRequests(prev => prev.map(request => {
        if (request.expiryDate && request.expiryDate < now && request.status === 'active') {
          return { ...request, status: 'expired' };
        }
        return request;
      }));
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000);

    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (expiryDate) => {
    if (!expiryDate) return 'N/A';
    const now = new Date();
    const difference = expiryDate - now;
    
    if (difference <= 0) return 'Expired';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const [filter, setFilter] = useState('all');
  const filteredRequests = filter === 'all'
    ? requests
    : requests.filter(request => request.status === filter);

  const [searchTerm, setSearchTerm] = useState('');
  const searchedRequests = searchTerm
    ? filteredRequests.filter(request =>
        request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredRequests;

  const handleViewData = (patientId) => {
    alert(`Viewing data for patient ${patientId}`);
  };

  return (
    <div className="ml-[260px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">My Access Requests</h1>
        <p className="text-gray-600">Manage your patient data access requests and view permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Access</p>
              <p className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4 shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Denied/Expired</p>
              <p className="text-2xl font-bold text-gray-800">{requests.filter(r => r.status === 'denied' || r.status === 'expired').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="all">All Requests</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients, conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full md:w-64"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Scope</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors transform hover:translate-x-1">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white text-sm font-bold">{request.patientName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{request.patientName}</div>
                        <div className="text-sm text-gray-500">{request.patientId} • {request.age} years</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.condition}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.scope}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.expiryDate ? (
                      <div>
                        <div className="text-sm text-gray-900">
                          {request.expiryDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className={`text-xs font-medium ${
                          request.status === 'active' ? 'text-green-600' :
                          request.status === 'expired' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {getTimeRemaining(request.expiryDate)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">N/A</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'active' ? 'bg-green-100 text-green-800' :
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'active' && (
                      <button
                        onClick={() => handleViewData(request.patientId)}
                        className="text-cyan-600 hover:text-cyan-900 transform hover:scale-105 transition-transform"
                      >
                        View Data
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {searchedRequests.length === 0 && (
          <div className="text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500">No requests found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAccessRequestPage;