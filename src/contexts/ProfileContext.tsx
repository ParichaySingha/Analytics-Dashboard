import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatar?: string;
  role: string;
  lastLogin: string;
  createdAt: string;
}

interface ProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isLoading: boolean;
  saveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  id: 'user-1',
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  avatar: '',
  role: 'User',
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(parsedProfile);
        } else {
          // Set default profile if none exists
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfile(defaultProfile);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile && !isLoading) {
      try {
        localStorage.setItem('userProfile', JSON.stringify(profile));
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  }, [profile, isLoading]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const saveProfile = async (profileData: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        const updatedProfile = { ...profile, ...profileData };
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('userProfile');
  };

  const value: ProfileContextType = {
    profile,
    setProfile,
    updateProfile,
    isLoading,
    saveProfile,
    clearProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
