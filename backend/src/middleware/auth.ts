import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../services/firebase';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        name?: string;
      };
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      throw new AppError('Invalid authentication token format', 401);
    }

    const decodedToken = await verifyFirebaseToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    logger.debug({ userId: req.user.uid }, 'User authenticated');
    next();
  } catch (error) {
    logger.warn({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Authentication failed');
    
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

// Optional authentication - doesn't fail if no token provided
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      
      if (idToken) {
        const decodedToken = await verifyFirebaseToken(idToken);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
        };
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't fail the request if token is invalid
    logger.debug('Optional authentication failed, continuing without user');
    next();
  }
};


