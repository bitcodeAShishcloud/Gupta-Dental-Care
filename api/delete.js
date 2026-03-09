const fs = require('fs').promises;
const path = require('path');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // NOTE: On Vercel, filesystem is read-only
    res.status(501).json({ 
      error: 'Delete not available on Vercel free tier',
      message: 'Please manage images locally and commit to GitHub',
      solution: 'See VERCEL-DEPLOYMENT.md for instructions'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
};
