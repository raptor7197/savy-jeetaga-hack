import React from 'react';

const UserPage = () => {
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

  return (
    <div className="ml-[260px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">My Profile</h1>
        <p className="text-gray-600">Manage your personal health information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <span className="text-4xl font-bold text-white">RS</span>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">{user.name}</h2>
              <p className="text-sm text-gray-500 mb-6">ID: {user.id}</p>

              <div className="flex space-x-4 w-full">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Edit Profile
                </button>
                <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-3 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Quick Stats</h3>
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

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Health Metrics</h3>
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

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform hover:scale-[1.01] transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                <p className="text-sm text-gray-800">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                <p className="text-sm text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                <p className="text-sm text-gray-800">{user.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth</label>
                <p className="text-sm text-gray-800">{user.dateOfBirth}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                <p className="text-sm text-gray-800">{user.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Blood Type</label>
                <p className="text-sm text-gray-800">{user.bloodType}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform hover:scale-[1.01] transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Height</label>
                <p className="text-sm text-gray-800">{user.height}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Weight</label>
                <p className="text-sm text-gray-800">{user.weight}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">Allergies</label>
                <div className="flex flex-wrap gap-2 mt-2">
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
                <label className="block text-sm font-medium text-gray-600 mb-2">Medical Conditions</label>
                <div className="flex flex-wrap gap-2 mt-2">
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

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform hover:scale-[1.01] transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Contact Name</label>
                <p className="text-sm text-gray-800">{user.emergencyContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                <p className="text-sm text-gray-800">{user.emergencyPhone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-[1.01] transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Sessions</h3>
            <div className="space-y-4">
              {healthData.recentSessions.map(session => (
                <div key={session.id} className="p-6 border border-gray-200 rounded-xl transform hover:translate-x-2 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{session.type}</h4>
                      <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full">
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