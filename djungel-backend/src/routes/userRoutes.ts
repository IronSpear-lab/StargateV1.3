import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware'; // Adjust path
import User from '../models/User'; // Adjust path

const router = Router();

// GET /api/user/me - Get current user's information
router.get('/user/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.userAuth should be populated by authMiddleware
    if (!req.userAuth || !req.userAuth.userId) {
      const error: any = new Error('Authentication error: User ID not found in token payload.');
      error.statusCode = 401; // Or 500 if this indicates a server/middleware issue
      return next(error);
    }

    const user = await User.findById(req.userAuth.userId).select('-password'); // Exclude password

    if (!user) {
      const error: any = new Error('User not found.');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      id: user.id, // or user._id
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      // Add any other fields you want to return, except sensitive ones
    });

  } catch (err) {
    console.error('[GET /user/me Route Error]', err);
    next(err);
  }
});

// Ensure this router is correctly mounted in index.ts under /api
// e.g., app.use('/api', userRoutes);

export default router;
