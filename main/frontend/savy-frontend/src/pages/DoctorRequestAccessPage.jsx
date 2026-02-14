import React, { useState } from 'react';

const DoctorRequestAccessPage = () => {
  const [patients, setPatients] = useState([
    { id: 'USR-2024-001', name: 'Rahul Sharma', age: 34, condition: 'Migraine', status: 'Active', lastVisit: '2024-01-15', requestStatus: 'none' },
    { id: 'USR-2024-002', name: 'Priya Patel', age: 28, condition: 'Anxiety', status: 'Monitoring', lastVisit: '2024-01-20', requestStatus: 'pending' },
    { id: 'USR-2024-003', name: 'Amit Kumar', age: 42, condition: 'Epilepsy', status: 'Critical', lastVisit: '2024-01-25', requestStatus: 'none' },
    { id: 'USR-2024-004', name: 'Neha Singh', age: 31, condition: 'Insomnia', status: 'Active', lastVisit: '2024-01-18', requestStatus: 'approved' },
    { id: 'USR-2024-005', name: 'Rajesh Gupta', age: 45, condition: 'Depression', status: 'Monitoring', lastVisit: '2024-01-22', requestStatus: 'none' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isRequesting, setIsRequesting] = useState(null);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestAccess = (patientId) => {
    setIsRequesting(patientId);
    setTimeout(() => {
      setPatients(patients.map(p => 
        p.id === patientId ? { ...p, requestStatus: 'pending' } : p
      ));
      setIsRequesting(null);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>;
      case 'denied':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Denied</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Not Requested</span>;
    }
  };

  return (
    <div className="ml-[260px] p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Request Access</h1>
        <p className="text-gray-600">Request access to patient health records</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search patients by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.condition}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    patient.status === 'Active' ? 'bg-green-100 text-green-800' :
                    patient.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(patient.requestStatus)}</td>
                <td className="px-6 py-4">
                  {patient.requestStatus === 'none' ? (
                    <button
                      onClick={() => handleRequestAccess(patient.id)}
                      disabled={isRequesting === patient.id}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg disabled:opacity-50"
                    >
                      {isRequesting === patient.id ? 'Sending...' : 'Request Access'}
                    </button>
                  ) : patient.requestStatus === 'pending' ? (
                    <span className="text-sm text-gray-500">Request Sent</span>
                  ) : patient.requestStatus === 'approved' ? (
                    <span className="text-sm text-green-600">Access Granted</span>
                  ) : (
                    <button
                      onClick={() => handleRequestAccess(patient.id)}
                      disabled={isRequesting === patient.id}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg disabled:opacity-50"
                    >
                      Retry Request
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No patients found
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRequestAccessPage;