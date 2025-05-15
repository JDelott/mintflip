import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { API_URL } from '../config';

export function useUserAuth() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [token, setToken] = useState<string | null>(localStorage.getItem('mintflip_token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setToken(null);
      localStorage.removeItem('mintflip_token');
    }
  }, [address]);

  const signIn = async () => {
    if (!address) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create message to sign
      const message = `Login to MintFlip with wallet: ${address}`;
      
      // Sign the message with user's wallet
      const signature = await signMessageAsync({ message });
      
      // Send to API for verification
      const response = await fetch(`${API_URL}/api/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, signature, message })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Save token
      localStorage.setItem('mintflip_token', data.token);
      setToken(data.token);
      return data.token;
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = () => {
    localStorage.removeItem('mintflip_token');
    setToken(null);
  };
  
  return {
    token,
    isAuthenticated: !!token,
    signIn,
    signOut,
    isLoading,
    error
  };
}
