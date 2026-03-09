# Gallery Management System - Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies

First, install the required Node.js packages:

```powershell
npm install
```

This will install:
- `express` - Web server
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing

### 2. Start the Server

Run the server:

```powershell
npm start
```

Or for development with auto-restart:

```powershell
npm run dev
```

The server will start on http://localhost:3000

### 3. Access the Admin Panel

Open your browser and go to:
- **Admin Panel**: http://localhost:3000/admin.html
- **Gallery Page**: http://localhost:3000/gallery.html
- **Main Website**: http://localhost:3000/index.html

## 📸 How to Use

### Upload Photos via Admin Panel

1. Open http://localhost:3000/admin.html
2. Click the upload area or drag and drop images
3. Preview your selected images
4. Click "Upload to Gallery" button
5. Images will be automatically added to the Gallery folder and displayed on the gallery page

### Upload Photos Manually

If you add photos directly to the `Gallery` folder:

1. Copy your images to the `Gallery` folder
2. Run the sync script:
   ```powershell
   npm run sync
   ```
   Or:
   ```powershell
   node sync-gallery.js
   ```

This will automatically update `gallery-images.json` with all images in the Gallery folder.

### Delete Photos

From the Admin Panel:
- Click the × button on any image in the "Current Gallery Images" section
- Confirm the deletion
- The image will be removed from both the folder and the gallery

## 📁 File Structure

```
Gupta-Dental-Care-main/
├── Gallery/                 # All gallery images stored here
│   ├── 1_A.jpeg
│   ├── 2_A.jpeg
│   └── ...
├── admin.html               # Admin panel for uploading photos
├── gallery.html             # Public gallery page (auto-loads from JSON)
├── gallery-images.json      # JSON file with all image data
├── server.js                # Express server for uploads
├── sync-gallery.js          # Script to sync Gallery folder with JSON
├── package.json             # Node.js dependencies
└── SETUP.md                 # This file
```

## 🔧 How It Works

1. **Dynamic Loading**: The gallery.html page loads images dynamically from `gallery-images.json`
2. **Auto-Sync**: When you upload via admin panel, the server automatically updates `gallery-images.json`
3. **Manual Sync**: When you add images manually to the Gallery folder, run `npm run sync`

## 🎨 Features

✅ Drag and drop upload
✅ Multiple file upload
✅ Image preview before upload
✅ Delete images from admin panel
✅ Auto-sync gallery JSON
✅ Responsive design
✅ File size limit (10MB per image)
✅ Image format validation (JPG, PNG, GIF, WebP)

## 🛠️ Troubleshooting

**Server won't start:**
- Make sure you ran `npm install`
- Check if port 3000 is already in use

**Images not showing:**
- Make sure the server is running
- Check browser console for errors
- Run `npm run sync` to update gallery-images.json

**Upload fails:**
- Check file size (max 10MB)
- Ensure only image files (JPG, PNG, GIF, WebP)
- Check Gallery folder permissions

## 📝 Notes

- Keep the server running while uploading/managing photos
- The server auto-syncs the gallery on startup
- All uploaded files are stored in the `Gallery` folder
- The `gallery-images.json` file is auto-generated - don't edit manually

## 🔒 Security Note

This is a basic setup for local/development use. For production:
- Add authentication to admin.html
- Add rate limiting
- Validate and sanitize all inputs
- Use HTTPS
- Implement proper error handling
- Add database instead of JSON file
