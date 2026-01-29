# 🔧 Deployment Troubleshooting Guide

## Issue: Trucks Not Showing After Deployment

### Problem
Trucks are visible locally but not showing after deployment.

### Root Cause
This happens when Supabase environment variables are not properly configured in your deployment platform (Render.com, Vercel, etc.). The app falls back to seed data (only 8 certified trucks) instead of fetching from your database.

---

## ✅ Quick Fix

### Step 1: Verify Environment Variables in Deployment Platform

**For Render.com:**
1. Go to your Render.com dashboard
2. Select your web service
3. Go to **"Environment"** tab
4. Verify these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**For Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify the same variables are set

### Step 2: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (⚙️ icon)
4. Click **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3: Set Environment Variables

**In Render.com:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co

Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important Notes:**
- ✅ Variable names must be **exact** (case-sensitive)
- ✅ No spaces around the `=` sign
- ✅ No quotes needed around values
- ✅ Must be set as **public** environment variables (not secrets)

### Step 4: Redeploy

1. **Clear build cache** (in Render.com: Manual Deploy → Clear build cache)
2. **Redeploy** your application
3. Wait for deployment to complete

### Step 5: Verify

1. Open your deployed website
2. Check browser console (F12) for errors
3. Look for these messages:
   - ✅ `Successfully fetched X trucks from Supabase` = Working!
   - ❌ `Using fallback seed data` = Environment variables not set correctly

---

## 🔍 How to Check if It's Working

### Check Server Logs

In your deployment platform's logs, you should see:
- ✅ `Successfully fetched X trucks from Supabase` = Database connection working
- ❌ `Supabase client not initialized` = Environment variables missing
- ❌ `Using fallback seed data` = Connection failed, using seed data

### Check Browser Console

1. Open your deployed website
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Look for:
   - ✅ No Supabase warnings = Good
   - ❌ `Supabase credentials not found` = Environment variables not set

### Check Network Tab

1. Open Developer Tools → **Network** tab
2. Navigate to browse trucks page
3. Look for request to `/api/trucks`
4. Check the response:
   - If it returns many trucks = Database working
   - If it returns only 8 trucks = Using seed data (env vars not set)

---

## 🐛 Common Issues

### Issue 1: "Supabase client not initialized"

**Cause:** Environment variables not set or incorrectly named

**Solution:**
1. Double-check variable names are exact:
   - `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)
2. Make sure they're set as **public** variables (not secrets)
3. Clear build cache and redeploy

### Issue 2: "Using fallback seed data"

**Cause:** Supabase connection failed

**Solution:**
1. Verify Supabase project is active (not paused)
2. Check that Project URL is correct
3. Verify anon key is correct (full key, no truncation)
4. Check server logs for specific error messages

### Issue 3: Only 8 trucks showing (seed data)

**Cause:** App is using fallback seed data instead of database

**Solution:**
1. Follow Step 1-4 above to set environment variables
2. Clear build cache
3. Redeploy

### Issue 4: Environment variables set but still not working

**Possible Causes:**
1. Variables set as secrets instead of public
2. Build cache not cleared
3. Wrong variable names (typos)
4. Supabase project paused or deleted

**Solution:**
1. Delete and recreate environment variables
2. Clear build cache completely
3. Redeploy from scratch

---

## 📋 Verification Checklist

After setting environment variables and redeploying:

- [ ] Environment variables are set in deployment platform
- [ ] Variable names are exact (case-sensitive)
- [ ] Build cache cleared
- [ ] Application redeployed
- [ ] Server logs show "Successfully fetched X trucks from Supabase"
- [ ] Browser console shows no Supabase warnings
- [ ] Browse trucks page shows all your trucks (not just 8)

---

## 🆘 Still Not Working?

If trucks still don't show after following all steps:

1. **Check Supabase Dashboard:**
   - Verify your project is active
   - Check that trucks table has data
   - Verify trucks have `certified = true`

2. **Check Server Logs:**
   - Look for specific error messages
   - Check if Supabase connection is being attempted
   - Verify environment variables are being read

3. **Test Locally:**
   - Copy your `.env.local` values
   - Set them in deployment platform
   - Make sure they match exactly

4. **Contact Support:**
   - Share server logs
   - Share environment variable names (not values!)
   - Share Supabase project status

---

## 💡 Pro Tips

1. **Always clear build cache** after changing environment variables
2. **Use exact variable names** - Next.js requires `NEXT_PUBLIC_` prefix for client-side access
3. **Test locally first** - If it works locally, it should work in deployment
4. **Check logs regularly** - Server logs will tell you exactly what's wrong

---

**Need more help?** Check the server logs in your deployment platform - they will show exactly what's happening!

