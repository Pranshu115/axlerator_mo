# 🪣 Supabase Bucket Setup Instructions

## Quick Setup (Recommended)

### Option 1: Create Bucket Manually (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project (the one with URL: `https://zdxqxgnuzhgacveozqgf.supabase.co`)

2. **Navigate to Storage**
   - Click **"Storage"** in the left sidebar
   - Click **"New bucket"** button

3. **Create the Bucket**
   - **Bucket name**: `truck-images` (exactly this name)
   - **Public bucket**: ✅ **Check this** (so images are publicly accessible)
   - Click **"Create bucket"**

4. **Set Bucket Policies** (IMPORTANT!)
   - Click on the `truck-images` bucket
   - Go to **"Policies"** tab
   - Click **"New policy"**
   - Select **"For full customization"**
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT` (read)
   - **Policy definition**:
     ```sql
     (bucket_id = 'truck-images')
     ```
   - Click **"Review"** then **"Save policy"**

   - Create another policy for uploads:
   - Click **"New policy"** again
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT` (upload)
   - **Policy definition**:
     ```sql
     (bucket_id = 'truck-images')
     ```
   - Click **"Review"** then **"Save policy"**

5. **Run the Upload Script**
   ```bash
   node scripts/create-bucket-and-upload.js
   ```

---

### Option 2: Use Service Role Key (Advanced)

If you want to create the bucket programmatically, you need the **Service Role Key**:

1. **Get Service Role Key**
   - Go to https://supabase.com/dashboard
   - Select your project → **Settings** → **API**
   - Find **"service_role"** key (NOT the anon key!)
   - Click **"Reveal"** to show it
   - Copy the key

2. **Set Environment Variable**
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

3. **Run the Upload Script**
   ```bash
   node scripts/create-bucket-and-upload.js
   ```

---

## After Bucket is Created

Once the bucket exists, you can upload images by running:

```bash
node scripts/create-bucket-and-upload.js
```

This will:
- ✅ Check if bucket exists
- ✅ Upload all images from "HR 38 W 2162" folder
- ✅ Save mapping file with all URLs

---

## Current Status

- ❌ Bucket `truck-images` does not exist yet
- ⏳ Waiting for bucket creation
- 📁 46 files ready to upload from "HR 38 W 2162" folder
