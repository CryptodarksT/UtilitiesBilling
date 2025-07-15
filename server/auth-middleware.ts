import { Request, Response, NextFunction } from 'express';
import { auth } from './firebase-config';
import { db } from './db';
import { userAccounts } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name: string;
    userData: any;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get user data from database
    const [userData] = await db
      .select()
      .from(userAccounts)
      .where(eq(userAccounts.firebaseUid, decodedToken.uid));

    if (!userData) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!userData.isActive) {
      return res.status(401).json({ message: 'Account is disabled' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || userData.email,
      name: decodedToken.name || userData.name,
      userData
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.userData?.isVerified) {
    return res.status(403).json({ 
      message: 'Account verification required for this action' 
    });
  }
  next();
};