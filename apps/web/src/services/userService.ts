import { API_URL } from '../config';

export interface UserProfile {
  walletAddress: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  favoriteGenres: string[] | null;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  favoriteGenres?: string[];
}

export async function fetchUserProfile(walletAddress: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/users/profile/${walletAddress}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
}

export async function updateUserProfile(data: UpdateProfileData, token: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  
  return response.json();
}
