import React from 'react';

const CustomerProfilePage = () => {
  // Mock customer data
  const customer = {
    id: 'CP-2024-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Suite 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    bloodType: 'A+',
    emergencyContact: 'Jane Doe (Spouse)',
    emergencyPhone: '+1 (555) 987-6543',
    allergies: ['Penicillin', 'Peanuts'],
    medicalConditions: ['Migraine', 'Hypertension'],
    height: '180 cm',
    weight: '75 kg',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-20',
    registeredDate: '2023-03-10'
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>

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
    </div>
  );
};

export default CustomerProfilePage;