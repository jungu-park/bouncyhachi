# Directive 00: Media & Asset Optimization

## 1. Goal
Ensure fast load times and high performance by strictly managing how images, audio, and 3D assets are loaded and displayed.

## 2. Image Optimization
- **Formats:** Convert standard images to WebP format for web applications. 
- **Lazy Loading:** Apply `loading="lazy"` to all images below the fold.
- **Game Sprite Sheets:** For 2D games, combine individual character/enemy images into a single Texture Atlas (Sprite Sheet) to reduce HTTP requests and improve rendering performance.

## 3. Heavy Assets (Audio & 3D)
- **Preloading:** For games, implement a loading screen that preloads critical audio files and 3D models/textures before the main scene starts.
- **Compression:** Ensure audio is compressed (e.g., .ogg or .mp3) and 3D models (GLTF/GLB) are optimized with Draco compression if applicable.