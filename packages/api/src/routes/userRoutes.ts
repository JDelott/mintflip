import express from 'express';
import { getUserProfile, createOrUpdateUserProfile, verifyWalletSignature } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// Authenticate wallet address
router.post('/auth', verifyWalletSignature);

// Get user profile
router.get('/profile/:walletAddress', getUserProfile);

// Create or update user profile (protected route)
router.post('/profile', authenticateJWT, createOrUpdateUserProfile);

export { router as userRoutes };
