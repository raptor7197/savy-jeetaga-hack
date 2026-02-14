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
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      source: 'Patient Portal',
      status: 'active',
      requestDate: '2024-01-25',
      patientData: {
        brainActivity: 84,
        focusScore: 92,
        stressLevel: 24,
        heartRate: 72,
        bloodPressure: '120/80',
        temperature: 98.6,
        oxygenLevel: 98
      }
    },
    {
      id: 'PRM-002',
      doctorId: 'DOC-002',
      doctorName: 'Dr. Priya Patel',
      specialty: 'Psychiatrist',
      hospital: 'Mind Wellness Center',
      scope: 'Mental Health Records, Medication History',
      expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      source: 'Emergency Access',
      status: 'pending',
      requestDate: '2024-01-28',
      patientData: null
    },
    {
      id: 'PRM-003',
      doctorId: 'DOC-003',
      doctorName: 'Dr. Rajesh Kumar',
      specialty: 'General Physician',
      hospital: 'City Hospital',
      scope: 'General Health Records, Lab Results',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      source: 'Hospital Referral',
      status: 'active',
      requestDate: '2024-01-20',
      patientData: {
        brainActivity: 78,
        focusScore: 88,
        stressLevel: 32,
        heartRate: 68,
        bloodPressure: '118/78',
        temperature: 98.4,
        oxygenLevel: 99
      }
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(null);
  const [expandedDoctor, setExpandedDoctor] = useState(null);

  useEffect(() => {
    const checkExpiry = () => {
      const now = new Date();
      setPermissions(prev => prev.map(permission => {
        if (permission.expiryDate && permission.expiryDate < now && permission.status === 'active') {
          return { ...permission, status: 'expired' };
        }
        return permission;
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
  const filteredPermissions = filter === 'all'
    ? permissions
    : permissions.filter(permission => permission.status === filter);

  const [searchTerm, setSearchTerm] = useState('');
  const searchedPermissions = searchTerm
    ? filteredPermissions.filter(permission =>
        permission.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredPermissions;

  const handleAccept = (permissionId) => {
    setIsProcessing(permissionId);
    setTimeout(() => {
      setPermissions(prev => prev.map(permission => 
        permission.id === permissionId ? { 
          ...permission, 
          status: 'active',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          patientData: {
            brainActivity: Math.floor(Math.random() * 20) + 75,
            focusScore: Math.floor(Math.random() * 20) + 75,
            stressLevel: Math.floor(Math.random() * 40) + 10,
            heartRate: Math.floor(Math.random() * 20) + 60,
            bloodPressure: `${110 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`,
            temperature: (97 + Math.random() * 2).toFixed(1),
            oxygenLevel: 95 + Math.floor(Math.random() * 5)
          }
        } : permission
      ));
      setIsProcessing(null);
    }, 1000);
  };

  const handleReject = (permissionId) => {
    setIsProcessing(permissionId);
    setTimeout(() => {
      setPermissions(prev => prev.map(permission => 
        permission.id === permissionId ? { ...permission, status: 'rejected' } : permission
      ));
      setIsProcessing(null);
    }, 1000);
  };

  const handleRevokeAccess = (permissionId) => {
    setIsProcessing(permissionId);
    setTimeout(() => {
      setPermissions(prev => prev.map(permission => 
        permission.id === permissionId ? { ...permission, status: 'revoked', patientData: null } : permission
      ));
      setIsProcessing(null);
      setExpandedDoctor(null);
    }, 1000);
  };

  const toggleExpand = (permissionId) => {
    setExpandedDoctor(expandedDoctor === permissionId ? null : permissionId);
  };

  const pendingRequests = permissions.filter(p => p.status === 'pending');
  const activeRequests = permissions.filter(p => p.status === 'active');

  return (
    <div className="ml-[260px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">My Requests</h1>
        <p className="text-gray-600">Manage who has access to your health data</p>
      </div>

      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Requests</h2>
          <div className="grid gap-4">
            {pendingRequests.map(request => (
              <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{request.doctorName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{request.doctorName}</h3>
                      <p className="text-sm text-gray-600">{request.specialty} - {request.hospital}</p>
                      <p className="text-sm text-gray-500 mt-1">Requested: {request.requestDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept(request.id)}
                      disabled={isProcessing === request.id}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {isProcessing === request.id ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={isProcessing === request.id}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                    >
                      {isProcessing === request.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600"><span className="font-medium">Requested Data:</span> {request.scope}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{permissions.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-600">Active Access</p>
          <p className="text-2xl font-bold text-green-600">{activeRequests.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-600">Revoked</p>
          <p className="text-2xl font-bold text-red-600">{permissions.filter(p => p.status === 'revoked' || p.status === 'rejected').length}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2"
          >
            <option value="all">All Permissions</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
          </select>
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Active Permissions List */}
      <div className="space-y-4">
        {searchedPermissions.filter(p => p.status === 'active').map(permission => (
          <div key={permission.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{permission.doctorName.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{permission.doctorName}</h3>
                  <p className="text-sm text-gray-600">{permission.specialty} - {permission.hospital}</p>
                  <p className="text-xs text-gray-500 mt-1">Expires: {getTimeRemaining(permission.expiryDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleExpand(permission.id)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                >
                  {expandedDoctor === permission.id ? 'Hide Data' : 'View Data'}
                </button>
                <button
                  onClick={() => handleRevokeAccess(permission.id)}
                  disabled={isProcessing === permission.id}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                >
                  Revoke
                </button>
              </div>
            </div>

            {/* Expanded Data View */}
            {expandedDoctor === permission.id && permission.patientData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Patient Health Data</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Brain Activity</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.brainActivity} Hz</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Focus Score</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.focusScore}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Stress Level</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.stressLevel}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Heart Rate</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.heartRate} BPM</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Blood Pressure</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.bloodPressure}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.temperature}°F</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-xs text-gray-500">Oxygen Level</p>
                    <p className="text-xl font-bold text-gray-800">{permission.patientData.oxygenLevel}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {searchedPermissions.filter(p => p.status === 'active').length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No active permissions
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;