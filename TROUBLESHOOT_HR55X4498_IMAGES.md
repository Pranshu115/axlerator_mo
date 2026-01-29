# 🔧 Troubleshoot: HR 55 X 4498 Images Not Showing

## ✅ What I Fixed

1. **Prioritized Supabase Storage** - API now fetches from Supabase Storage first (more reliable)
2. **Enhanced Logging** - Detailed logs to see exactly what's happening
3. **Better Error Messages** - Clear error messages for debugging

---

## 🔍 Step 1: Check Deployment Logs

After redeploying, check your deployment logs for these messages:

### Good Logs (Working):
```
[Images API] ✅ Truck found: HR 55 X 4498 (ID: X)
[Images API] Extracted folder name: "HR 55 X 4498"
[Images API] Strategy 1: Fetching from Supabase Storage for folder: HR 55 X 4498
[Storage] ✅ Found 43 unique images for folder: HR 55 X 4498
[Images API] ✅ Found 43 images from Supabase Storage
```

### Bad Logs (Not Working):
```
[Images API] ❌ Supabase credentials not found
[Storage] ❌ Error listing Supabase Storage files
[Storage] ⚠️ No files found in bucket
[Images API] ⚠️ No images found in Supabase Storage
```

---

## 🔍 Step 2: Verify Images Are in Supabase Storage

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Go to Storage:**
   - Click "Storage" in left sidebar
   - Click on `truck-images` bucket

3. **Search for HR 55 X 4498 images:**
   - Look for files containing "HR-55-X-4498" or "HR55X4498"
   - Should see ~43 image files

4. **If images are missing:**
   - Run: `node scripts/upload-hr-folders-images.js`
   - This will upload all images from the "HR 55 X 4498" folder

---

## 🔍 Step 3: Test API Endpoint Directly

Test the API endpoint to see what it returns:

```bash
# Replace YOUR_SITE_URL and TRUCK_ID
curl https://YOUR_SITE_URL/api/trucks/TRUCK_ID/images
```

**Expected Response:**
```json
{
  "images": [
    "https://xxx.supabase.co/storage/v1/object/public/truck-images/...",
    ...
  ]
}
```

**If Empty Array:**
```json
{
  "images": []
}
```

Check the deployment logs to see why it's empty.

---

## 🔍 Step 4: Verify Environment Variables

Make sure these are set in your deployment platform:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**On Render.com:**
1. Go to your service dashboard
2. Settings → Environment
3. Verify both variables are set
4. Values should match your local `.env.local`

---

## 🔍 Step 5: Check Truck Name in Database

The API extracts folder name from the truck name. Verify:

1. **What is the truck name in database?**
   - Should be something like "HR 55 X 4498"
   - Or "HR-55-X-4498"
   - Or just contain "HR 55 X 4498"

2. **Test folder name extraction:**
   - The API logs: `[Images API] Extracted folder name: "..."`
   - Should show "HR 55 X 4498" or similar

---

## 🔍 Step 6: Verify Supabase Storage Bucket

1. **Bucket exists:**
   - Go to Supabase Dashboard → Storage
   - Verify `truck-images` bucket exists

2. **Bucket is public:**
   - Click on `truck-images` bucket
   - Check "Public bucket" is enabled

3. **Bucket policies:**
   - Go to "Policies" tab
   - Should have public read access policy

---

## 🔧 Common Issues & Fixes

### Issue 1: Images Not in Supabase Storage

**Symptom:** Logs show "No files found in bucket"

**Fix:**
1. Run upload script: `node scripts/upload-hr-folders-images.js`
2. Wait for upload to complete
3. Verify images in Supabase Dashboard
4. Redeploy application

### Issue 2: Environment Variables Not Set

**Symptom:** Logs show "Supabase credentials not found"

**Fix:**
1. Set environment variables in deployment platform
2. Clear build cache
3. Redeploy

### Issue 3: Folder Name Not Matching

**Symptom:** Logs show "Could not extract folder name"

**Fix:**
1. Check truck name in database
2. Ensure it contains "HR 55 X 4498" pattern
3. Update truck name if needed

### Issue 4: Supabase Storage Query Failing

**Symptom:** Logs show "Error listing Supabase Storage files"

**Fix:**
1. Check Supabase credentials are correct
2. Verify bucket exists and is accessible
3. Check bucket policies allow read access

---

## 🎯 Quick Test Checklist

- [ ] Images uploaded to Supabase Storage (check dashboard)
- [ ] Environment variables set in deployment
- [ ] Build cache cleared and redeployed
- [ ] Checked deployment logs for errors
- [ ] Tested API endpoint directly
- [ ] Verified truck name in database
- [ ] Checked Supabase Storage bucket is public

---

## 🆘 Still Not Working?

If images still don't show:

1. **Share deployment logs:**
   - Copy logs from deployment platform
   - Look for `[Images API]` and `[Storage]` messages

2. **Share API response:**
   - Test: `https://your-site.com/api/trucks/X/images`
   - Share the JSON response

3. **Share Supabase Storage status:**
   - Screenshot of bucket showing HR 55 X 4498 images
   - Or confirm if images are there

4. **Check browser console:**
   - Open browser console (F12)
   - Check for network errors
   - Share any error messages

---

## 💡 Pro Tips

1. **Always check deployment logs first** - They show exactly what's happening
2. **Test API endpoint directly** - Bypass frontend to isolate the issue
3. **Verify images in Supabase** - Make sure they're actually uploaded
4. **Check environment variables** - Most common issue
5. **Clear build cache** - Old cached code can cause issues

---

**The enhanced logging will show you exactly where the problem is!** Check your deployment logs after redeploying. 🚀

