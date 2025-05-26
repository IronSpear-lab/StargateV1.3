import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs'; // Will be installed in a later step, but good to define schema with it

export interface IUser extends Document {
  email: string;
  password?: string; // Password might not always be selected
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Method to compare password (optional, can also be a static method or handled in controller)
  // comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Pre-save hook to hash password
// Note: bcryptjs will be installed in the next step (implementing /api/login)
// For now, this schema definition is fine. The actual hashing will fail if bcryptjs is not installed when saving a user.
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) { // Specify 'any' or a more specific error type if known
    next(error);
  }
});

// Optional: Method to compare password (if you want it on the model instance)
// UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
//   if (!this.password) return false;
//   return bcrypt.compare(candidatePassword, this.password);
// };

const User = model<IUser>('User', UserSchema);

export default User;
