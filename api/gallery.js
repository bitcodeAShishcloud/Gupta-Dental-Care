const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read gallery-images.json from the project root
    const jsonPath = path.join(process.cwd(), 'gallery-images.json');
    const data = await fs.readFile(jsonPath, 'utf8');
    const images = JSON.parse(data);

    res.status(200).json(images);
  } catch (error) {
    console.error('Error reading gallery:', error);
    res.status(500).json({ error: error.message, images: [] });
  }
};
