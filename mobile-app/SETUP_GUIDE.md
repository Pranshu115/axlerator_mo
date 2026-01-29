# Axlerator Mobile App - Setup Guide

This guide will help you set up and run the Axlerator Android mobile app.

## Quick Start

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure API Endpoint

Edit `src/services/api.ts` and update the `API_BASE_URL`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_LOCAL_IP:3000/api'  // Replace with your local IP for testing
  : 'https://your-production-url.com/api';
```

**Important**: For Android emulator, use `http://10.0.2.2:3000/api` instead of `localhost`.
For physical device, use your computer's local IP address (e.g., `http://192.168.1.100:3000/api`).

### 3. Run the App

#### Option A: Using Expo Go (Recommended for Testing)

1. Install Expo Go app on your Android device from Google Play Store
2. Run:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go app

#### Option B: Using Android Emulator

1. Start Android Studio
2. Launch an Android emulator
3. Run:
   ```bash
   npm run android
   ```

### 4. Test the App

- **Home Screen**: Browse featured trucks
- **Browse Screen**: Search and filter trucks
- **Sell Screen**: Submit truck details with photos
- **Services Screen**: View company information
- **Truck Details**: View detailed truck information

## Features Implemented

✅ Bottom tab navigation (Home, Browse, Sell, Services)
✅ Home screen with featured trucks
✅ Browse trucks with search and filters
✅ Sell truck form with image upload
✅ Truck detail screen
✅ Services/About page
✅ API integration layer
✅ Image picker for photo uploads
✅ Mobile-optimized UI/UX

## Building for Production

### Prerequisites

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

### Build APK (for direct installation)

```bash
eas build:configure
eas build --platform android --profile preview
```

This will generate an APK file that can be installed directly on Android devices.

### Build AAB (for Google Play Store)

```bash
eas build --platform android --profile production
```

This generates an Android App Bundle (AAB) file for Google Play Store submission.

## Troubleshooting

### Issue: Cannot connect to API

**Solution**: 
- Check that your Next.js backend is running
- Verify the API_BASE_URL in `src/services/api.ts`
- For Android emulator, use `http://10.0.2.2:3000/api`
- For physical device, use your computer's local IP

### Issue: Image upload fails

**Solution**:
- Check camera/photo permissions in `app.json`
- Verify the upload endpoint is working in the backend
- Check file size limits

### Issue: Navigation errors

**Solution**:
- Ensure all screens are properly imported in `App.tsx`
- Check that navigation types match

### Issue: Build fails

**Solution**:
- Clear Expo cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check `app.json` for configuration errors

## Next Steps

1. **Add Authentication**: Implement user login/signup
2. **Add Favorites**: Allow users to save favorite trucks
3. **Push Notifications**: Notify users about new trucks or inquiries
4. **Offline Support**: Cache trucks for offline viewing
5. **Analytics**: Add analytics tracking
6. **Error Handling**: Improve error messages and handling

## API Endpoints Used

The app uses the following endpoints from your Next.js backend:

- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/[id]` - Get truck by ID
- `GET /api/search?q=query` - Search trucks
- `GET /api/truck-submissions?status=approved` - Get approved submissions
- `POST /api/truck-submissions` - Submit new truck
- `POST /api/upload-image` - Upload truck images
- `POST /api/contact` - Submit contact form

Ensure these endpoints are available and CORS is configured to allow mobile app requests.

## Support

For issues or questions:
1. Check the main README.md
2. Review Expo documentation: https://docs.expo.dev/
3. Check React Native docs: https://reactnative.dev/
