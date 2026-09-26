import fs from 'fs';

export interface ValidationResult {
  valid: boolean;
  detectedType?: 'pdf' | 'docx' | 'txt';
  error?: string;
}

/**
 * Validates file buffer against magic bytes and signatures.
 * Rejects executables, scripts, and mismatched file types.
 */
export function validateFileMagicBytes(buffer: Buffer, originalFilename: string): ValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File buffer is empty.' };
  }

  const ext = originalFilename.split('.').pop()?.toLowerCase();

  // Check for executable signatures to reject immediately
  // Windows PE (.exe, .dll, .scr): MZ (0x4D 0x5A)
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return { valid: false, error: 'Executable files (.exe/.dll) are strictly forbidden.' };
  }
  // Linux ELF: 0x7F 'E' 'L' 'F' (0x7F 0x45 0x4C 0x46)
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x7f &&
    buffer[1] === 0x45 &&
    buffer[2] === 0x4c &&
    buffer[3] === 0x46
  ) {
    return { valid: false, error: 'Executable binaries (.elf) are strictly forbidden.' };
  }

  // 1. PDF Magic Bytes: %PDF (0x25 0x50 0x44 0x46)
  const isPdfMagic =
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46;

  if (ext === 'pdf') {
    if (isPdfMagic) {
      return { valid: true, detectedType: 'pdf' };
    }
    return { valid: false, error: 'File has .pdf extension but lacks valid PDF magic bytes (%PDF).' };
  }

  // 2. DOCX (Zip archive): PK.. (0x50 0x4B 0x03 0x04 or 0x50 0x4B 0x05 0x06 or 0x50 0x4B 0x07 0x08)
  const isZipMagic =
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);

  if (ext === 'docx') {
    if (isZipMagic) {
      return { valid: true, detectedType: 'docx' };
    }
    return { valid: false, error: 'File has .docx extension but lacks valid Office Open XML ZIP magic bytes.' };
  }

  // 3. Plain Text (.txt)
  if (ext === 'txt') {
    // Check if it looks like plain text (no excessive null bytes or control characters)
    let nullBytes = 0;
    const sampleSize = Math.min(buffer.length, 1024);
    for (let i = 0; i < sampleSize; i++) {
      if (buffer[i] === 0) nullBytes++;
    }
    if (nullBytes > 2) {
      return { valid: false, error: 'File has .txt extension but contains binary/null bytes.' };
    }
    return { valid: true, detectedType: 'txt' };
  }

  return {
    valid: false,
    error: `Unsupported file extension .${ext}. Only .pdf, .docx, and .txt files are accepted.`
  };
}

export function validateFileOnDisk(filePath: string, originalFilename: string): ValidationResult {
  try {
    const buffer = fs.readFileSync(filePath);
    return validateFileMagicBytes(buffer, originalFilename);
  } catch (err: unknown) {
    return { valid: false, error: `Failed to read file for validation: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}
