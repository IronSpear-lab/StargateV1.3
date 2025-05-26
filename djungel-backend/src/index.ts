import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { requestLogger } from "./middleware/logRequest"; // Updated import path
import { errorHandler } from "./middleware/errorHandler"; // Import error handler
import authRoutes from "./routes/authRoutes"; // Import auth routes
import userRoutes from "./routes/userRoutes"; // Import user routes
import fileRoutes from "./routes/fileRoutes"; // Import file routes
import connectDB from "./config/database"; // Import database connection function

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use(requestLogger); // This will now use the enhanced logger from logRequest.ts

// Main routes
app.get("/", (req: Request, res: Response) => {
  res.send("Djungel Backend is running!");
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('[health]: Health check requested'); // Or use a more formal logger
    res.status(200).json({
      status: 'ok',
      message: 'Djungel backend is healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err); // Pass unexpected errors to the global error handler
  }
});

// Mount API routes
app.use('/api', authRoutes); // Mount auth routes
app.use('/api', userRoutes); // Mount user routes
app.use('/api', fileRoutes); // Mount file routes

// Test route for error handling
app.get("/error", (req: Request, res: Response, next: NextFunction) => {
  // Create a custom error
  const testError = new Error("This is a test error to check the error handler.");
  next(testError);
});

// Error handling middleware - should be the last middleware
app.use(errorHandler); // This will use the enhanced errorHandler.ts

// Start server function
const startServer = async () => {
  try {
    await connectDB(); // Connect to DB first
    app.listen(port, () => {
      console.log(`[Server]: Djungel backend is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("[Server]: Failed to start server", error);
    // Optionally, exit the process if the server cannot start due to DB connection failure handled in connectDB
    // process.exit(1); // connectDB already handles this, so might be redundant here
  }
};

startServer();
