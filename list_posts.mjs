import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import fs from 'fs';

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w]+)\s*=\s*["']?([^"']*)["']?/);
    if (match) env[match[1]] = match[2];
});

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
    const q = query(collection(db, 'items'));
    const snap = await getDocs(q);
    console.log(`\nFound ${snap.size} documents in 'items' collection.\n`);
    
    snap.forEach(doc => {
        const data = doc.data();
        console.log("ID:", doc.id);
        console.log("Category:", data.category);
        console.log("Title (ko):", data.name_ko || 'N/A');
        console.log("Title (en):", data.name_en || 'N/A');
        console.log("Created At:", data.createdAt ? data.createdAt.toDate() : 'N/A');
        console.log("-----------------------------------");
    });
} catch (err) {
    console.error("Error fetching documents:", err);
}
process.exit(0);
