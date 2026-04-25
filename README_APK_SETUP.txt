# GameHub APK Download Setup

This website is now ready for APK downloads.

## What was added
- download.html page
- Download APK button
- downloads/ folder
- manifest.json
- service-worker.js
- PWA install support
- APK menu link

## Important
The APK itself is not included. You need to build the Android APK, rename it to:

GameHub.apk

Then place it inside:

downloads/GameHub.apk

After uploading the website, users can visit:

download.html

and click "Download APK".

## Build APK options
Use any of these:
1. Android Studio WebView app
2. Capacitor
3. Bubblewrap / Trusted Web Activity
4. PWA Builder

For easiest beginner route:
- Upload this website to GitHub Pages or hosting
- Visit pwabuilder.com
- Enter your website URL
- Generate Android package
- Download APK/AAB
- Rename APK to GameHub.apk
- Put it into downloads folder
