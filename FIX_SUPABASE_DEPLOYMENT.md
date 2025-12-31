# 🔧 Fix: Supabase Images Not Loading in Production

## ✅ Problem Identified

Images work locally but fail in production because:
- Environment variables are not set correctly in deployment platform
- Supabase credentials are missing or incorrect
- API route can't connect to Supabase

---

## 🔍 Step 1: Check Environment Variables in Deployment

### For Render.com:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Select your web service

2. **Go to Settings → Environment:**
   - Scroll to "Environment Variables" section
   - Check if these are set:
     - ✅ `NEXT_PUBLIC_SUPABASE_URL`
     - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **If Missing, Add Them:**
   - Click "Add Environment Variable"
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase project URL (from Supabase dashboard)
   - Click "Save Changes"
   - Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Get Your Supabase Credentials:**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **API**
   - Copy:
     - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### For Vercel:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Go to Settings → Environment Variables:**
   - Check if variables are set
   - Add if missing (same as above)

---

## 🔍 Step 2: Verify Environment Variables

### Check Your Local `.env.local`:

```bash
cat .env.local | grep SUPABASE
```

You should see:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Copy These Values to Deployment:

1. Copy the exact values from `.env.local`
2. Paste them into your deployment platform's environment variables
3. Make sure there are no extra spaces or quotes

---

## 🔍 Step 3: Check Deployment Logs

After setting environment variables, check the logs:

### On Render.com:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for:
   - ✅ `[Images API] Supabase URL configured: ✅ Yes`
   - ✅ `[Images API] Supabase Key configured: ✅ Yes`
   - ❌ If you see "❌ No", environment variables are not set correctly

### What to Look For:

**Good Logs:**
```
[Images API] Fetching images for truck ID: 1
[Images API] Supabase URL configured: ✅ Yes
[Images API] Supabase Key configured: ✅ Yes (length: 200+)
[Images API] Supabase client created, fetching truck data...
[Images API] ✅ Truck found: HR 55 X 4498 (ID: 1)
[Storage] ✅ Found 10 unique images for folder: HR 55 X 4498
```

**Bad Logs (Environment Variables Missing):**
```
[Images API] ❌ Supabase credentials not found in environment variables
[Images API] NEXT_PUBLIC_SUPABASE_URL: Not set
[Images API] NEXT_PUBLIC_SUPABASE_ANON_KEY: Not set
```

**Bad Logs (Supabase Connection Error):**
```
[Images API] ❌ Error fetching truck 1: ...
[Storage] ❌ Error listing Supabase Storage files: ...
```

---

## 🔍 Step 4: Test API Endpoint Directly

After deployment, test the API endpoint:

```bash
# Replace YOUR_SITE_URL and TRUCK_ID
curl https://YOUR_SITE_URL/api/trucks/1/images
```

**Expected Response (Success):**
```json
{
  "images": [
    "https://xxx.supabase.co/storage/v1/object/public/truck-images/image1.jpg",
    "https://xxx.supabase.co/storage/v1/object/public/truck-images/image2.jpg",
    ...
  ]
}
```

**Error Response (Environment Variables Missing):**
```json
{
  "images": [],
  "error": "Supabase credentials not configured",
  "debug": {
    "hasUrl": false,
    "hasKey": false
  }
}
```

---

## 🔧 Step 5: Common Issues & Fixes

### Issue 1: Environment Variables Not Set

**Symptom:** Logs show "❌ No" for URL/Key

**Fix:**
1. Go to deployment platform settings
2. Add environment variables
3. **Clear build cache** and redeploy
4. Wait for deployment to complete

### Issue 2: Wrong Environment Variable Names

**Symptom:** Variables set but still not working

**Fix:**
- Make sure variable names are EXACTLY:
  - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)
- The `NEXT_PUBLIC_` prefix is required for Next.js

### Issue 3: Environment Variables Have Extra Spaces

**Symptom:** Variables set but connection fails

**Fix:**
- Remove any leading/trailing spaces
- Don't wrap values in quotes unless necessary
- Copy values directly from Supabase dashboard

### Issue 4: Supabase Storage Bucket Not Public

**Symptom:** Images return 403 Forbidden

**Fix:**
1. Go to Supabase Dashboard → Storage
2. Click on `truck-images` bucket
3. Enable "Public bucket"
4. Add public read policy

### Issue 5: Build Cache Issues

**Symptom:** Changes not taking effect

**Fix:**
1. **Clear build cache** before deploying
2. On Render.com: Manual Deploy → Clear build cache & deploy
3. On Vercel: Settings → Clear build cache

---

## ✅ Step 6: Verify Fix

After setting environment variables and redeploying:

1. **Check Deployment Logs:**
   - Should show "✅ Yes" for URL and Key
   - Should show successful truck fetch
   - Should show images found

2. **Test API Endpoint:**
   - Visit: `https://your-site.com/api/trucks/1/images`
   - Should return array of image URLs

3. **Test on Website:**
   - Visit truck detail page
   - Images should load
   - Check browser console (F12) for errors

---

## 📋 Quick Checklist

- [ ] Environment variables set in deployment platform
- [ ] Variable names are correct (`NEXT_PUBLIC_` prefix)
- [ ] Values match local `.env.local`
- [ ] No extra spaces in values
- [ ] Build cache cleared
- [ ] Redeployed after setting variables
- [ ] Checked deployment logs for errors
- [ ] Tested API endpoint directly
- [ ] Images load on website

---

## 🆘 Still Not Working?

If images still don't load after following all steps:

1. **Share Deployment Logs:**
   - Copy logs from deployment platform
   - Look for `[Images API]` and `[Storage]` messages

2. **Share API Response:**
   - Test: `https://your-site.com/api/trucks/1/images`
   - Share the response (JSON)

3. **Verify Supabase:**
   - Check Supabase dashboard
   - Verify bucket exists and is public
   - Verify images are uploaded

4. **Check Browser Console:**
   - Open browser console (F12)
   - Check for network errors
   - Share any error messages

---

## 💡 Pro Tips

1. **Always use `NEXT_PUBLIC_` prefix** for client-accessible variables
2. **Clear build cache** after changing environment variables
3. **Check logs immediately** after deployment
4. **Test API endpoint directly** before testing on website
5. **Keep local and production variables in sync**

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**The enhanced logging will help you identify exactly where the issue is!** Check your deployment logs after redeploying. 🚀

