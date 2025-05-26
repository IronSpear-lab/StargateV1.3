import { Router, Request, Response, NextFunction } from 'express';
// Ensure JwtPayload is exported from auth.middleware.ts or define a similar interface here
import { authMiddleware, JwtPayload } from '../middleware/auth.middleware'; 
import upload from '../config/multerConfig';
import File from '../models/File';

const router = Router();

// Keep any existing GET /api/files route if it was here, or add it if needed
// For now, focusing on the /upload route as per the subtask
router.get('/files', (req: Request, res: Response, next: NextFunction) => {
  // This is a placeholder from a previous step, it should be updated or removed if not part of this subtask's scope
  // For now, let's assume it might get a real implementation later or is handled elsewhere.
  // To keep it simple, we'll just return a mock response for now if it's still needed.
  console.log('[files]: Mock file list requested');
  const mockFiles = [
    { id: 'file-mock1', name: 'mock-document.pdf', type: 'application/pdf', size: 1024 * 1024 * 1 },
    { id: 'file-mock2', name: 'mock-image.png', type: 'image/png', size: 1024 * 800 * 1 },
  ];
  res.status(200).json(mockFiles);
});


// POST /api/upload
router.post('/upload', authMiddleware, upload.single('uploadedFile'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      const error: any = new Error('No file uploaded or upload error.');
      error.statusCode = 400;
      return next(error);
    }

    // req.userAuth is populated by authMiddleware
    const userAuth = req.userAuth as JwtPayload; // Explicitly type if JwtPayload is imported

    if (!userAuth || !userAuth.userId) {
      // This should ideally be caught by authMiddleware, but as a safeguard:
      const error: any = new Error('Authentication error: User ID not found.');
      error.statusCode = 401;
      return next(error);
    }

    const { filename, originalname, mimetype, size } = req.file;
    
    const newFile = new File({
      filename: filename,         // Name on disk
      originalName: originalname, // Original user-provided name
      mimeType: mimetype,
      size: size,
      owner: userAuth.userId
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded and metadata saved successfully.',
      file: {
        id: newFile._id,
        filename: newFile.filename,
        originalName: newFile.originalName,
        mimeType: newFile.mimeType,
        size: newFile.size,
        owner: newFile.owner,
        createdAt: newFile.createdAt,
        updatedAt: newFile.updatedAt // Added from schema
      }
    });

  } catch (err) {
    console.error('[POST /upload Route Error]', err);
    // Multer errors can also be caught here (e.g., if fileFilter or limits are used)
    // if (err instanceof multer.MulterError) { ... }
    next(err);
  }
});

export default router;
