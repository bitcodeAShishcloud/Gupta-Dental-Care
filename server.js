const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Gallery/');
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const timestamp = Date.now();
        cb(null, `${nameWithoutExt}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Update gallery-images.json file
async function updateGalleryJSON() {
    try {
        const galleryDir = path.join(__dirname, 'Gallery');
        const files = await fs.readdir(galleryDir);
        
        // Filter only image files
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        });

        // Sort files by name
        imageFiles.sort();

        // Create JSON array
        const imageData = imageFiles.map((file, index) => ({
            filename: file,
            path: `Gallery/${file}`,
            alt: `Clinic Photo ${index + 1}`
        }));

        // Write to gallery-images.json
        await fs.writeFile(
            path.join(__dirname, 'gallery-images.json'),
            JSON.stringify(imageData, null, 2)
        );

        console.log('Gallery JSON updated successfully');
        return imageData;
    } catch (error) {
        console.error('Error updating gallery JSON:', error);
        throw error;
    }
}

// Upload endpoint
app.post('/upload', upload.array('photos', 20), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Update gallery-images.json
        await updateGalleryJSON();

        res.json({
            message: 'Files uploaded successfully',
            files: req.files.map(f => ({
                filename: f.filename,
                path: `Gallery/${f.filename}`
            }))
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete endpoint
app.delete('/delete/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, 'Gallery', filename);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete the file
        await fs.unlink(filePath);

        // Update gallery-images.json
        await updateGalleryJSON();

        res.json({ message: 'File deleted successfully', filename });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get gallery images
app.get('/api/gallery', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'gallery-images.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading gallery:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sync gallery (auto-update gallery-images.json)
app.post('/api/sync', async (req, res) => {
    try {
        const imageData = await updateGalleryJSON();
        res.json({ message: 'Gallery synced successfully', images: imageData });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   Gallery Upload Server Started!          ║
║                                            ║
║   Server running on: http://localhost:${PORT}  ║
║   Admin Panel: http://localhost:${PORT}/admin.html
║   Gallery Page: http://localhost:${PORT}/gallery.html
║                                            ║
║   Press Ctrl+C to stop the server         ║
╚════════════════════════════════════════════╝
    `);
    
    // Auto-sync on startup
    updateGalleryJSON().catch(console.error);
});
