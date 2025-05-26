import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  // const userId = (req as any).user?.id; // Uncomment when user is available on req

  console.error(
    `[Error] ${timestamp} | ${method} ${url} | Status: ${err.statusCode || 500} | Message: ${err.message}`,
    // `| UserID: ${userId || 'N/A'}`, // Uncomment when user is available
    `
Stack: ${err.stack}`
  );
  
  // Optional: Log request body that might have caused error
  // if (Object.keys(req.body).length > 0) {
  //    console.error('[Request Body at Error]', JSON.stringify(req.body, null, 2));
  // }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Keep this behavior
  });
};
