import React, { useState, useEffect } from 'react';
import { useSupabaseUser } from '../hooks/useSupabaseUser';
import { UserService } from '../services/user_service';
import { UserModel } from '../models/user_model';

interface UserProfileProps {
  initialProfile?: {
    full_name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  onSave?: (profile: {
    full_name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ initialProfile, /*onSave*/ }) => {
  const { user, loading } = useSupabaseUser();
  const [full_name, setFullName] = useState(initialProfile?.full_name || '');
  const [age, setAge] = useState(initialProfile?.age || '');
  const [gender, setGender] = useState(initialProfile?.gender || 'None');
  const [height, setHeight] = useState(initialProfile?.height || '');
  const [weight, setWeight] = useState(initialProfile?.weight || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isEmptyProfile, setIsEmptyProfile] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await UserService.getUserProfile();
        console.log('Fetched user profile:', profile);

        setFullName(profile.full_name || '');
        setAge(profile.age?.toString() || '');
        setGender(profile.gender || 'None');
        setHeight(profile.height?.toString() || '');
        setWeight(profile.weight?.toString() || '');

        const empty =
          (profile.full_name === null || profile.full_name === undefined) &&
          (profile.age === null || profile.age === undefined) &&
          (profile.gender === null || profile.gender === undefined) &&
          (profile.height === null || profile.height === undefined) &&
          (profile.weight === null || profile.weight === undefined);

        setIsEmptyProfile(empty);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);


  const buildUserModel = (): UserModel => ({
    full_name: full_name ? full_name : null,
    age: age ? parseInt(age) : null,
    gender: gender ? gender : null,
    height: height ? parseFloat(height) : null,
    weight: weight ? parseFloat(weight) : null,
  });

  const handleEdit = async () => {
    const userModel = buildUserModel();
    try {
      if (isEmptyProfile) {
        const response = await UserService.saveUserData(userModel);
        if(response.message === 'success'){
          setIsEmptyProfile(false);
        }
        alert(`Profile created: ${response.message || ''}`);
        setIsEditing(false);
        return;
      }
      const response = await UserService.updateProfile(userModel);
      alert(`Profile saved successfully: ${response.message || ''}`);
      setIsEditing(false);
    } catch (error) {
      const err = error as Error;
      alert(`Error saving profile: ${err.message}`);
    }
  }
  /*
  const handleSave = () => {
    if (onSave) {
      onSave({ full_name, age, gender, height, weight });
    }
    setIsEditing(false);
    alert('Profile saved!');
  };
  */

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">👤</span>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">User Profile</h1>
      </div>
      {/* Display name and email */}
      <div className="mb-6">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading user info...</div>
        ) : user ? (
          <div>
            <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{user.displayName}</div>
            <div className="text-gray-600 dark:text-gray-300">{user.email}</div>
          </div>
        ) : (
          <div className="text-red-500">User not found</div>
        )}
      </div>
      <section className="space-y-4">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white">
                {full_name || '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white">
                {age || '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white capitalize">
                {gender !== 'None' ? gender : '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white">
                {height || '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
              <div className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white">
                {weight || '-'}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
              <select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              >
                <option value="">Select age</option>
                {[...Array(100)].map((_, i) => (
                  <option key={i} value={(i + 1).toString()}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              >
                <option value="None">Not selected</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 170"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 65"
                className="w-full p-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#A8D1E7] focus:border-transparent"
              />
            </div>
          </div>
        )}
      </section>
      <div className="flex justify-end pt-4">
        {!isEditing ? (
          isEmptyProfile ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#A8D1E7] hover:bg-[#96C4DD] text-gray-900 font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out"
            >
              Create Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#A8D1E7] hover:bg-[#96C4DD] text-gray-900 font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out"
            >
              Edit Profile
            </button>
          )
        ) : (
          <button
            onClick={handleEdit}
            className="bg-[#A8D1E7] hover:bg-[#96C4DD] text-gray-900 font-semibold py-3 px-8 rounded-xl transition duration-200 ease-in-out"
          >
            Save Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
