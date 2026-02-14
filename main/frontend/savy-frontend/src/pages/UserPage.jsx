import React, { useState } from 'react';

const UserPage = () => {
  // Mock user data
  const user = {
    id: 'USR-2024-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodType: 'A+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Penicillin', 'Peanuts'],
    medicalConditions: ['Migraine', 'Hypertension'],
    emergencyContact: 'Priya Sharma (Spouse)',
    emergencyPhone: '+91 98765 43211',
    registeredDate: '2023-03-10',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-20'
  };

  // Mock health data
  const healthData = {
    brainActivity: 84,
    focusScore: 92,
    stressLevel: 24,
    heartRate: 72,
    recentSessions: [
      { id: 'SES-2024-001', date: '2024-01-15', duration: '45 min', type: 'Routine Checkup', status: 'Completed' },
      { id: 'SES-2024-002', date: '2024-01-20', duration: '60 min', type: 'EEG Monitoring', status: 'Completed' },
      { id: 'SES-2024-003', date: '2024-01-25', duration: '30 min', type: 'Follow-up', status: 'Completed' }
    ]
  };

  // Doctor access requests state
  const [accessRequests, setAccessRequests] = useState([
    { id: 'DOC-001', name: 'Dr. Aris Thorne', specialty: 'Neurologist', hospital: 'NeuroCare Hospital', requestDate: '2024-01-28', status: 'pending' },
    { id: 'DOC-002', name: 'Dr. Priya Patel', specialty: 'Psychiatrist', hospital: 'Mind Wellness Center', requestDate: '2024-01-25', status: 'granted' },
    { id: 'DOC-003', name: 'Dr. Rajesh Kumar', specialty: 'General Physician', hospital: 'City Hospital', requestDate: '2024-01-20', status: 'denied' }
  ]);

  // Handle access request responses
  const handleGrantAccess = (doctorId) => {
    setAccessRequests(accessRequests.map(request => 
      request.id === doctorId ? { ...request, status: 'granted' } : request
    ));
  };

  const handleDenyAccess = (doctorId) => {
    setAccessRequests(accessRequests.map(request => 
      request.id === doctorId ? { ...request, status: 'denied' } : request
    ));
  };

  // Handle revoke access
  const handleRevokeAccess = (doctorId) => {
    setAccessRequests(accessRequests.map(request => 
      request.id === doctorId ? { ...request, status: 'denied' } : request
    ));
  };

  // Get pending requests
  const pendingRequests = accessRequests.filter(request => request.status === 'pending');
  const grantedAccess = accessRequests.filter(request => request.status === 'granted');
  const deniedRequests = accessRequests.filter(request => request.status === 'denied');

  return (
    <div className="ml-[260px] p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your personal health information and doctor access</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">RS</span>
              </div>
              
              {/* Name */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h2>
              
              {/* User ID */}
              <p className="text-sm text-gray-500 mb-4">ID: {user.id}</p>

              {/* Action Buttons */}
              <div className="flex space-x-3 w-full">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Edit Profile
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-800">{user.registeredDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Visit</span>
                <span className="text-sm font-medium text-gray-800">{user.lastVisit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Next Appointment</span>
                <span className="text-sm font-medium text-cyan-600">{user.nextAppointment}</span>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Brain Activity</span>
                <span className="text-sm font-medium text-gray-800">{healthData.brainActivity} Hz</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Focus Score</span>
                <span className="text-sm font-medium text-gray-800">{healthData.focusScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stress Level</span>
                <span className="text-sm font-medium text-gray-800">{healthData.stressLevel} (Low)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Heart Rate</span>
                <span className="text-sm font-medium text-gray-800">{healthData.heartRate} BPM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2">
          {/* Access Requests Section */}
          {(pendingRequests.length > 0) && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Access Requests</h3>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  {pendingRequests.length} Pending
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{request.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{request.name}</h4>
                          <p className="text-sm text-gray-600">{request.specialty} - {request.hospital}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{request.requestDate}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGrantAccess(request.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Grant Access
                      </button>
                      <button
                        onClick={() => handleDenyAccess(request.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Granted Access Section */}
          {grantedAccess.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Doctors with Access</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {grantedAccess.length} Active
                </span>
              </div>
              
              <div className="space-y-4">
                {grantedAccess.map(request => (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{request.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{request.name}</h4>
                          <p className="text-sm text-gray-600">{request.specialty} - {request.hospital}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(request.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="text-sm text-gray-800">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <p className="text-sm text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <p className="text-sm text-gray-800">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <p className="text-sm text-gray-800">{user.dateOfBirth}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                <p className="text-sm text-gray-800">{user.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Blood Type</label>
                <p className="text-sm text-gray-800">{user.bloodType}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Height</label>
                <p className="text-sm text-gray-800">{user.height}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
                <p className="text-sm text-gray-800">{user.weight}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Allergies</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Medical Conditions</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.medicalConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Contact Name</label>
                <p className="text-sm text-gray-800">{user.emergencyContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                <p className="text-sm text-gray-800">{user.emergencyPhone}</p>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {healthData.recentSessions.map(session => (
                <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{session.type}</h4>
                      <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;