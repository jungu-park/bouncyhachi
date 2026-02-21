import { db } from './firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';

export interface VibeItem {
    id?: string;
    name: string;
    category: 'Blog' | 'Tools' | 'Games' | 'Fortune' | 'Promotion';
    description?: string;
    imageUrl?: string;
    linkUrl?: string; // For games or tools
    createdAt: Timestamp;
}

export const getItems = async (): Promise<VibeItem[]> => {
    const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VibeItem));
};

export const getItemById = async (id: string): Promise<VibeItem | null> => {
    const docRef = doc(db, 'items', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as VibeItem;
    }
    return null;
};

export const addItem = async (item: Omit<VibeItem, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'items'), {
        ...item,
        createdAt: Timestamp.now()
    });
    return docRef.id;
};

export const updateItem = async (id: string, updates: Partial<Omit<VibeItem, 'id'>>): Promise<void> => {
    const docRef = doc(db, 'items', id);
    await updateDoc(docRef, updates);
};

export const deleteItem = async (id: string): Promise<void> => {
    const docRef = doc(db, 'items', id);
    await deleteDoc(docRef);
};
