require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, '..', 'client', 'public', 'uploads', 'logos');
const skillLogosDir = path.join(__dirname, '..', 'client', 'public', 'uploads', 'skill-logos');
const certImagesDir = path.join(__dirname, '..', 'client', 'public', 'uploads', 'cert-images');
const blogImagesDir = path.join(__dirname, '..', 'client', 'public', 'uploads', 'blog-images');
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
const upload = multer({ storage: memoryStorage, limits: { fileSize: 25 * 1024 * 1024 } });
const skillLogoUpload = multer({ storage: memoryStorage, limits: { fileSize: 25 * 1024 * 1024 } });
const certImageUpload = multer({ storage: memoryStorage, limits: { fileSize: 25 * 1024 * 1024 } });
const blogImageUpload = multer({ storage: memoryStorage, limits: { fileSize: 25 * 1024 * 1024 } });

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve uploaded files (Optional now since vite serves them, but keeping for direct api tests)
app.use('/uploads', express.static(path.join(__dirname, '..', 'client', 'public', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// ─── Cloudinary Storage Helper ───
const cloudinary = require('cloudinary').v2;
cloudinary.config(true); // Automatically loads CLOUDINARY_URL from .env

async function uploadToCloudinary(buffer, folder) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `portfolio/${folder}`,
                resource_type: 'image',
                timeout: 120000 // Increased timeout to 120 seconds
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
}

// File upload endpoint (general logos)
app.post('/api/upload', authMiddleware, upload.single('logo'), async (req, res) => {
  if (!req.file) {
      console.error('Upload failed: No file received');
      return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
      const buffer = await sharp(req.file.buffer)
          .resize(500, 500, { fit: 'inside', withoutEnlargement: true }) // Compressed
          .webp({ quality: 70 })
          .toBuffer();

      const fileUrl = await uploadToCloudinary(buffer, 'logos');
      
      console.log('File uploaded:', fileUrl);
      res.json({ url: fileUrl });
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
      const buffer = await sharp(req.file.buffer)
          .resize(300, 300, { fit: 'inside', withoutEnlargement: true }) // Compressed
          .webp({ quality: 70 })
          .toBuffer();

      const fileUrl = await uploadToCloudinary(buffer, 'skill-logos');
          
      console.log('Skill logo uploaded:', fileUrl);
      res.json({ url: fileUrl });
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
      const urls = [];
      // Use sequential upload instead of Promise.all to avoid Cloudinary timeouts on multiple large files
      for (const file of req.files) {
          const buffer = await sharp(file.buffer)
              .resize(800, 800, { fit: 'inside', withoutEnlargement: true }) // Compressed
              .webp({ quality: 70 })
              .toBuffer();
          const url = await uploadToCloudinary(buffer, 'cert-images');
          urls.push(url);
      }
      console.log('Cert images uploaded:', urls);
      res.json({ urls });
  } catch (err) {
      console.error('UPLOAD ERROR:', err);
      res.status(500).json({ error: 'Failed to process and save images', details: err.message });
  }
});

// Blog images upload endpoint (multiple files)
app.post('/api/upload-blog-images', authMiddleware, blogImageUpload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
  }
  try {
      const urls = [];
      for (const file of req.files) {
          const buffer = await sharp(file.buffer)
              .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true }) // Compressed
              .webp({ quality: 70 })
              .toBuffer();
          const url = await uploadToCloudinary(buffer, 'blog-images');
          urls.push(url);
      }
      console.log('Blog images uploaded:', urls);
      res.json({ urls });
  } catch (err) {
      console.error('UPLOAD ERROR:', err);
      res.status(500).json({ error: 'Failed to process and save images', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
