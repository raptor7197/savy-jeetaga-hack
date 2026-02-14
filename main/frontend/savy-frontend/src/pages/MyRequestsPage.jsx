import React, { useState, useEffect } from 'react';

const MyRequestsPage = () => {
  const [permissions, setPermissions] = useState([
    {
      id: 'PRM-001',
      doctorId: 'DOC-001',
      doctorName: 'Dr. Aris Thorne',
      specialty: 'Neurologist',
      hospital: 'NeuroCare Hospital',
      scope: 'EEG Records, Medical History',
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      source: 'Patient Portal',
      status: 'active',
      requestDate: '2024-01-25'
    },
    {
      id: 'PRM-002',
      doctorId: 'DOC-002',
      doctorName: 'Dr. Priya Patel',
      specialty: 'Psychiatrist',
      hospital: 'Mind Wellness Center',
      scope: 'Mental Health Records, Medication History',
      expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (expired)
      source: 'Emergency Access',
      status: 'expired',
      requestDate: '2024-01-18'
    },
    {
      id: 'PRM-003',
      doctorId: 'DOC-003',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      hospital: 'City Hospital',
      scope: 'General Health Records, Lab Results',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      source: 'Hospital Referral',
      status: 'active',
      requestDate: '2024-01-20'
    }
  ]);

  // Check and update permissions status based on expiry dates
  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      setPermissions(prev => prev.map(permission => {
        if (permission.expiryDate < now && permission.status === 'active') {
          return { ...permission, status: 'expired' };
        }
        return permission;
      }));
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining for active permissions
  const getTimeRemaining = (expiryDate) => {
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

  // Filter permissions by status
  const [filter, setFilter] = useState('all');
  const filteredPermissions = filter === 'all'
    ? permissions
    : permissions.filter(permission => permission.status === filter);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const searchedPermissions = searchTerm
    ? filteredPermissions.filter(permission =>
        permission.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredPermissions;

  // Handle revoke access
  const [isRevoking, setIsRevoking] = useState(null);
  const handleRevokeAccess = (permissionId) => {
    setIsRevoking(permissionId);
    setTimeout(() => {
      setPermissions(prev => prev.map(permission => 
        permission.id === permissionId ? { ...permission, status: 'revoked' } : permission
      ));
      setIsRevoking(null);
    }, 1200);
  };

  return (
    <div className="ml-[260px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">My Requests</h1>
        <p className="text-gray-600">View and manage who has access to your health data</p>
      </div>

      {/* Stats Cards */}
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
              <p className="text-sm text-gray-600">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-800">{permissions.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">{permissions.filter(p => p.status === 'active').length}</p>
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
              <p className="text-sm text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-800">{permissions.filter(p => p.status === 'expired').length}</p>
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
              <p className="text-sm text-gray-600">Revoked</p>
              <p className="text-2xl font-bold text-gray-800">{permissions.filter(p => p.status === 'revoked').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 outline-none cursor-pointer hover:border-gray-300 transition-colors"
            >
              <option value="all">All Permissions</option>
              <option value="active">Active Access</option>
              <option value="expired">Expired</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors, hospitals..."
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

      {/* Permissions List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Scope</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchedPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50 transition-colors transform hover:translate-x-1">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white text-sm font-bold">{permission.doctorName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{permission.doctorName}</div>
                        <div className="text-sm text-gray-500">{permission.hospital}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{permission.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{permission.scope}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {permission.expiryDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className={`text-xs font-medium ${
                      permission.status === 'active' ? 'text-green-600' :
                      permission.status === 'expired' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {getTimeRemaining(permission.expiryDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{permission.source}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      permission.status === 'active' ? 'bg-green-100 text-green-800' :
                      permission.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {permission.status.charAt(0).toUpperCase() + permission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {permission.status === 'active' && (
                      <button
                        onClick={() => handleRevokeAccess(permission.id)}
                        disabled={isRevoking === permission.id}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isRevoking === permission.id
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                        }`}
                      >
                        {isRevoking === permission.id ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Revoking...
                          </div>
                        ) : (
                          'Revoke Access'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {searchedPermissions.length === 0 && (
          <div className="text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500">No permissions found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;