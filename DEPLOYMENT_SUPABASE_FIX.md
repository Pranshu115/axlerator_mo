# 🔧 Fix: Supabase Images Not Loading After Deployment

## 🎯 Quick Diagnosis

**Test your deployment environment variables:**
```
https://your-deployed-site.com/api/debug/supabase
```

This will show you exactly what's configured and what's missing.

---

## ✅ Step 1: Set Environment Variables in Your Deployment Platform

### For Vercel:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Go to Settings → Environment Variables:**
   - Click "Add New"
   - Add these **TWO** variables:

   **Variable 1:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase project URL (from Supabase dashboard)
   - **Environment:** Production, Preview, Development (select all)
   - Click "Save"

   **Variable 2:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon key (from Supabase dashboard)
   - **Environment:** Production, Preview, Development (select all)
   - Click "Save"

3. **Redeploy:**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - **OR** push a new commit to trigger redeploy

### For Render.com:

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Select your web service

2. **Go to Environment:**
   - Scroll to "Environment Variables" section
   - Click "Add Environment Variable"

   **Variable 1:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase project URL
   - Click "Save Changes"

   **Variable 2:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon key
   - Click "Save Changes"

3. **Redeploy:**
   - Go to "Manual Deploy"
   - Click "Clear build cache & deploy"

### For Other Platforms:

Follow the same pattern:
- Add `NEXT_PUBLIC_SUPABASE_URL`
- Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Clear build cache
- Redeploy

---

## 🔑 Step 2: Get Your Supabase Credentials

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Sign in and select your project

2. **Get Project URL:**
   - Go to **Settings** (gear icon) → **API**
   - Under "Project URL", copy the URL
   - Example: `https://abcdefghijklmnop.supabase.co`
   - Use this for `NEXT_PUBLIC_SUPABASE_URL`

3. **Get Anon Key:**
   - In the same page, under "Project API keys"
   - Find **"anon"** or **"public"** key
   - Click "Reveal" and copy the key
   - It should start with `eyJhbGc...` (JWT token)
   - Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ⚠️ Important Notes

### 1. Variable Names Must Be Exact

✅ **Correct:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

❌ **Wrong:**
- `SUPABASE_URL` (missing NEXT_PUBLIC_ prefix)
- `SUPABASE_ANON_KEY` (missing NEXT_PUBLIC_ prefix)
- `NEXT_PUBLIC_SUPABASE_URL_` (extra underscore)
- `next_public_supabase_url` (wrong case)

### 2. No Extra Spaces or Quotes

✅ **Correct:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

❌ **Wrong:**
```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co  (extra spaces)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"  (quotes not needed)
NEXT_PUBLIC_SUPABASE_URL= https://xxx.supabase.co   (space after =)
```

### 3. Clear Build Cache After Setting Variables

Environment variables are baked into the build. After setting them:
- **Vercel:** Redeploy (automatically clears cache)
- **Render:** Use "Clear build cache & deploy"
- **Other:** Clear build cache in platform settings

---

## 🧪 Step 3: Test Your Configuration

### Test 1: Check Environment Variables

Visit this URL on your deployed site:
```
https://your-site.com/api/debug/supabase
```

**Expected Response (Success):**
```json
{
  "status": "✅ Configured",
  "environment": {
    "url": { "set": true, "length": 45 },
    "key": { "set": true, "length": 200 }
  },
  "connectionTest": "✅ Connected! Found 1 buckets"
}
```

**Expected Response (Missing Variables):**
```json
{
  "status": "❌ Not Configured",
  "environment": {
    "url": { "set": false },
    "key": { "set": false }
  },
  "recommendations": [
    "Set NEXT_PUBLIC_SUPABASE_URL...",
    "Set NEXT_PUBLIC_SUPABASE_ANON_KEY..."
  ]
}
```

### Test 2: Check API Endpoint

Visit:
```
https://your-site.com/api/trucks/1/images
```

**Expected Response (Success):**
```json
{
  "images": [
    "https://xxx.supabase.co/storage/v1/object/public/truck-images/image1.jpg",
    "https://xxx.supabase.co/storage/v1/object/public/truck-images/image2.jpg"
  ]
}
```

**Error Response (Missing Credentials):**
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

## 📋 Step 4: Check Deployment Logs

After redeploying, check your deployment logs:

### Good Logs (Success):
```
[Images API] Fetching images for truck ID: 1
[Images API] Supabase URL configured: ✅ Yes
[Images API] Supabase Key configured: ✅ Yes (length: 200)
[Images API] Supabase client created, fetching truck data...
[Images API] ✅ Truck found: HR 55 X 4498 (ID: 1)
[Storage] ✅ Found 10 unique images for folder: HR 55 X 4498
```

### Bad Logs (Missing Variables):
```
[Images API] ❌ Supabase credentials not found in environment variables
[Images API] NEXT_PUBLIC_SUPABASE_URL: Not set
[Images API] NEXT_PUBLIC_SUPABASE_ANON_KEY: Not set
```

---

## 🔍 Step 5: Verify Supabase Storage Setup

Even if environment variables are set, images won't load if:

1. **Bucket doesn't exist:**
   - Go to Supabase Dashboard → Storage
   - Verify `truck-images` bucket exists
   - If not, create it

2. **Bucket is not public:**
   - Click on `truck-images` bucket
   - Go to "Policies" tab
   - Ensure there's a public read policy
   - Or enable "Public bucket" option

3. **Images not uploaded:**
   - Check if images are actually in the bucket
   - Verify file names match the expected pattern

---

## 🚨 Common Issues & Solutions

### Issue 1: Variables Set But Still Not Working

**Possible Causes:**
- Build cache not cleared
- Variables set after build
- Wrong environment (Production vs Preview)

**Solution:**
1. Clear build cache
2. Redeploy
3. Wait for deployment to complete
4. Test again

### Issue 2: Works Locally But Not in Production

**Cause:** Environment variables only in local `.env.local`, not in deployment platform

**Solution:**
1. Copy values from `.env.local`
2. Add to deployment platform
3. Redeploy

### Issue 3: Connection Test Fails

**Possible Causes:**
- Wrong Supabase URL
- Wrong anon key
- Supabase project paused/deleted
- Network/CORS issues

**Solution:**
1. Verify credentials in Supabase dashboard
2. Test connection locally first
3. Check Supabase project status

### Issue 4: Images Return 403 Forbidden

**Cause:** Bucket not public or missing read policy

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Click `truck-images` bucket
3. Enable "Public bucket" or add public read policy

---

## ✅ Verification Checklist

After following all steps:

- [ ] Environment variables added to deployment platform
- [ ] Variable names are exact (with `NEXT_PUBLIC_` prefix)
- [ ] No extra spaces in values
- [ ] Build cache cleared
- [ ] Redeployed after setting variables
- [ ] Tested `/api/debug/supabase` endpoint
- [ ] Tested `/api/trucks/1/images` endpoint
- [ ] Checked deployment logs for errors
- [ ] Verified Supabase bucket exists and is public
- [ ] Images load on website

---

## 🆘 Still Not Working?

If images still don't load:

1. **Share Diagnostic Results:**
   - Visit: `https://your-site.com/api/debug/supabase`
   - Share the JSON response

2. **Share Deployment Logs:**
   - Copy logs from deployment platform
   - Look for `[Images API]` messages
   - Share relevant error messages

3. **Share API Response:**
   - Test: `https://your-site.com/api/trucks/1/images`
   - Share the JSON response

4. **Verify Local Setup:**
   - Check `.env.local` file
   - Verify it works locally
   - Compare local vs production values

---

## 💡 Pro Tips

1. **Always use `NEXT_PUBLIC_` prefix** - Required for Next.js client-side access
2. **Set variables BEFORE first deployment** - Prevents initial build failures
3. **Clear cache after changes** - Environment variables are baked into build
4. **Test diagnostic endpoint first** - Quick way to verify configuration
5. **Check logs immediately** - Catch issues early
6. **Keep local and production in sync** - Use same variable names

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Diagnostic Endpoint:** `https://your-site.com/api/debug/supabase`

---

**The diagnostic endpoint will tell you exactly what's wrong!** 🚀
