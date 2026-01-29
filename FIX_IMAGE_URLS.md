# 🖼️ Fix: Images Not Showing After Deployment

## The Problem

Images work locally but don't show after deployment because:
1. Database has **local image paths** (like `/trucks/image.png`) instead of **Supabase Storage URLs**
2. Local paths work locally but fail in production
3. Images need to be updated to use full Supabase Storage URLs

---

## ✅ Quick Fix

### Step 1: Check Current Image URLs

Run this diagnostic script to see what URLs are in your database:

```bash
node scripts/check-image-urls.js
```

This will show you:
- ✅ How many trucks have Supabase Storage URLs
- ❌ How many trucks have local paths (need fixing)
- ❌ How many trucks have missing URLs

### Step 2: Update Image URLs in Database

If you have trucks with local paths, update them:

```bash
node scripts/update-database-images.js
```

This script will:
- Read the `image-upload-mapping.json` file
- Map old local paths to new Supabase Storage URLs
- Update all trucks in the database

### Step 3: Verify Supabase Storage Setup

Make sure your Supabase Storage bucket is configured correctly:

1. **Go to Supabase Dashboard** → **Storage**
2. **Check bucket `truck-images` exists**
3. **Verify bucket is PUBLIC:**
   - Click on `truck-images` bucket
   - Check "Public bucket" is enabled
4. **Check bucket policies:**
   - Go to "Policies" tab
   - Should have "Allow public read access" policy

### Step 4: Verify Next.js Image Config

Check `next.config.js` has Supabase domain configured:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

This should already be configured, but verify it's there.

---

## 🔍 Detailed Diagnosis

### Check What's in Your Database

1. **Run diagnostic script:**
   ```bash
   node scripts/check-image-urls.js
   ```

2. **Look for these issues:**
   - ❌ Trucks with local paths like `/trucks/image.png`
   - ❌ Trucks with missing image URLs
   - ✅ Trucks with Supabase Storage URLs (these should work)

### Common Issues

#### Issue 1: Local Paths in Database

**Symptom:** Images work locally but not in production

**Solution:**
1. Make sure all images are uploaded to Supabase Storage
2. Run `node scripts/update-database-images.js` to update URLs
3. Verify URLs are full Supabase Storage URLs

#### Issue 2: Missing Image URLs

**Symptom:** Some trucks have no images

**Solution:**
1. Upload missing images to Supabase Storage
2. Update database with new URLs
3. Use the upload script: `node scripts/upload-existing-images.js`

#### Issue 3: Supabase Storage Not Public

**Symptom:** Images return 403 Forbidden errors

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Click on `truck-images` bucket
3. Enable "Public bucket"
4. Add public read policy

#### Issue 4: Wrong Supabase URL Format

**Symptom:** Images don't load even with Supabase URLs

**Solution:**
1. Verify URL format: `https://[project-id].supabase.co/storage/v1/object/public/truck-images/[filename]`
2. Check file exists in Supabase Storage
3. Test URL directly in browser

---

## 📋 Step-by-Step Fix

### If You Have Local Paths:

1. **Upload images to Supabase Storage:**
   ```bash
   node scripts/upload-existing-images.js
   ```
   This creates `image-upload-mapping.json` with old → new URL mappings

2. **Update database with new URLs:**
   ```bash
   node scripts/update-database-images.js
   ```
   This reads the mapping file and updates all trucks

3. **Verify updates:**
   ```bash
   node scripts/check-image-urls.js
   ```
   Should show all trucks have Supabase Storage URLs

4. **Redeploy your application**

### If Images Are Already in Supabase:

1. **Check database URLs:**
   ```bash
   node scripts/check-image-urls.js
   ```

2. **If URLs are wrong, update them manually:**
   - Go to Supabase Dashboard → Table Editor
   - Select `trucks` table
   - Update `image_url` column with correct Supabase Storage URLs
   - Format: `https://[project-id].supabase.co/storage/v1/object/public/truck-images/[filename]`

---

## 🧪 Testing

### Test Image URLs

1. **Get a truck's image URL from database**
2. **Open URL directly in browser:**
   - Should show the image
   - If 403/404, check bucket permissions

### Test in Application

1. **Run locally:**
   ```bash
   npm run dev
   ```
   - Check if images load
   - Check browser console for errors

2. **Deploy and test:**
   - Deploy to production
   - Check if images load
   - Check browser console for errors

---

## 🔧 Manual Fix (If Scripts Don't Work)

### Option 1: Update via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Select `trucks` table
3. For each truck with wrong URL:
   - Click on the row
   - Update `image_url` field
   - Use format: `https://[project-id].supabase.co/storage/v1/object/public/truck-images/[filename]`
   - Save

### Option 2: SQL Update

Run this SQL in Supabase SQL Editor:

```sql
-- Update all local paths to Supabase Storage URLs
-- Replace [project-id] with your actual Supabase project ID
-- Replace [filename] with actual filenames

UPDATE trucks
SET image_url = 'https://[project-id].supabase.co/storage/v1/object/public/truck-images/[filename]'
WHERE image_url LIKE '/trucks/%' OR image_url LIKE './trucks/%';
```

---

## ✅ Verification Checklist

After fixing:

- [ ] All trucks have Supabase Storage URLs (not local paths)
- [ ] Supabase Storage bucket is public
- [ ] Image URLs are accessible (test in browser)
- [ ] Next.js image config includes Supabase domain
- [ ] Images load locally
- [ ] Images load in production deployment
- [ ] No console errors about images

---

## 🆘 Still Not Working?

1. **Check browser console:**
   - Look for image loading errors
   - Check network tab for failed requests

2. **Check server logs:**
   - Look for Supabase connection errors
   - Check if API is returning image URLs

3. **Verify Supabase Storage:**
   - Files exist in bucket
   - Bucket is public
   - URLs are correct format

4. **Test URL directly:**
   - Copy image URL from database
   - Open in new browser tab
   - Should show image, not error

---

**Need help?** Run `node scripts/check-image-urls.js` and share the output!

