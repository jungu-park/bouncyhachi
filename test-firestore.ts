import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDWH3a6VShScE-pthyXbejhGsPvCkOSZ0w",
    authDomain: "bouncyhachi.firebaseapp.com",
    projectId: "bouncyhachi",
    storageBucket: "bouncyhachi.firebasestorage.app",
    messagingSenderId: "213284840042",
    appId: "1:213284840042:web:d481617e231e75c924e013"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkItems() {
    try {
        console.log('Fetching items from Firestore...');
        const q = query(collection(db, 'items'), limit(10));
        const snap = await getDocs(q);
        if (snap.empty) {
            console.log('No items found in "items" collection.');
        }
        snap.forEach(doc => {
            const data = doc.data();
            console.log(`Item: ${data.name}, Category: ${data.category}, ImageURL: ${data.imageUrl}`);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

checkItems();
