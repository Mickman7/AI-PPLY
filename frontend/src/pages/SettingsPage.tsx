// SettingsPage.tsx - Updated to handle user profile properly
import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';
import type { EmploymentStatus } from '../models/User';
import { employmentStatusOptions } from '../models/User';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, userProfile, refreshUserProfile, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    employmentStatus: 'looking' as EmploymentStatus,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    if (user) {
      // Set email from authenticated user
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: user.displayName || prev.name,
      }));
    }

    if (userProfile) {
      // If profile exists in Firestore, populate the form
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || prev.name,
        username: userProfile.username || prev.username,
        email: userProfile.email || user?.email || prev.email,
        employmentStatus: userProfile.employmentStatus || 'looking',
      }));
    }
  }, [userProfile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'employmentStatus' ? value as EmploymentStatus : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!user) throw new Error('No user authenticated');

      console.log('Saving profile for user UID:', user.uid);

      // Prepare user data
      const userData = {
        uid: user.uid,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        employmentStatus: formData.employmentStatus,
        completedProfile: true,
        // Preserve existing profile picture if any
        profilePicture: userProfile?.profilePicture || '',
      };

      // Use setDoc with merge: true to create or update
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      console.log('Profile saved to Firestore');

      // Refresh user profile from context
      await refreshUserProfile();
      setMessage('Profile updated successfully!');

    } catch (error) {
      console.error('Error saving profile to Firestore:', error);
      setMessage('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">Loading user profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-8">Please log in to access settings</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Settings / Profile</h1>
      
      {/* Debug info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">User Info:</h3>
        <p>Firebase UID: {user.uid}</p>
        <p>Firebase Email: {user.email}</p>
        <p>Profile in Firestore: {userProfile ? 'Found' : 'Not Found'}</p>
        {userProfile && <p>Profile Completed: {userProfile.completedProfile ? 'Yes' : 'No'}</p>}
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Employment Status *
            </label>
            <select
              id="employmentStatus"
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {employmentStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : userProfile ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;