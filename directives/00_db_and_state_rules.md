# Directive 00: Database & State Management Rules

## 1. Goal
Ensure consistent, scalable, and secure data handling across all web applications and games.

## 2. State Management (Frontend)
- **Web Apps:** Use centralized state management (e.g., Context API, Redux, or Zustand) for user sessions and UI state. Avoid prop-drilling.
- **Games:** Implement a strict Game State Machine (e.g., Menu -> Playing -> Paused -> Game Over). Always serialize game save data into JSON before storing.

## 3. Database & Storage (Backend)
- **NoSQL Schema:** When designing Firebase or similar NoSQL databases, prefer flat data structures. Avoid deep nesting (max 2 levels deep).
- **Asset Storage:** Always store heavy user uploads or game assets (images, audio, 3D models) in cloud storage (e.g., Cloudflare R2). Never store base64 strings directly in the database. 
- Save the absolute CDN URL of the asset in the database.

## 4. Edge Cases
- If the database connection fails or drops offline, implement a fallback to save critical data (like game progress or form inputs) to `localStorage` and sync when online.