const multiparty = require('multiparty');
const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const uploadedFiles = [];
      const photosArray = files.photos || [];

      for (const file of photosArray) {
        const originalName = file.originalFilename;
        const ext = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, ext);
        const timestamp = Date.now();
        const newFilename = `${nameWithoutExt}_${timestamp}${ext}`;

        // Read the uploaded file
        const fileBuffer = await fs.readFile(file.path);
        
        // In Vercel, we'll save to /tmp directory (temporary)
        // For persistent storage, you'd need to use a service like AWS S3, Cloudinary, etc.
        const savePath = path.join('/tmp', newFilename);
        await fs.writeFile(savePath, fileBuffer);

        uploadedFiles.push({
          filename: newFilename,
          path: `Gallery/${newFilename}`,
          originalPath: file.path
        });

        // Clean up temp file
        await fs.unlink(file.path).catch(() => {});
      }

      // Note: In production, you should save files to a cloud storage service
      // and update the gallery-images.json accordingly in a database or GitHub
      
      res.status(200).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
        note: 'For production, files should be saved to cloud storage (S3, Cloudinary, etc.)'
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
