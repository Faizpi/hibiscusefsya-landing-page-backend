const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload single file
router.post('/single', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save to database
    const [result] = await pool.execute(`
      INSERT INTO media (filename, original_name, mime_type, size, path, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      `/uploads/${req.file.filename}`,
      req.user.id
    ]);

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: result.insertId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: `/uploads/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple files
router.post('/multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const [result] = await pool.execute(`
        INSERT INTO media (filename, original_name, mime_type, size, path, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        file.filename,
        file.originalname,
        file.mimetype,
        file.size,
        `/uploads/${file.filename}`,
        req.user.id
      ]);

      uploadedFiles.push({
        id: result.insertId,
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      });
    }

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all media
router.get('/', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const [rows] = await pool.execute(`
      SELECT m.*, u.username as uploaded_by_name
      FROM media m
      LEFT JOIN users u ON m.uploaded_by = u.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [total] = await pool.execute('SELECT COUNT(*) as count FROM media');

    res.json({
      media: rows,
      total: total[0].count
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete media
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM media WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = rows[0];
    const filePath = path.join(uploadsDir, file.filename);

    // Delete from filesystem
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.execute('DELETE FROM media WHERE id = ?', [req.params.id]);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

module.exports = router;
