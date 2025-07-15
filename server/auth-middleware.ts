import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth-service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    apiKey: string;
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
    const apiKey = authHeader && authHeader.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }

    // Verify API key
    const userData = await AuthService.verifyApiKey(apiKey);

    req.user = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      apiKey: userData.apiKey,
      userData
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: error.message || 'Invalid API key' });
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

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Kiểm tra quyền admin dựa trên email hoặc role
  const isAdmin = req.user?.email === 'admin@payoo.vn' || req.user?.userData?.isAdmin;
  
  if (!isAdmin) {
    return res.status(403).json({ 
      message: 'Admin access required' 
    });
  }
  next();
};