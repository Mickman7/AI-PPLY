import React from 'react';

const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings / Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <img
            src="/path/to/profile-image.jpg" // Replace with actual image path
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h2 className="text-lg font-medium">Alex Johnson</h2>
            <p className="text-gray-500">alex.johnson@ai-pply.com</p>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Profile
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Change
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
        <div className="flex justify-between items-center mb-2">
          <span>Email Notifications</span>
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Manage
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span>In-App Alerts</span>
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            Manage
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Data Management</h3>
        <div className="flex justify-between items-center mb-2">
          <span>Export All Data</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span>Delete Account</span>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;