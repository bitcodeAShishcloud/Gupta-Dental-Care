const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'gallery-images.json');
    const data = await fs.readFile(jsonPath, 'utf8');
    const images = JSON.parse(data);
    
    res.status(200).json(images);
  } catch (error) {
    console.error('Error reading gallery:', error);
    res.status(500).json({ error: 'Failed to load gallery', message: error.message });
  }
};
