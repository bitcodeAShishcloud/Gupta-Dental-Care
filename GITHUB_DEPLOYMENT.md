# 🚀 GitHub Pages Deployment Guide

## ⚠️ CRITICAL SECURITY NOTICE

**NEVER push `appwrite-config.js` to GitHub!** It contains sensitive credentials that would be exposed in your public repository.

---

## 🔐 Secure Deployment Strategy

### Option 1: Client-Side Only (Recommended for GitHub Pages)

Since GitHub Pages serves static files, you have two approaches:

#### **A. Use Appwrite's Public API (Secure)**

1. **Configure Appwrite for Public Access**:
   - In Appwrite Console → Storage → Your Bucket
   - Set **Read Access**: `Any` (public read)
   - Set **Write Access**: `Users` only
   - This allows gallery viewing without credentials

2. **Remove Admin from Public Site**:
   ```bash
   # Don't push admin.html to main branch
   echo "admin.html" >> .gitignore
   echo "appwrite-config.js" >> .gitignore
   ```

3. **Host Admin Locally**:
   - Keep `admin.html` and `appwrite-config.js` on your local machine only
   - Use admin dashboard locally to upload images
   - Gallery on GitHub Pages will fetch images via public Appwrite URLs

#### **B. Use GitHub Actions Secrets (Advanced)**

If you need admin on GitHub Pages:

1. **Add GitHub Secrets**:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add secrets:
     - `APPWRITE_PROJECT_ID` = `69ae326400147c096fe5`
     - `APPWRITE_ENDPOINT` = `https://fra.cloud.appwrite.io/v1`
     - `APPWRITE_BUCKET_ID` = `your_bucket_id`
     - `APPWRITE_ADMIN_PASSWORD` = `your_password`

2. **Create Build Script** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Create config file
           run: |
             cat > appwrite-config.js << EOF
             const APPWRITE_CONFIG = {
                 endpoint: '${{ secrets.APPWRITE_ENDPOINT }}',
                 projectId: '${{ secrets.APPWRITE_PROJECT_ID }}',
                 bucketId: '${{ secrets.APPWRITE_BUCKET_ID }}',
                 adminPassword: '${{ secrets.APPWRITE_ADMIN_PASSWORD }}'
             };
             // ... rest of config
             EOF
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./
   ```

---

## 📋 Step-by-Step: GitHub Pages Setup

### **Recommended Approach (Secure & Simple)**

1. **Prepare Repository**:
   ```bash
   # Make sure .gitignore is set up
   git add .gitignore
   git add appwrite-config.template.js
   git commit -m "Add security files"
   ```

2. **Remove Sensitive Files from Git**:
   ```bash
   # If you already committed appwrite-config.js, remove it:
   git rm --cached appwrite-config.js
   git commit -m "Remove sensitive config"
   ```

3. **Push to GitHub**:
   ```bash
   git push origin main
   ```

4. **Enable GitHub Pages**:
   - Go to: Repository → Settings → Pages
   - Source: `main` branch, `/ (root)` folder
   - Save
   - Your site will be at: `https://yourusername.github.io/repo-name/`

5. **Configure Appwrite for Public Read**:
   - Appwrite Console → Storage → Bucket
   - Permissions → Read Access: `Any`
   - Gallery will work without exposing credentials!

6. **Use Admin Locally**:
   - Keep `admin.html` and `appwrite-config.js` on your computer
   - Open `admin.html` locally in browser
   - Upload images → They appear on GitHub Pages automatically

---

## 🛡️ What Happens?

### **On GitHub Pages** (Public):
- ✅ `gallery.html` - Displays images from Appwrite
- ✅ `index.html` - Main website
- ✅ `appwrite-config.template.js` - Template only (safe)
- ❌ `admin.html` - NOT pushed (stays local)
- ❌ `appwrite-config.js` - NOT pushed (stays local)

### **On Your Computer** (Private):
- ✅ `admin.html` - Full admin dashboard
- ✅ `appwrite-config.js` - Real credentials
- ✅ Upload images securely
- ✅ Changes sync to Appwrite → Gallery updates

---

## 🔄 Workflow Example

```bash
# 1. Create/edit files locally
code gallery.html

# 2. Commit safe files only
git add gallery.html index.html styles.css
git commit -m "Update gallery"
git push origin main

# 3. Upload images via local admin.html
# Open file:///C:/Users/.../admin.html in browser
# Login and upload

# 4. Gallery on GitHub Pages updates automatically
# Because it fetches from Appwrite cloud storage
```

---

## ⚡ Quick Commands

### Setup Security:
```bash
# Create .gitignore
cat > .gitignore << EOF
appwrite-config.js
admin.html
.env
node_modules/
EOF

# Remove from git if already committed
git rm --cached appwrite-config.js admin.html
git commit -m "Secure sensitive files"
git push origin main
```

### Update Gallery (Public):
```bash
git add gallery.html styles.css
git commit -m "Update gallery design"
git push origin main
```

### Update Images (Private):
1. Open local `admin.html`
2. Upload images
3. Done! (No git push needed)

---

## 🎯 Best Practice Summary

| File | Push to GitHub? | Why? |
|------|----------------|------|
| `gallery.html` | ✅ YES | Public page, no secrets |
| `index.html` | ✅ YES | Public page |
| `styles.css` | ✅ YES | Safe |
| `appwrite-config.template.js` | ✅ YES | Template only |
| `appwrite-config.js` | ❌ NO | Contains credentials! |
| `admin.html` | ❌ NO | Admin access point |
| `.gitignore` | ✅ YES | Protects secrets |

---

## 🆘 Troubleshooting

### "Images not loading on GitHub Pages"
- ✅ Check Appwrite bucket permissions: Read = `Any`
- ✅ Verify bucket ID in your local `appwrite-config.js`
- ✅ Open browser console for errors

### "Admin not working locally"
- ✅ Make sure `appwrite-config.js` exists (not template)
- ✅ Fill in all credentials in `appwrite-config.js`
- ✅ Open `admin.html` as file:// or via local server

### "Accidentally pushed secrets"
1. Change passwords immediately in Appwrite
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch appwrite-config.js" \
     --prune-empty --tag-name-filter cat -- --all
   git push origin --force --all
   ```
3. Update credentials in Appwrite Console

---

## ✅ Ready to Deploy!

```bash
# Final checklist:
git status                    # Should NOT show appwrite-config.js
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# Then enable GitHub Pages in repo settings
```

Your gallery will be live at: `https://yourusername.github.io/Gupta-Dental-Care-main/gallery.html` 🎉
