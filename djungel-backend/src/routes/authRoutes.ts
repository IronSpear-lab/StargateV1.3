import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust path as necessary

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error: any = new Error('Email and password are required.');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email }).select('+password'); // Explicitly select password
    if (!user) {
      const error: any = new Error('Invalid credentials. User not found.');
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    // Ensure user.password exists before comparing;
    // It should exist due to .select('+password') but good to double check
    if (!user.password) {
        const error: any = new Error('Authentication failed. Password not available for user.');
        error.statusCode = 500; // Internal server error or misconfiguration
        return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: any = new Error('Invalid credentials. Password mismatch.');
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('[AUTH]: JWT_SECRET is not defined in .env. Cannot sign token.');
      const error: any = new Error('Server configuration error: JWT secret missing.');
      error.statusCode = 500;
      return next(error);
    }

    const payload = {
      userId: user.id, // or user._id depending on Mongoose version & preference
      email: user.email,
      // Add other relevant info if needed, like roles
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' }); // Example: 1 day expiration

    res.status(200).json({
      message: 'Login successful',
      token: `Bearer ${token}`, // Convention to include Bearer prefix
      userId: user.id,
      email: user.email,
    });

  } catch (err) {
    console.error('[Login Route Error]', err); // Log the actual error on the server
    next(err); // Pass to global error handler
  }
});

// Ensure other routes, if any in this file, are preserved or correctly defined.
// For example, if you had a mock GET /api/user/me here, it will be updated/moved later.

export default router;
