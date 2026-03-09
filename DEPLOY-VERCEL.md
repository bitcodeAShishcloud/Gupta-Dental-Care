# 🚀 Quick Deploy to Vercel

## One-Click Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bitcodeAShishcloud/test)

## Manual Deployment Steps

1. **Sign up at Vercel**: https://vercel.com/signup
2. **Import your repository**: `bitcodeAShishcloud/test`
3. **Click Deploy** - That's it! 🎉

Your site will be live at: `https://your-project.vercel.app`

## 📖 Full Documentation

- **Deployment Guide**: [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md)
- **Gallery Setup**: [SETUP.md](SETUP.md)
- **Local Development**: [README-GALLERY.md](README-GALLERY.md)

## ⚡ Quick Links

- **Main Website**: `index.html`
- **Gallery**: `gallery.html`
- **Admin Panel**: `admin.html` (for local development)

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local server
npm start

# Sync gallery manually
npm run sync
```

## 📸 Adding Gallery Photos

**On Vercel (Recommended)**:
1. Add images to `Gallery/` folder locally
2. Run `npm run sync`
3. Commit: `git add . && git commit -m "Add photos"`
4. Push: `git push`
5. Vercel auto-deploys! ✨

**See [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md) for detailed instructions**

---

Made with ❤️ for Gupta Dental Care
