const fs = require('fs').promises;
const path = require('path');

/**
 * Auto-sync Gallery folder with gallery-images.json
 * Run this script anytime you manually add/remove images from Gallery folder
 */

async function syncGallery() {
    try {
        console.log('🔄 Starting gallery sync...\n');

        const galleryDir = path.join(__dirname, 'Gallery');
        const jsonFile = path.join(__dirname, 'gallery-images.json');

        // Check if Gallery folder exists
        try {
            await fs.access(galleryDir);
        } catch {
            console.error('❌ Gallery folder not found!');
            return;
        }

        // Read all files from Gallery directory
        const files = await fs.readdir(galleryDir);
        
        // Filter only image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        if (imageFiles.length === 0) {
            console.log('⚠️  No image files found in Gallery folder');
            return;
        }

        // Sort files alphabetically
        imageFiles.sort((a, b) => {
            // Extract numbers from filenames for proper numeric sorting
            const numA = parseInt(a.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.match(/\d+/)?.[0] || '0');
            return numA - numB;
        });

        // Create JSON array
        const imageData = imageFiles.map((file, index) => ({
            filename: file,
            path: `Gallery/${file}`,
            alt: `Clinic Photo ${index + 1}`
        }));

        // Write to gallery-images.json
        await fs.writeFile(
            jsonFile,
            JSON.stringify(imageData, null, 2)
        );

        console.log('✅ Gallery sync completed successfully!\n');
        console.log(`📊 Total images: ${imageFiles.length}`);
        console.log('\n📝 Images in gallery:');
        imageFiles.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file}`);
        });

        console.log('\n📄 gallery-images.json has been updated!');
        
    } catch (error) {
        console.error('❌ Error syncing gallery:', error);
        process.exit(1);
    }
}

// Run the sync
syncGallery();
