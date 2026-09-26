import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { validateFileMagicBytes } from '../utils/magicBytes';

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Memory storage first so we can validate magic bytes before committing to disk
const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
  'application/octet-stream' // checked via magic bytes
];

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`Invalid file type '${ext}'. Allowed types: .pdf, .docx, .txt`));
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype) && file.mimetype !== '') {
      return cb(new Error(`Invalid MIME type '${file.mimetype}'.`));
    }
    cb(null, true);
  }
});

export const handleSingleUpload = upload.single('document');

/**
 * Middleware that validates file buffer magic bytes, then persists to disk.
 */
export function validateAndSaveUploadedFile(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ error: 'No document file provided in request.' });
  }

  const { buffer, originalname, mimetype, size } = req.file;

  // Magic bytes check
  const magicValidation = validateFileMagicBytes(buffer, originalname);
  if (!magicValidation.valid) {
    return res.status(400).json({ error: magicValidation.error });
  }

  // Generate unique filename and write to disk
  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = path.extname(originalname).toLowerCase();
  const safeFilename = `${uniquePrefix}${ext}`;
  const diskPath = path.join(UPLOAD_DIR, safeFilename);

  try {
    fs.writeFileSync(diskPath, buffer);
    // Attach saved path to req.file
    (req.file as Express.Multer.File & { path?: string }).path = diskPath;
    next();
  } catch (err: unknown) {
    return res.status(500).json({ error: `Failed to store uploaded file: ${err instanceof Error ? err.message : 'Unknown error'}` });
  }
}
