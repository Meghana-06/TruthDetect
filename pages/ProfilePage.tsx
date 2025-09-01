import React, { useState, useRef } from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.profileImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (name.trim() === '') {
      setNameError('Name cannot be empty.');
      return;
    }
    setNameError('');
    // In a real app, the image file would be uploaded to a server,
    // and the new URL would be saved. Here, we'll use the local preview URL.
    onUpdateProfile({ ...user, name: name.trim(), profileImageUrl: previewUrl });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setName(user.name);
    setNameError('');
    setProfileImageFile(null);
    setPreviewUrl(user.profileImageUrl);
    setIsEditing(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if(nameError) {
        setNameError('');
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="relative">
                {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover ring-4 ring-black/50 dark:ring-white/50" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black flex items-center justify-center font-bold text-5xl ring-4 ring-black/50 dark:ring-white/50">
                        {getInitials(user.name)}
                    </div>
                )}
                {isEditing && (
                    <>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </>
                )}
            </div>
            <div className="flex-grow text-center sm:text-left">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full text-3xl font-bold bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        />
                         {nameError && <p className="text-gray-600 dark:text-gray-400 font-bold text-sm mt-1">{nameError}</p>}
                    </>
                ) : (
                    <h2 className="text-3xl font-bold text-black dark:text-white">{user.name}</h2>
                )}
                <p className="text-gray-700 dark:text-gray-400 mt-1">{user.email}</p>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
             {isEditing ? (
                <div className="flex space-x-4">
                    <button onClick={handleSave} className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                        Save
                    </button>
                    <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                        Cancel
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                    Edit Profile
                </button>
            )}
            <button onClick={onLogout} className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;