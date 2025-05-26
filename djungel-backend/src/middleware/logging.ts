import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[request] ${timestamp} ${req.method} ${req.originalUrl}`);
  // For now, we will not log the request body.
  // In a real application, be mindful of sensitive data if logging req.body.
  // Example: console.log("[request body]", req.body);
  next();
};
