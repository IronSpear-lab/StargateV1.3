import { Schema, model, Document, Types } from 'mongoose';

export interface IFile extends Document {
  filename: string;      // Name of the file stored on the server
  originalName: string;  // Original name of the file from the user
  size: number;          // file size in bytes
  mimetype: string;      // e.g. "image/png"
  path: string;          // relative or full path in /uploads
  uploadedBy?: Types.ObjectId; // Reference to the User who uploaded the file (optional)
  uploadDate: Date;      // Default: now
  tags: string[];        // Optional labels like ["projectA", "invoice"]
  isFavorite: boolean;   // Default: false
  lastAccessed?: Date;   // Optional
  customMetadata?: Schema.Types.Mixed; // Flexible structure for future metadata
  createdAt: Date;       // From timestamps
  updatedAt: Date;       // From timestamps
}

const FileSchema = new Schema<IFile>({
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimetype: { // Changed from mimeType for consistency with request
    type: String,
    required: true,
    trim: true,
  },
  path: { // New field
    type: String,
    required: true,
    trim: true,
  },
  uploadedBy: { // Changed from 'owner' and made optional
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: false, // Default is false, so explicitly not required
  },
  uploadDate: { // New field
    type: Date,
    default: Date.now,
  },
  tags: { // New field
    type: [String],
    default: [],
  },
  isFavorite: { // New field
    type: Boolean,
    default: false,
  },
  lastAccessed: { // New field
    type: Date,
    required: false, // Optional
  },
  customMetadata: { // New field
    type: Schema.Types.Mixed,
    required: false, // Optional
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const File = model<IFile>('File', FileSchema);

export default File;
