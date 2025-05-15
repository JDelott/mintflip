import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  user?: {
    walletAddress: string;
  };
}

interface JwtPayload {
  walletAddress: string;
  [key: string]: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const secretString = process.env.JWT_SECRET || 'fallback_secret';
    // Ensure token is always a string
    if (typeof token !== 'string') {
      return res.status(403).json({ message: 'Invalid token format' });
    }
    
    // Use the non-null assertion to tell TypeScript token is definitely a string
    const decoded = jwt.verify(token!, secretString) as unknown as JwtPayload;
    req.user = { walletAddress: decoded.walletAddress };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
