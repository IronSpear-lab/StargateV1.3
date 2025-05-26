import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  console.log(`[Request] ${timestamp} | ${method} ${url} | IP: ${ip} | User-Agent: ${userAgent}`);
  
  // Optional: Log request body (be careful with sensitive data)
  // if (Object.keys(req.body).length > 0) {
  //   console.log('[Request Body]', JSON.stringify(req.body, null, 2)); // Or a sanitized version
  // }

  next();
};
