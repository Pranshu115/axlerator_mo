# 🔐 Supabase Bucket Policy Setup

The uploads are failing because the bucket policies need to be configured. Here's how to fix it:

## Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click **"Storage"** in the left sidebar
   - Click on the **"truck-images"** bucket

3. **Go to Policies Tab**
   - Click on the **"Policies"** tab

4. **Create Upload Policy (INSERT)**
   - Click **"New policy"**
   - Select **"For full customization"**
   - **Policy name**: `Allow public uploads`
   - **Allowed operation**: `INSERT` (upload)
   - **Policy definition**:
     ```sql
     (bucket_id = 'truck-images')
     ```
   - Click **"Review"** then **"Save policy"**

5. **Create Read Policy (SELECT) - if not exists**
   - Click **"New policy"** again
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT` (read)
   - **Policy definition**:
     ```sql
     (bucket_id = 'truck-images')
     ```
   - Click **"Review"** then **"Save policy"**

## Alternative: Get Service Role Key

If you prefer to use the service role key instead:

1. Go to **Settings** → **API**
2. Find **"service_role"** key (NOT the anon key)
3. It should say `role: service_role` in the description
4. Click **"Reveal"** and copy it
5. The key should be much longer and different from the anon key

## After Setting Up Policies

Once the policies are set, run:
```bash
node scripts/create-bucket-and-upload.js
```

The uploads should work with either:
- ✅ Proper bucket policies (allows anon key uploads)
- ✅ Service role key (bypasses RLS)
