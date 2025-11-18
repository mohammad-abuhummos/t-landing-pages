# Environment Variables Setup

This document explains the environment variables needed for the Landing Page application.

## Required Environment Variables

### MongoDB
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Admin Dashboard
```bash
ADMIN_PASSWORD=lead!123
NEXT_PUBLIC_ADMIN_PASSWORD=lead!123
```

### PHP Uploader Service
The app uses an external PHP microservice for image uploads. Configure it with:

```bash
# Point to your PHP uploader Railway service
UPLOADER_URL=https://your-php-uploader.up.railway.app
NEXT_PUBLIC_UPLOADER_URL=https://your-php-uploader.up.railway.app

# Optional: default subdirectory for uploads (default: "images")
UPLOADER_DIR=heroes
```

### Railway Volume (for this Next.js app)
```bash
DATA_DIR=/data
```

### Optional: Analytics
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SMARTLOOK_KEY=your-smartlook-key
```

---

## PHP Uploader Railway Setup

Your PHP uploader is a **separate Railway service**. It needs these configurations:

### 1. Create a Volume
1. In Railway, go to your PHP uploader service
2. Create a new Volume named `data`
3. Mount it at `/data`

### 2. Set Environment Variables on PHP Uploader Service
```bash
# Storage location (must match volume mount)
STORAGE_DIR=/data

# Allow your Next.js app to upload
CORS_ALLOW_ORIGIN=https://your-nextjs-app.railway.app

# Optional: file size limit in MB
MAX_FILE_SIZE_MB=10

# Optional: public base URL (Railway auto-detects this, but you can override)
BASE_URL=https://your-php-uploader.up.railway.app
```

### 3. Verify the Volume is Mounted
- The volume **must** be mounted at `/data`
- The `STORAGE_DIR` env var **must** match the mount path
- Check Railway's service settings → Variables → Volume

---

## Troubleshooting Image Upload Issues

If images upload successfully but don't display:

### Check 1: Verify PHP Uploader Health
Visit your PHP uploader in a browser:
```
https://your-php-uploader.up.railway.app/
```
You should see an upload form.

### Check 2: Test File Access
After uploading an image, try accessing it directly:
```
https://your-php-uploader.up.railway.app/files/test_bath-20251015132132-74f9fc87.jpg
```

If you get a 404, the issue is with the PHP service storage configuration.

### Check 3: Verify Volume Mount
SSH into your Railway PHP service (if possible) or check logs:
- The `/data` directory should exist
- Uploaded files should be in `/data/` or `/data/heroes/` (depending on the `dir` parameter)

### Check 4: Common Issues

#### Issue: Images upload but return 404
**Cause**: Volume not mounted or `STORAGE_DIR` mismatch
**Solution**: 
1. Ensure Volume is mounted at `/data` in Railway
2. Set `STORAGE_DIR=/data` environment variable
3. Restart the PHP uploader service

#### Issue: CORS errors when uploading
**Cause**: `CORS_ALLOW_ORIGIN` not set correctly
**Solution**: Set `CORS_ALLOW_ORIGIN` to your Next.js app's URL

#### Issue: "Uploader not configured" error
**Cause**: `UPLOADER_URL` not set in Next.js app
**Solution**: Add `UPLOADER_URL` environment variable to your Next.js Railway service

---

## Testing the Integration

### From your Next.js Dashboard
1. Go to `/dashboard`
2. Login with your admin password
3. Upload an image in the "Images" section
4. The image should appear in the grid with a clickable URL
5. Click "Copy URL" to get the full URL
6. Test the URL in a new browser tab

### Using cURL (direct to PHP uploader)
```bash
curl -F "file=@/path/to/image.jpg" -F "dir=heroes" \
  https://your-php-uploader.up.railway.app/
```

Expected response:
```json
{
  "url": "https://your-php-uploader.up.railway.app/files/heroes/image-20251015123456-abc123.jpg",
  "path": "heroes/image-20251015123456-abc123.jpg",
  "filename": "image-20251015123456-abc123.jpg",
  "bytes": 12345,
  "mime": "image/jpeg"
}
```

Then verify the URL works:
```bash
curl -I https://your-php-uploader.up.railway.app/files/heroes/image-20251015123456-abc123.jpg
```

Should return `HTTP 200 OK` with `Content-Type: image/jpeg`

