import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of your JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  // iat and exp are automatically added by jsonwebtoken
  iat?: number; 
  exp?: number;
}

// Extend Express Request type to include userAuth
// This can also be in a separate .d.ts file (e.g., src/types/express.d.ts)
// Ensure tsconfig.json includes such .d.ts files if created separately.
declare global {
  namespace Express {
    interface Request {
      userAuth?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Prefer passing to error handler for consistent responses
    const error: any = new Error('Not authorized, no token or malformed token.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('[AUTH Middleware]: JWT_SECRET is not defined.');
      const error: any = new Error('Server configuration error: JWT secret missing for auth.');
      error.statusCode = 500;
      return next(error);
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // Attach user information to the request object
    // You might want to fetch the full user object from DB here if needed on all protected routes,
    // but for many cases, just the ID/email from token is enough.
    // For this middleware, just attaching decoded payload is fine.
    req.userAuth = decoded; 

    next();
  } catch (error: any) { // Catching 'any' for jwt errors which can be various types
    console.error('[AUTH Middleware Error]', error.message);
    const authError: any = new Error('Not authorized, token failed.');
    authError.statusCode = 401;
    // You could add more specific messages based on error.name (e.g., 'TokenExpiredError')
    // if (error.name === 'TokenExpiredError') { authError.message = 'Token expired.'; }
    return next(authError);
  }
};
