import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
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
    const q = query(collection(db, 'items'), limit(10));
    const snap = await getDocs(q);
    snap.forEach(doc => {
        const data = doc.data();
        const content = data.description_ko || data.description || '';
        if (content.includes("ISA") || (data.name_ko && data.name_ko.includes("ISA"))) {
            console.log("\n=== MATCH FOUND ==============");
            console.log("ID:", doc.id);
            console.log("Title:", data.name_ko);
            console.log("Content Substring:", content.substring(0, 500));
        }
    });
} catch (err) {
    console.error(err);
}
process.exit(0);
