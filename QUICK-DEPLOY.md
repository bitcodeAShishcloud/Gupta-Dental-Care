# 🚀 Quick Deploy to Vercel

## **3-Step Deployment**

### Step 1️⃣: Install Dependencies
```powershell
npm install
```

### Step 2️⃣: Commit & Push to GitHub
```powershell
git add .
git commit -m "Add Vercel deployment config"
git push origin master
```

### Step 3️⃣: Deploy to Vercel
Go to: **https://vercel.com/new**

1. Click **"Import Git Repository"**
2. Select: **bitcodeAShishcloud/test**
3. Click **"Deploy"**
4. ✅ **Done!** Your site is live in 2 minutes

---

## **Your Live URLs**

After deployment, you'll get:
- 🌐 **Website**: `https://your-project.vercel.app`
- 📸 **Gallery**: `https://your-project.vercel.app/gallery.html`
- ⚙️ **Admin**: `https://your-project.vercel.app/admin-vercel.html`

---

## **To Add New Photos**

```powershell
# 1. Add photos to Gallery folder
# 2. Sync gallery
npm run sync

# 3. Push to GitHub
git add .
git commit -m "Add new photos"
git push

# 4. Vercel auto-deploys! ✅
```

---

## **Need Full Upload Feature?**

For live photo uploads, integrate with:
- **Cloudinary** (recommended, free): https://cloudinary.com
- **AWS S3**: https://aws.amazon.com/s3/
- **Supabase**: https://supabase.com

See [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md) for detailed instructions.

---

## **Files Created for Vercel**

✅ `vercel.json` - Configuration  
✅ `/api/gallery.js` - Get gallery images  
✅ `/api/upload.js` - Upload handler (needs cloud storage)  
✅ `/api/delete.js` - Delete handler (needs cloud storage)  
✅ `admin-vercel.html` - Admin panel for Vercel

---

**Ready? Let's deploy! 🚀**
