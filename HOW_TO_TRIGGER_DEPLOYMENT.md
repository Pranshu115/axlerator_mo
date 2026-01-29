# 🚀 How to Trigger Deployment After Code Changes

## Why Changes Don't Appear Automatically

Changes you push to GitHub **don't automatically deploy** unless:
1. ✅ Auto-deploy is enabled in your deployment platform
2. ✅ The deployment platform is connected to your GitHub repository
3. ✅ The deployment actually runs successfully

---

## 🔍 Check Your Deployment Platform

### For Render.com

#### Step 1: Check if Auto-Deploy is Enabled

1. Go to https://dashboard.render.com
2. Select your web service (axxlerator)
3. Go to **Settings** tab
4. Scroll to **"Auto-Deploy"** section
5. Check if it says:
   - ✅ **"Auto-Deploy: Yes"** = Changes deploy automatically
   - ❌ **"Auto-Deploy: No"** = You need to manually deploy

#### Step 2: Enable Auto-Deploy (if disabled)

1. In the **Settings** tab
2. Under **"Auto-Deploy"** section
3. Select **"Yes"** for auto-deploy
4. Make sure **"Branch"** is set to `main` (or your default branch)
5. Click **"Save Changes"**

#### Step 3: Manually Trigger Deployment (if needed)

If auto-deploy is disabled or you want to deploy immediately:

1. Go to your service dashboard
2. Click **"Manual Deploy"** button (top right)
3. Select **"Clear build cache & deploy"** (recommended)
4. Click **"Deploy latest commit"**
5. Wait for deployment to complete (usually 3-5 minutes)

---

### For Vercel

#### Step 1: Check Deployment Settings

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Git**
4. Check **"Production Branch"** is set to `main`
5. Verify **"Auto-Deploy"** is enabled

#### Step 2: Trigger Manual Deployment

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or click **"Deploy"** → **"Deploy latest commit"**

---

## 🔧 Common Issues & Solutions

### Issue 1: Auto-Deploy is Disabled

**Symptom:** Changes pushed to GitHub don't trigger deployment

**Solution:**
1. Enable auto-deploy in your platform settings
2. OR manually trigger deployment after each push

### Issue 2: Wrong Branch Connected

**Symptom:** Changes on `main` branch don't deploy

**Solution:**
1. Check which branch is connected in deployment settings
2. Make sure you're pushing to the correct branch
3. Update deployment settings to use `main` branch

### Issue 3: Deployment Fails Silently

**Symptom:** Deployment shows as "successful" but changes don't appear

**Solution:**
1. Check deployment logs for errors
2. Clear build cache and redeploy
3. Check if build completed successfully

### Issue 4: Build Cache Issues

**Symptom:** Old code still running after deployment

**Solution:**
1. **Clear build cache** before deploying:
   - Render.com: Manual Deploy → Clear build cache & deploy
   - Vercel: Settings → Clear build cache
2. Redeploy after clearing cache

---

## ✅ Quick Checklist

After pushing code changes:

- [ ] Code pushed to GitHub successfully
- [ ] Auto-deploy enabled OR manually triggered deployment
- [ ] Deployment started (check dashboard)
- [ ] Build completed successfully (check logs)
- [ ] Deployment status is "Live" or "Ready"
- [ ] Changes visible on deployed site

---

## 🎯 Step-by-Step: Manual Deployment on Render.com

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Go to Render.com Dashboard:**
   - Visit https://dashboard.render.com
   - Select your service

3. **Trigger Manual Deployment:**
   - Click **"Manual Deploy"** button (top right)
   - Select **"Clear build cache & deploy"**
   - Click **"Deploy latest commit"**

4. **Wait for Deployment:**
   - Watch the logs in real-time
   - Wait for "Deploy successful" message
   - Usually takes 3-5 minutes

5. **Verify Changes:**
   - Visit your deployed URL
   - Check if changes are visible
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R) to clear browser cache

---

## 🔍 How to Check Deployment Status

### On Render.com:
1. Go to your service dashboard
2. Check **"Events"** tab for deployment history
3. Check **"Logs"** tab for build/deployment logs
4. Look for:
   - ✅ "Deploy successful"
   - ❌ "Deploy failed" (check logs for errors)

### On Vercel:
1. Go to **Deployments** tab
2. Check latest deployment status
3. Click on deployment to see logs
4. Look for build errors or warnings

---

## 💡 Pro Tips

1. **Always clear build cache** when:
   - Environment variables changed
   - Dependencies updated
   - Major code changes
   - Changes not appearing

2. **Check deployment logs** if changes don't appear:
   - Look for errors
   - Check if build completed
   - Verify environment variables are set

3. **Hard refresh browser** after deployment:
   - Windows/Linux: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
   - This clears browser cache

4. **Wait a few minutes** after deployment:
   - CDN cache might need time to update
   - DNS propagation can take time
   - Try again in 2-3 minutes

---

## 🆘 Still Not Working?

If changes still don't appear:

1. **Verify code was pushed:**
   - Check GitHub repository
   - Confirm latest commit is there

2. **Check deployment logs:**
   - Look for build errors
   - Check if deployment actually ran

3. **Verify environment variables:**
   - Make sure they're set correctly
   - Clear cache and redeploy

4. **Check branch settings:**
   - Ensure correct branch is connected
   - Push to the right branch

5. **Contact support:**
   - Share deployment logs
   - Share GitHub commit hash
   - Describe what's not working

---

## 📋 Quick Reference

### Render.com Commands:
- **Manual Deploy:** Dashboard → Manual Deploy → Clear build cache & deploy
- **Check Logs:** Dashboard → Logs tab
- **Check Status:** Dashboard → Events tab

### Vercel Commands:
- **Redeploy:** Deployments → Redeploy
- **Check Logs:** Deployments → Click deployment → View logs
- **Settings:** Settings → Git (for auto-deploy)

---

**Remember:** After pushing code, you need to either:
1. ✅ Have auto-deploy enabled (deploys automatically)
2. ✅ Manually trigger deployment (if auto-deploy is off)

**Most common issue:** Auto-deploy is disabled, so you need to manually trigger deployment after each push!

