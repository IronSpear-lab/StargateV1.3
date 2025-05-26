import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the storage directory
// This path needs to be relative to the project root *after* build (e.g., from dist/src/config)
// A common approach is to resolve it from the project's root directory.
// Assuming the process current working directory is the project root when the server starts.
// Or, for more robustness, use an environment variable or a more reliable way to get project root.
const projectRoot = path.resolve(__dirname, '../../..'); // Adjust if __dirname is not reliable (e.g. ESM)
const uploadDir = path.join(projectRoot, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`[Multer]: Created upload directory at ${uploadDir}`);
} else {
  console.log(`[Multer]: Upload directory at ${uploadDir} already exists.`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Optional: File filter to allow only certain file types
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     // cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.')); // This creates an operational error
//     cb(null, false); // Silently reject
//   }
// };

const upload = multer({
  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 5 }, // Optional: Limit file size (e.g., 5MB)
  // fileFilter: fileFilter // Optional: Apply file filter
});

export default upload;
