import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';

// Add a custom type definition for jwt.sign that accommodates our usage
declare module 'jsonwebtoken' {
  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string | Buffer,
    options?: any
  ): string;
}

interface UserProfile {
  walletAddress: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  favoriteGenres?: string[];
}

interface AuthRequest extends Request {
  user?: {
    walletAddress: string;
  };
}

// Verify wallet signature
export const verifyWalletSignature = async (req: Request, res: Response) => {
  const { walletAddress, signature, message } = req.body;
  
  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ message: 'Wallet address, signature, and message are required' });
  }
  
  // In a real implementation, you'd verify the signature cryptographically
  // For this implementation, we'll assume the signature is valid
  
  try {
    // Check if user exists, if not create a new user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (userResult.rowCount === 0) {
      await pool.query(
        'INSERT INTO users (wallet_address) VALUES ($1)',
        [walletAddress]
      );
    }
    
    // Generate JWT token
    const secretString = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { walletAddress },
      secretString,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    );
    
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ message: 'Server error authenticating user' });
  }
};

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  
  if (!walletAddress) {
    return res.status(400).json({ message: 'Wallet address is required' });
  }
  
  try {
    const result = await pool.query(
      'SELECT wallet_address, username, bio, avatar_url, favorite_genres FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = result.rows[0];
    
    return res.status(200).json({
      walletAddress: user.wallet_address,
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      favoriteGenres: user.favorite_genres
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ message: 'Server error getting user profile' });
  }
};

// Create or update user profile
export const createOrUpdateUserProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user.walletAddress) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const { username, bio, avatarUrl, favoriteGenres } = req.body as UserProfile;
  const walletAddress = req.user.walletAddress;
  
  try {
    const result = await pool.query(
      `
      UPDATE users
      SET 
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url),
        favorite_genres = COALESCE($4, favorite_genres),
        updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = $5
      RETURNING wallet_address, username, bio, avatar_url, favorite_genres
      `,
      [username, bio, avatarUrl, favoriteGenres, walletAddress]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = result.rows[0];
    
    return res.status(200).json({
      walletAddress: updatedUser.wallet_address,
      username: updatedUser.username,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatar_url,
      favoriteGenres: updatedUser.favorite_genres
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Server error updating user profile' });
  }
};
