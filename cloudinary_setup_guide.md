# Cloudinary Setup Guide for Gupta Dental Care

This guide will help you set up your free Cloudinary account and configure it to work with your new Admin Panel.

## 1. Create a Cloudinary Account
1.  Go to [Cloudinary.com](https://cloudinary.com/) and click **Sign Up for Free**.
2.  Follow the registration process. You can use the free tier which is more than enough for clinic photos.
3.  Once logged in, you will see your **Cloud Name** on the main Dashboard. You already added `dszhsqp3p` - make sure this matches exactly.

---

## 2. Create an "Unsigned" Upload Preset
For the Admin Panel to upload images directly from the browser, you need an "Unsigned" preset.
1.  In your Cloudinary Dashboard, click the **Settings** (gear icon) in the bottom left.
2.  Go to the **Upload** tab.
3.  Scroll down to **Upload presets** and click **Add upload preset**.
4.  **Important:** Change the **Signing Mode** from "Signed" to **Unsigned**.
5.  Copy the **Upload preset name** (e.g., `ml_default` or something random like `abc123yz`).
6.  Click **Save** at the top right.

---

## 3. Enable Resource Listing (Vital for Gallery)
By default, Cloudinary blocks websites from "listing" all images for security. You must enable this so your gallery can find your uploaded photos.
1.  In **Settings**, go to the **Security** tab.
2.  Look for the **Restricted media types** section.
3.  **Uncheck** the box that says **Resource list**.
4.  Keep other boxes checked for safety.
5.  Click **Save** at the bottom.

---

## 4. Configure your Admin Panel
1.  Open your website's **Admin Panel** (`admin.html`).
2.  In the **Cloudinary Setup** card on the left:
    *   **Cloud Name**: Enter `dszhsqp3p` (your cloud name).
    *   **Upload Preset**: Enter the name of the **Unsigned Preset** you created in Step 2.
    *   **Gallery Tag**: Keep it as `gupta_dental_gallery` (or change it if you wish, but keep it consistent).
3.  Click **Save Settings**.

---

## 5. Uploading Images
1.  Drag and drop your images into the **Upload New Images** zone.
2.  Click **Start Uploading**.
3.  Once finished, the images will appear in the **Manage Online Gallery** section and automatically show up in your `gallery.html` page.

---

## 6. Enabling Photo Deletion (Optional)
To delete photos directly from your Admin Panel, you need to provide your API Key and API Secret. This allows the panel to send a secure "signature" to Cloudinary.

1.  **Find your Credentials**: Go to your **Main Dashboard** in Cloudinary.
2.  Copy your **API Key** and **API Secret** (Note: Secret is hidden by default, click the "eye" icon to see it).
3.  **Configure Admin Panel**:
    *   Paste the **API Key** into the admin dashboard field.
    *   Paste the **API Secret** into the admin dashboard secret field.
    *   Click **Save Settings**.
4.  **How to Delete**: 
    *   Go to the **"Manage Online Gallery"** section at the bottom of the Admin Panel.
    *   Find the image you want to remove.
    *   Click the **Red Trash Icon** next to the image.
    *   Confirm the pop-up to permanently delete the photo.

> [!CAUTION]
> **Security Warning:** The API Secret is like a password to your media library. Never share the link to your admin panel with the secret filled in. The Admin Panel clears the secret fields from view once you refresh, but keeps them in your browser's private storage (localStorage) for convenience.

> [!TIP]
> **Why Unsigned for Upload but Signed for Delete?**
> Cloudinary allows "Unsigned" uploads for convenience, but for security, they **require** a signature to delete anything. This ensures that random strangers cannot delete your website's photos.
