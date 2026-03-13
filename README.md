# Gupta Dental Care - Professional Dentist Website

A modern, bilingual (English & Hindi) website for Gupta Dental Care, a dental clinic located at Gandhi Chauk, Kasia Bazaar, Kushinagar, UP.

Live site: [https://bitcodeAShishcloud.github.io/test/](https://bitcodeAShishcloud.github.io/test/)

## 🦷 Features

- **Bilingual Support** — Seamless toggle between English and Hindi
- **Responsive Design** — Mobile-first, works on all devices
- **Professional UI** — Medical-themed color scheme
- **Dynamic Offers** — Loaded automatically from Google Sheet (no code change needed)
- **Private Admin Form** — Submit new offers via `admin-offer.html` (kept private)
- **Floating Buttons** — Call & WhatsApp always visible
- **Smooth Scrolling** — Animated navigation
- **SEO Optimized** — Local keywords for Kushinagar
- **Google Maps** — Embedded clinic location

## 📄 Pages / Sections

1. **Home** — Hero with call-to-action buttons
2. **About Doctor** — Dr. A Gupta's qualifications and experience
3. **Services** — Comprehensive dental services
4. **Special Offers** — Auto-loaded from Google Sheet
5. **Gallery** — Clinic facility photos
6. **Testimonials** — Patient reviews
7. **Contact** — Location, phone, hours, Google Maps

## 🛠️ Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — Modern styling with animations
- **JavaScript (ES2017+)** — Async/await fetch, CSV parsing
- **Bootstrap 5.3** — Responsive grid and components
- **Font Awesome 6.4** — Icons
- **Google Fonts** — Poppins & Noto Sans Devanagari
- **Google Sheets** — Offer data source (published CSV)
- **Google Apps Script** — Offer submit endpoint
- **Google Drive** — (optional) Photo storage for gallery

## 📂 File Structure

```
├── index.html          # Main website
├── styles.css          # All custom styles
├── script.js           # JS — offer fetch, gallery, UI logic
├── gallery.html        # Full gallery page
├── admin-offer.html    # Private admin form (do NOT link publicly)
├── 1.1.1.1.jpg         # Clinic logo
├── Dr. A Gupta.jpeg    # Doctor photo
└── README.md           # This file
```

> `admin-offer.html` should be kept in a **private repo or local machine only**.  
> Never link it from `index.html`.

## 🏷️ Offers System — How It Works

```
Admin fills admin-offer.html form
        ↓
Apps Script (doPost) receives data
        ↓
Row appended to Google Sheet
        ↓
Website fetches published CSV on every page load
        ↓
Active, non-expired offers shown as cards
```

### Google Sheet Column Format

| Column | Description | Example |
|---|---|---|
| `active` | Show or hide | `TRUE` / `FALSE` |
| `title` | Offer name | `Teeth Cleaning Offer` |
| `description` | Short description | `Professional scaling` |
| `discount` | Percent number | `20` |
| `coupon` | Coupon code | `CLEAN20` |
| `startDate` | Start date | `2026-03-12` |
| `endDate` | End date | `2026-03-31` |
| `badge` | Badge label | `Hot Deal` |
| `icon` | Font Awesome class | `fas fa-tooth` |
| `terms` | Terms text | `Valid once per patient` |
| `featured` | Highlight card | `TRUE` / `FALSE` |

> Dates must be in `YYYY-MM-DD` format.

### To Add a New Offer

1. Open `admin-offer.html` in your browser (locally or private hosting).
2. Fill in the offer details and click **Submit Offer**.
3. Check your Google Sheet — a new row will appear.
4. Reload the main website — offer will show automatically.

### To Disable an Offer

- In Google Sheet, change `active` column value to `FALSE` for that row.
- Or set `endDate` to a past date.

## 🖼️ Gallery System (Google Drive + Sheet + Upload Page)

The project now supports a private upload page for gallery images:

- `admin-gallery.html` uploads a selected image to Google Drive via Apps Script.
- Apps Script stores metadata in a Sheet row.
- `gallery.html` loads images from the published gallery CSV.

### Gallery Sheet Columns

| Column | Description | Example |
|---|---|---|
| `active` | Show/hide image | `TRUE` |
| `title` | Image title | `Root Canal Case` |
| `caption` | Short caption | `Before and after treatment` |
| `imageUrl` | Public image URL | `https://drive.google.com/thumbnail?id=...&sz=w1200` |
| `order` | Sort order | `1` |

### Configure gallery.html

In `gallery.html`, set:

```js
const GALLERY_CSV_URL = "PASTE_YOUR_GALLERY_CSV_URL_HERE";
```

The published CSV must come from the gallery sheet tab.

### Apps Script: Add Upload Handler (Drive + Sheet)

Use this in your `Code.gs` (merge with your current offer logic):

```javascript
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN';
const GALLERY_SHEET_NAME = 'Gallery';

function doPost(e) {
        const p = e.parameter || {};

        if (p.action === 'uploadGalleryPhoto') {
                return uploadGalleryPhoto_(p);
        }

        // Existing offer handler here...
        return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unknown action' }))
                .setMimeType(ContentService.MimeType.JSON);
}

function uploadGalleryPhoto_(p) {
        try {
                if (p.token !== ADMIN_TOKEN) {
                        return json_({ ok: false, error: 'Unauthorized token' });
                }

                if (!p.fileBase64 || !p.fileName || !p.mimeType || !p.title) {
                        return json_({ ok: false, error: 'Missing required upload fields' });
                }

                const bytes = Utilities.base64Decode(p.fileBase64);
                const blob = Utilities.newBlob(bytes, p.mimeType, p.fileName);
                const file = DriveApp.createFile(blob);

                // Make public for website display.
                file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

                const imageUrl = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1200';

                const ss = SpreadsheetApp.getActiveSpreadsheet();
                const sheet = ss.getSheetByName(GALLERY_SHEET_NAME);
                if (!sheet) {
                        return json_({ ok: false, error: 'Gallery sheet not found' });
                }

                sheet.appendRow([
                        String(p.active || 'TRUE').toUpperCase() === 'TRUE' ? 'TRUE' : 'FALSE',
                        p.title,
                        p.caption || '',
                        imageUrl,
                        Number(p.order || 999)
                ]);

                return json_({ ok: true, imageUrl: imageUrl });
        } catch (err) {
                return json_({ ok: false, error: String(err) });
        }
}

function json_(obj) {
        return ContentService.createTextOutput(JSON.stringify(obj))
                .setMimeType(ContentService.MimeType.JSON);
}
```

### How to Use

1. Keep `admin-gallery.html` private.
2. Open it and fill Apps Script URL + token.
3. Select image and submit.
4. Check Drive and Gallery sheet row.
5. Reload `gallery.html` page to see new image.

## 📞 Contact Information

- **Clinic**: Gupta Dental Care
- **Doctor**: Dr. A Gupta (BDS, MDS)
- **Location**: Gandhi Chauk, Kasia Bazaar, Kushinagar, UP 274402
- **Phone**: +91 99848 47807
- **WhatsApp**: +91 99848 47807
- **Hours**: Mon–Sun 11:00 AM – 6:00 PM | Wednesday: Closed

## 🚀 Deployment

### GitHub Pages
1. Push all files to a GitHub repository
2. Go to `Settings → Pages`
3. Source: `main` branch, root `/`
4. Site live at `https://username.github.io/repo-name/`

### Traditional Hosting
1. Upload all files via FTP/cPanel
2. Ensure `index.html` is in root directory

## 🎨 Color Scheme

| Name | Hex |
|---|---|
| Primary Blue | `#0d6efd` |
| Secondary Blue | `#0056b3` |
| Accent Blue | `#00a8e8` |
| Light Background | `#f8f9fa` |
| Text Dark | `#333333` |

## 📱 Browser Compatibility

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile — iOS Safari, Chrome Mobile

## 🔧 Quick Customizations

| What | Where |
|---|---|
| Phone number | Search `9984847807` in `index.html` |
| Working hours | Contact section in `index.html` |
| Clinic address | Contact section + Maps embed URL |
| Offers data | Google Sheet (no code change needed) |
| Offer submit endpoint | `admin-offer.html` → form `action` URL |

## 📝 License

© 2026 Gupta Dental Care. All rights reserved.

---

**Last Updated**: March 2026
