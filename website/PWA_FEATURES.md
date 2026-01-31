# PWA Features Implementation

This document describes the Progressive Web App (PWA) features implemented for YotsubaEngine website.

## Overview

The website has been converted into a full Progressive Web App with offline functionality and installability.

## Features Implemented

### 1. Web App Manifest (`manifest.webmanifest`)
- **App Name**: YotsubaEngine - Motor de Videojuegos Multiplataforma
- **Short Name**: YotsubaEngine
- **Theme Color**: #4caf50 (Green)
- **Background Color**: #121212 (Dark)
- **Display Mode**: Standalone (runs like a native app)
- **Language**: Spanish (es-ES)
- **Categories**: Development, Education, Productivity

### 2. App Icons (All using Yotsuba Logo)
The following icon sizes have been generated from the official Yotsuba logo (`logo_only_sin_fondo.png`):
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px
- 384x384px
- 512x512px (maskable)

### 3. Service Worker Configuration
The service worker (`ngsw-worker.js`) provides offline functionality with the following caching strategies:

#### App Shell (Prefetch - Always Available Offline)
- index.html
- main JavaScript bundle
- styles CSS
- favicon.ico
- manifest.webmanifest

#### Assets (Lazy Load - Cached on First Access)
- All app icons (8 sizes)
- Logo and images
- SVG files
- Fonts (woff, woff2, ttf, otf)
- Other media files

#### API Caching (Network First with Fallback)
- API calls are cached with a "freshness" strategy
- 1 hour maximum cache age
- 10 second timeout before using cache
- Maximum 100 cached responses

### 4. Offline Functionality
When offline, the app will:
1. Load the app shell from cache
2. Display cached pages and assets
3. Show cached API responses (up to 1 hour old)
4. Provide a seamless experience even without internet

### 5. Installation
Users can install the app on their devices:
- **Desktop**: Chrome/Edge will show an install button in the address bar
- **Mobile**: "Add to Home Screen" option in the browser menu
- **iOS**: Safari "Add to Home Screen" with custom icon

## Testing the PWA

### Build for Production
```bash
npm run build:prod
```

### Serve the Production Build
```bash
npx http-server dist/website/browser -p 8080
```

### Test PWA Features
1. Open Chrome DevTools > Application tab
2. Check "Manifest" section for app info
3. Check "Service Workers" section for worker registration
4. Use "Offline" checkbox to test offline functionality
5. Use Lighthouse audit to verify PWA score

## Technical Details

### Service Worker Registration
- Registered only in production mode (`!isDevMode()`)
- Registration strategy: `registerWhenStable:30000` (30 seconds after app is stable)
- Location: `src/app/app.config.ts`

### Configuration Files
- Service Worker Config: `ngsw-config.json`
- Web App Manifest: `public/manifest.webmanifest`
- Icons Directory: `public/icons/`

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Limited support (no background sync)
- Opera: Full support

## Security Considerations

The service worker is served with the following security features:
- Only runs over HTTPS (or localhost for development)
- Scoped to the app root
- Cannot access cookies or localStorage
- Subject to same-origin policy

## Future Enhancements

Potential improvements for the PWA:
- Background sync for offline form submissions
- Push notifications for updates
- Periodic background sync for fresh content
- Share target API for sharing content to the app
- Install prompt customization
- Update notifications when new version is available
