require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads', 'logos');
const skillLogosDir = path.join(__dirname, 'uploads', 'skill-logos');
const certImagesDir = path.join(__dirname, 'uploads', 'cert-images');
const blogImagesDir = path.join(__dirname, 'uploads', 'blog-images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(skillLogosDir)) {
  fs.mkdirSync(skillLogosDir, { recursive: true });
}
if (!fs.existsSync(certImagesDir)) {
  fs.mkdirSync(certImagesDir, { recursive: true });
}
if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
}

// Multer config for all uploads using Memory Storage for processing
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const skillLogoUpload = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const certImageUpload = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const blogImageUpload = multer({ storage: memoryStorage, limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// File upload endpoint (general logos)
app.post('/api/upload', authMiddleware, upload.single('logo'), async (req, res) => {
  if (!req.file) {
      console.error('Upload failed: No file received');
      return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
      const filename = `logo-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
      const filepath = path.join(uploadsDir, filename);
      await sharp(req.file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);
          
      const fileUrl = `/uploads/logos/${filename}`;
      console.log('File uploaded:', fileUrl);
      res.json({ url: `http://localhost:${PORT}${fileUrl}` });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process and save image' });
  }
});

// Skill logo upload endpoint
app.post('/api/upload-skill-logo', authMiddleware, skillLogoUpload.single('logo'), async (req, res) => {
  if (!req.file) {
      console.error('Skill logo upload failed: No file received');
      return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
      const filename = `skill-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
      const filepath = path.join(skillLogosDir, filename);
      await sharp(req.file.buffer)
          .resize(500, 500, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(filepath);
          
      const fileUrl = `/uploads/skill-logos/${filename}`;
      console.log('Skill logo uploaded:', fileUrl);
      res.json({ url: `http://localhost:${PORT}${fileUrl}` });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process and save image' });
  }
});

// Certification images upload endpoint (multiple files)
app.post('/api/upload-cert-images', authMiddleware, certImageUpload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
  }
  try {
      const urls = await Promise.all(req.files.map(async (file) => {
          const filename = `cert-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
          const filepath = path.join(certImagesDir, filename);
          await sharp(file.buffer)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(filepath);
          return `http://localhost:${PORT}/uploads/cert-images/${filename}`;
      }));
      console.log('Cert images uploaded:', urls);
      res.json({ urls });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process and save images' });
  }
});

// Blog images upload endpoint (multiple files)
app.post('/api/upload-blog-images', authMiddleware, blogImageUpload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
  }
  try {
      const urls = await Promise.all(req.files.map(async (file) => {
          const filename = `blog-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
          const filepath = path.join(blogImagesDir, filename);
          await sharp(file.buffer)
              .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(filepath);
          return `http://localhost:${PORT}/uploads/blog-images/${filename}`;
      }));
      console.log('Blog images uploaded:', urls);
      res.json({ urls });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process and save images' });
  }
});

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
