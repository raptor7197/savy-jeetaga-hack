import React, { useState } from 'react';

const DoctorAccessRequestPage = () => {
  const patients = [
    { id: 'USR-2024-001', name: 'Rahul Sharma', age: 34, condition: 'Migraine', status: 'Active', lastSession: '2024-01-15', hasAccess: false },
    { id: 'USR-2024-002', name: 'Priya Patel', age: 28, condition: 'Anxiety', status: 'Monitoring', lastSession: '2024-01-20', hasAccess: true },
    { id: 'USR-2024-003', name: 'Amit Kumar', age: 42, condition: 'Epilepsy', status: 'Critical', lastSession: '2024-01-25', hasAccess: false },
    { id: 'USR-2024-004', name: 'Neha Singh', age: 31, condition: 'Insomnia', status: 'Active', lastSession: '2024-01-18', hasAccess: true },
    { id: 'USR-2024-005', name: 'Rajesh Gupta', age: 45, condition: 'Depression', status: 'Monitoring', lastSession: '2024-01-22', hasAccess: false },
    { id: 'USR-2024-006', name: 'Sneha Reddy', age: 29, condition: 'ADHD', status: 'Active', lastSession: '2024-01-19', hasAccess: true },
    { id: 'USR-2024-007', name: 'Vikram Singh', age: 38, condition: 'Chronic Pain', status: 'Critical', lastSession: '2024-01-24', hasAccess: false },
    { id: 'USR-2024-008', name: 'Ananya Desai', age: 33, condition: 'PTSD', status: 'Monitoring', lastSession: '2024-01-21', hasAccess: true }
  ];

  const [isRequesting, setIsRequesting] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);

  const handleRequestAccess = (patientId) => {
    setIsRequesting(patientId);
    setTimeout(() => {
      setIsRequesting(null);
      setRequestSuccess(patientId);
      setTimeout(() => {
        setRequestSuccess(null);
      }, 2000);
    }, 1500);
  };

  const handleViewData = (patientId) => {
    alert(`Viewing data for patient ${patientId}`);
  };

  const [filter, setFilter] = useState('all');
  const filteredPatients = filter === 'all' 
    ? patients 
    : patients.filter(patient => patient.hasAccess === (filter === 'granted'));

  const [searchTerm, setSearchTerm] = useState('');
  const searchedPatients = searchTerm 
    ? filteredPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredPatients;

  return (
    <div className="ml-[260px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Patient Access Requests</h1>
        <p className="text-gray-600">Manage access to patient health data and submit access requests</p>
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
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
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
              <p className="text-sm text-gray-600">Access Granted</p>
              <p className="text-2xl font-bold text-gray-800">{patients.filter(p => p.hasAccess).length}</p>
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
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
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
              <p className="text-sm text-gray-600">Access Denied</p>
              <p className="text-2xl font-bold text-gray-800">{patients.filter(p => !p.hasAccess).length - 2}</p>
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
              <option value="all">All Patients</option>
              <option value="granted">Access Granted</option>
              <option value="pending">Pending Requests</option>
              <option value="denied">Access Denied</option>
            </select>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Session</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors transform hover:translate-x-1">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-md">
                        <span className="text-white text-sm font-bold">{patient.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.condition}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-800' :
                      patient.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.lastSession}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.hasAccess ? 'bg-green-100 text-green-800' :
                      isRequesting === patient.id ? 'bg-blue-100 text-blue-800' :
                      requestSuccess === patient.id ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {isRequesting === patient.id ? 'Requesting...' :
                       requestSuccess === patient.id ? 'Request Sent!' :
                       patient.hasAccess ? 'Access Granted' : 'No Access'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {patient.hasAccess ? (
                      <button
                        onClick={() => handleViewData(patient.id)}
                        className="text-cyan-600 hover:text-cyan-900 transform hover:scale-105 transition-transform"
                      >
                        View Data
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestAccess(patient.id)}
                        disabled={isRequesting === patient.id}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isRequesting === patient.id 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-cyan-600 hover:bg-cyan-700 text-white transform hover:scale-105'
                        }`}
                      >
                        {isRequesting === patient.id ? 'Requesting...' : 'Request Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {searchedPatients.length === 0 && (
          <div className="text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-gray-500">No patients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAccessRequestPage;