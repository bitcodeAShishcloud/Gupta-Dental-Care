const formidable = require('formidable');
const fs = require('fs').promises;
const path = require('path');

// Helper function to update gallery JSON
async function updateGalleryJSON() {
  try {
    const galleryDir = path.join(process.cwd(), 'Gallery');
    const files = await fs.readdir(galleryDir);
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    imageFiles.sort();

    const imageData = imageFiles.map((file, index) => ({
      filename: file,
      path: `Gallery/${file}`,
      alt: `Clinic Photo ${index + 1}`
    }));

    await fs.writeFile(
      path.join(process.cwd(), 'gallery-images.json'),
      JSON.stringify(imageData, null, 2)
    );

    return imageData;
  } catch (error) {
    console.error('Error updating gallery JSON:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // NOTE: On Vercel, filesystem is read-only except /tmp
    // This will work locally but won't persist on Vercel
    // For production, use Vercel Blob Storage or Cloudinary
    
    res.status(501).json({ 
      error: 'Upload not available on Vercel free tier',
      message: 'Please upload images locally and commit to GitHub, or use Vercel Blob Storage',
      solution: 'See VERCEL-DEPLOYMENT.md for instructions'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
