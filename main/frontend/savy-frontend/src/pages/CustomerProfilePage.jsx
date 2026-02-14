import React, { useState } from 'react';

const CustomerProfilePage = () => {
  // Mock customer data
  const customer = {
    id: 'CP-2024-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    address: '456 Park Street, Apartment 3C',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodType: 'A+',
    emergencyContact: 'Priya Sharma (Spouse)',
    emergencyPhone: '+91 98765 43211',
    allergies: ['Penicillin', 'Peanuts'],
    medicalConditions: ['Migraine', 'Hypertension'],
    height: '175 cm',
    weight: '70 kg',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-20',
    registeredDate: '2023-03-10'
  };
  const [selectedCustomerId, setSelectedCustomerId] = useState('CP-2024-001');

  const customers = [
    customer,
    {
      id: 'CP-2024-002',
      name: 'Priya Desai',
      email: 'priya.desai@example.com',
      phone: '+91 98765 43212',
      address: '789 Marine Drive, Tower B, Floor 5',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400020',
      country: 'India',
      dateOfBirth: '1992-08-22',
      gender: 'Female',
      bloodType: 'O+',
      emergencyContact: 'Amit Desai (Brother)',
      emergencyPhone: '+91 98765 43213',
      allergies: ['Latex'],
      medicalConditions: ['Asthma'],
      height: '162 cm',
      weight: '58 kg',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-02-25',
      registeredDate: '2023-06-15'
    },
    {
      id: 'CP-2024-003',
      name: 'Arjun Kumar',
      email: 'arjun.kumar@example.com',
      phone: '+91 98765 43214',
      address: '321 Bandra Reclamation, Penthouse',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India',
      dateOfBirth: '1988-12-10',
      gender: 'Male',
      bloodType: 'B+',
      emergencyContact: 'Sneha Kumar (Wife)',
      emergencyPhone: '+91 98765 43215',
      allergies: ['Sulfa drugs'],
      medicalConditions: ['Diabetes Type 2'],
      height: '178 cm',
      weight: '82 kg',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-02-18',
      registeredDate: '2023-01-20'
    }
  ];

  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || customer;

  // Access control state
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Grant access with delay
  const handleGrantAccess = () => {
    setIsLoading(true);
    // Simulate delay (2 seconds)
    setTimeout(() => {
      setAccessGranted(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="ml-[260px] p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>

      {/* Access Control Section */}
      {!accessGranted ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Access Required</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You need to grant access to view customer personal information. This data is protected by privacy regulations.
          </p>
          <button
            onClick={handleGrantAccess}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg transition-colors duration-200 font-medium ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Grant Access'
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">JD</span>
                </div>
                
                {/* Name */}
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{customer.name}</h2>
                
                {/* Customer ID */}
                <p className="text-sm text-gray-500 mb-4">ID: {customer.id}</p>

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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-800">{customer.registeredDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Visit</span>
                  <span className="text-sm font-medium text-gray-800">{customer.lastVisit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Appointment</span>
                  <span className="text-sm font-medium text-cyan-600">{customer.nextAppointment}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <p className="text-sm text-gray-800">{customer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <p className="text-sm text-gray-800">{customer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-sm text-gray-800">{customer.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <p className="text-sm text-gray-800">{customer.dateOfBirth}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <p className="text-sm text-gray-800">{customer.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Blood Type</label>
                  <p className="text-sm text-gray-800">{customer.bloodType}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                  <p className="text-sm text-gray-800">{customer.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                  <p className="text-sm text-gray-800">{customer.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                  <p className="text-sm text-gray-800">{customer.state}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">ZIP Code</label>
                  <p className="text-sm text-gray-800">{customer.zipCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                  <p className="text-sm text-gray-800">{customer.country}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Height</label>
                  <p className="text-sm text-gray-800">{customer.height}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Weight</label>
                  <p className="text-sm text-gray-800">{customer.weight}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Allergies</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {customer.allergies.map((allergy, index) => (
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
                    {customer.medicalConditions.map((condition, index) => (
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
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Contact Name</label>
                  <p className="text-sm text-gray-800">{customer.emergencyContact}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-sm text-gray-800">{customer.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfilePage;