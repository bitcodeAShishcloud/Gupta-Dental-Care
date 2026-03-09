// ======== APPWRITE CONFIGURATION TEMPLATE ========
// 🔑 SECURITY WARNING: This is a TEMPLATE file for reference only
// 📋 INSTRUCTIONS: Copy this file to 'appwrite-config.js' and fill in your credentials
// ⚠️ NEVER commit 'appwrite-config.js' to GitHub (it's in .gitignore)

const APPWRITE_CONFIG = {
    endpoint: 'https://fra.cloud.appwrite.io/v1', // Your Appwrite region endpoint
    projectId: 'YOUR_PROJECT_ID_HERE',            // Get from Appwrite Console
    bucketId: 'YOUR_BUCKET_ID_HERE',              // Create in Storage section
    databaseId: '',                                // Optional: for metadata
    collectionId: '',                              // Optional: for metadata
    adminPassword: 'YOUR_SECURE_PASSWORD_HERE'     // Set a strong password!
};

// Initialize Appwrite SDK
const { Client, Storage, Databases } = Appwrite;

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId);

const storage = new Storage(client);
const databases = new Databases(client);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APPWRITE_CONFIG, client, storage, databases };
}
