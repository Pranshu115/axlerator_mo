# Axlerator Mobile App

React Native mobile application for the Axlerator truck marketplace, built with Expo.

## Features

- **Browse Trucks**: Search and filter through available trucks
- **Sell Your Truck**: Submit truck details with photo uploads
- **Truck Details**: View detailed information about each truck
- **Services**: Learn about Axlerator's services
- **Mobile-Optimized**: Native Android experience with smooth navigation

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Android Studio (for Android development) or Xcode (for iOS development)
- Expo Go app on your mobile device (for testing)

## Installation

1. Navigate to the mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
   - Open `src/services/api.ts`
   - Update `API_BASE_URL` with your backend API URL
   - For development: `http://localhost:3000/api` (if running Next.js locally)
   - For production: `https://your-production-url.com/api`

## Running the App

### Development Mode

1. Start the Expo development server:
```bash
npm start
```

2. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (will open in Expo Go)

### Android Emulator

1. Start Android Studio and launch an emulator
2. Run:
```bash
npm run android
```

### iOS Simulator (Mac only)

```bash
npm run ios
```

## Project Structure

```
mobile-app/
├── App.tsx                 # Main app entry point with navigation
├── src/
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── BrowseTrucksScreen.tsx
│   │   ├── SellTruckScreen.tsx
│   │   ├── ServicesScreen.tsx
│   │   └── TruckDetailScreen.tsx
│   ├── components/        # Reusable components
│   │   ├── TruckCard.tsx
│   │   └── FilterModal.tsx
│   └── services/          # API service layer
│       └── api.ts
├── package.json
└── app.json               # Expo configuration
```

## Key Technologies

- **React Native**: Mobile framework
- **Expo**: Development platform and tooling
- **React Navigation**: Navigation library
- **Expo Image Picker**: Image selection and upload
- **TypeScript**: Type safety

## Building for Production

### Android APK

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure build:
```bash
eas build:configure
```

4. Build APK:
```bash
eas build --platform android --profile preview
```

### Android App Bundle (AAB)

For Google Play Store:
```bash
eas build --platform android --profile production
```

## Configuration

### Environment Variables

Create a `.env` file in the mobile-app directory:
```
API_BASE_URL=https://your-api-url.com/api
```

### App Configuration

Edit `app.json` to customize:
- App name
- Package identifier
- Icons and splash screens
- Permissions

## API Integration

The app communicates with the Next.js backend API. Ensure:
1. Backend API is running and accessible
2. CORS is configured to allow mobile app requests
3. API endpoints match the service layer in `src/services/api.ts`

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache with `expo start -c`
2. **Image upload fails**: Check API endpoint and permissions
3. **Navigation errors**: Ensure all screens are properly registered
4. **Build fails**: Check `app.json` configuration and dependencies

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
