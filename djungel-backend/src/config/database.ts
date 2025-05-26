import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('[DB]: DATABASE_URL is not defined in .env file.');
      process.exit(1); // Exit process with failure
    }

    await mongoose.connect(dbUrl);

    console.log('[DB]: MongoDB Connected successfully.');

    mongoose.connection.on('error', (err) => {
      console.error('[DB]: MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[DB]: MongoDB disconnected.');
    });

  } catch (error: any) {
    console.error('[DB]: MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
