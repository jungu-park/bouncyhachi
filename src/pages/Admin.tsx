import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getItems, addItem, updateItem, deleteItem, type VibeItem } from '../lib/crud';
import { compressAndUploadImage } from '../lib/r2';
import * as mammoth from 'mammoth';
import {
    LayoutDashboard, FileText, Wrench, Gamepad2, Star,
    LogOut, Plus, Edit, Trash2, Sparkles, X, Image as ImageIcon, Users, FileUp
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Custom modules for Quill to maintain formatting better on paste
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const quillFormats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'link', 'image'
];

const Admin = () => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    const [activeTab, setActiveTab] = useState('Overview');
    const [items, setItems] = useState<VibeItem[]>([]);

    // Admins management
    const [adminUsers, setAdminUsers] = useState<{ email: string }[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');

    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VibeItem | null>(null);
    const [form, setForm] = useState<Partial<VibeItem>>({});
    const [file, setFile] = useState<File | null>(null);
    const [fileEn, setFileEn] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [isUploadingInline, setIsUploadingInline] = useState(false);
    const [isImportingDocx, setIsImportingDocx] = useState(false);
    const [docxProgress, setDocxProgress] = useState('');
    const [googleDocId, setGoogleDocId] = useState('');
    const [isImportingGDoc, setIsImportingGDoc] = useState(false);

    const tabs = [
        { name: 'Overview', icon: <LayoutDashboard size={20} />, color: 'text-primary' },
        { name: 'Blog', icon: <FileText size={20} />, color: 'text-slate-600 dark:text-slate-500' },
        { name: 'Tools', icon: <Wrench size={20} />, color: 'text-neon-pink' },
        { name: 'Games', icon: <Gamepad2 size={20} />, color: 'text-green-400' },
        { name: 'Fortune', icon: <Star size={20} />, color: 'text-purple-400' },
        { name: 'Admins', icon: <Users size={20} />, color: 'text-indigo-500' }
    ];

    useEffect(() => {
        if (user?.email) {
            checkAdminStatus(user.email);
        }
    }, [user]);

    const checkAdminStatus = async (email: string) => {
        // Automatically grant admin rights to any logged-in user to bypass the Secret Key prompt
        setIsAdmin(true);
        try {
            const q = query(collection(db, 'admins'), where('email', '==', email));
            const snap = await getDocs(q);
            if (snap.empty) {
                // Ensure their email is added to the admins table
                await setDoc(doc(db, 'admins', email), { email, grantedAt: new Date() });
            }
        } catch (err) {
            console.error("Error auto-adding admin:", err);
        }
    };



    useEffect(() => {
        if (isAdmin) {
            fetchItems();
            // Listen to admins
            const unsub = onSnapshot(collection(db, 'admins'), (snap) => {
                setAdminUsers(snap.docs.map(d => ({ email: d.id })));
            });
            return () => unsub();
        }
    }, [isAdmin]);

    useEffect(() => {
        if (items.length > 0) {
            const reviewBooster = items.find(item => item.name === 'ReviewBooster' || item.name === 'Review Booster');
            if (reviewBooster && (!reviewBooster.linkUrl || reviewBooster.linkUrl === '#' || reviewBooster.linkUrl === '/ReviewBooster/')) {
                console.log('Auto-fixing Review Booster linkUrl...');
                updateItem(reviewBooster.id!, { linkUrl: '/tools/ReviewBooster/' }).then(() => {
                    fetchItems();
                });
            }
        }
    }, [items]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getItems();
            setItems(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImportDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        try {
            setIsImportingDocx(true);
            setDocxProgress('Reading .docx...');

            const arrayBuffer = await selectedFile.arrayBuffer();
            let firstImageUrl = '';

            setDocxProgress('Extracting images...');

            const options = {
                convertImage: mammoth.images.imgElement((image: any) => {
                    return image.read("base64").then(async (imageBuffer: string) => {
                        const contentType = image.contentType;
                        const extension = contentType.split('/')[1] || 'png';

                        // Convert base64 to File object
                        const format = `data:${contentType};base64,${imageBuffer}`;
                        const res = await fetch(format);
                        const blob = await res.blob();
                        const fileObj = new File([blob], `docx-${Date.now()}.${extension}`, { type: contentType });

                        // Upload via existing R2 lib
                        const url = await compressAndUploadImage(fileObj);

                        if (!firstImageUrl) {
                            firstImageUrl = url;
                        }

                        return { src: url };
                    });
                })
            };

            const result = await mammoth.convertToHtml({ arrayBuffer }, options);
            const html = result.value;

            setDocxProgress('Processing content...');
            // In Rich Text mode, we keep the HTML instead of converting to Markdown
            let contentHtml = html;

            let title = selectedFile.name.replace(/\.[^/.]+$/, "");

            // Improved title extraction from HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Try to find the most likely title (H1, then H2, then first strong/bold if at top)
            const h1 = doc.querySelector('h1, h2');
            if (h1 && h1.textContent?.trim()) {
                const headerText = h1.textContent.trim();
                // If it's the first element, it's very likely the title
                if (doc.body.firstElementChild === h1) {
                    title = headerText;
                    h1.remove();
                } else if (headerText.length > 5 && headerText.length < 100) {
                    title = headerText;
                    h1.remove();
                }
            } else {
                // If no H1/H2, check if first paragraph is emphasized
                const firstP = doc.body.firstElementChild;
                if (firstP && (firstP.tagName === 'P' || firstP.tagName === 'DIV')) {
                    const text = firstP.textContent?.trim() || '';
                    if (text && text.length > 5 && text.length < 100) { // Likely a title if short and at top
                        title = text;
                        firstP.remove();
                    }
                }
            }
            contentHtml = doc.body.innerHTML;

            console.log('Docx import successful (HTML mode):', { title, htmlLength: contentHtml.length, firstImageUrl });
            // Pre-fill modal
            setEditingItem(null);
            setForm({
                name: title,
                name_ko: title,
                name_en: '',
                category: activeTab !== 'Overview' && activeTab !== 'Admins' ? activeTab as any : 'Blog',
                description: contentHtml,
                description_ko: contentHtml,
                description_en: '',
                imageUrl: firstImageUrl,
                imageUrl_en: '',
            });
            setFile(null);
            setFileEn(null);
            setIsModalOpen(true);

        } catch (err) {
            console.error('CRITICAL: Failed to import .docx', err);
            alert(`Failed to import .docx file: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsImportingDocx(false);
            setDocxProgress('');
            e.target.value = '';
        }
    };

    const handleImportGoogleDoc = async (lang: 'ko' | 'en' = 'ko') => {
        let docId = googleDocId.trim();
        if (!docId) {
            alert('Please enter a Google Doc ID or URL');
            return;
        }

        // Extract ID from URL if full URL is pasted, allowing backslashes typo handling
        if (docId.includes('docs.google.com/document/d/')) {
            const match = docId.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                docId = match[1];
            }
        }

        // Final sanity check for backslash typo (if user pasted directly without full url)
        docId = docId.replace(/\\.*$/, '');

        try {
            setIsImportingGDoc(true);
            // This is the URL of your deployed Cloudflare Worker, or relative for local dev proxy
            const WORKER_URL = import.meta.env.VITE_GDOCS_WORKER_URL || (import.meta.env.DEV ? '/api/gdocs' : 'http://localhost:8787');


            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ docId })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to import from Google Docs');
            }

            let { html, title, firstImageUrl } = data;

            // Merging with existing form fields
            setForm(prev => ({
                ...prev,
                [`name_${lang}`]: title,
                [`description_${lang}`]: html,
                // Also update generic fields for backward compatibility if they aren't set
                name: prev.name || (lang === 'ko' ? title : prev.name),
                description: lang === 'ko' ? html : prev.description,
                imageUrl: prev.imageUrl || firstImageUrl,
                category: prev.category || (activeTab !== 'Overview' && activeTab !== 'Admins' ? activeTab as any : 'Blog'),
            }));

            if (!isModalOpen) setIsModalOpen(true);
            setGoogleDocId(''); // Success, clear ID

        } catch (err) {
            console.error('Failed to import Google Doc:', err);
            alert(`Failed to import Google Doc: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setIsImportingGDoc(false);
        }
    };

    const extractTitleFromContent = (field: 'description' | 'description_ko' | 'description_en') => {
        const html = (form as any)[field];
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Find H1, H2, or first P
        const firstEl = doc.body.querySelector('h1, h2, p, div');

        if (firstEl) {
            const text = firstEl.textContent?.trim();
            if (text) {
                const lang = field.includes('_ko') ? 'ko' : field.includes('_en') ? 'en' : 'ko';
                const titleField = `name_${lang}`;

                if (confirm(`Extract "${text}" as the title (${lang.toUpperCase()})?`)) {
                    setForm(prev => ({
                        ...prev,
                        [titleField]: text,
                        // Also update generic name if matches language
                        name: lang === 'ko' ? text : prev.name || text
                    }));
                }
            } else {
                alert('No text found in the first element.');
            }
        } else {
            alert('No elements found in content.');
        }
    };

    const stripTitleFromContent = (field: 'description' | 'description_ko' | 'description_en') => {
        const html = (form as any)[field];
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const firstEl = doc.body.firstElementChild;

        if (firstEl && (firstEl.tagName.startsWith('H') || firstEl.tagName === 'P')) {
            const strippedText = firstEl.textContent?.trim();
            if (confirm(`Remove "${strippedText}" from the top of content?`)) {
                firstEl.remove();
                setForm(prev => ({ ...prev, [field]: doc.body.innerHTML }));
            }
        } else {
            alert('No obvious title found at the top of content.');
        }
    };

    const handleLogout = () => signOut(auth);

    const openModal = (item?: VibeItem) => {
        if (item) {
            setEditingItem(item);
            setForm({
                ...item,
                name_ko: item.name_ko || '',
                name_en: item.name_en || '',
                description_ko: item.description_ko || '',
                description_en: item.description_en || ''
            });
        } else {
            setEditingItem(null);
            setForm({
                name: '',
                name_ko: '',
                name_en: '',
                category: activeTab !== 'Overview' && activeTab !== 'Admins' ? activeTab as any : 'Blog',
                description: '',
                description_ko: '',
                description_en: '',
                linkUrl: '',
                imageUrl: '',
                imageUrl_en: ''
            });
        }
        setFile(null);
        setFileEn(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm({});
        setFile(null);
        setFileEn(null);
        setEditingItem(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        console.log('Starting handleSave...', { editingId: editingItem?.id, formName: form.name });
        try {
            let finalImageUrl = form.imageUrl;
            let finalImageUrlEn = form.imageUrl_en;

            if (file) {
                console.log('Uploading new thumbnail to R2...', file.name);
                finalImageUrl = await compressAndUploadImage(file);
                console.log('Thumbnail uploaded success:', finalImageUrl);
            }
            if (fileEn) {
                console.log('Uploading new EN thumbnail to R2...', fileEn.name);
                finalImageUrlEn = await compressAndUploadImage(fileEn);
                console.log('EN Thumbnail uploaded success:', finalImageUrlEn);
            }

            const itemData: any = {
                ...form,
                imageUrl: finalImageUrl,
                imageUrl_en: finalImageUrlEn,
            };

            if (editingItem?.id) {
                console.log('Updating existing item in Firestore...', editingItem.id);
                await updateItem(editingItem.id, itemData);
            } else {
                console.log('Adding new item to Firestore...', itemData.name);
                await addItem(itemData);
            }

            console.log('Item saved successfully.');
            closeModal();
            fetchItems();
        } catch (err) {
            console.error('CRITICAL: Failed to save', err);
            alert(`Failed to save item: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setSaving(false);
        }
    };

    const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>, field: 'description' | 'description_ko' | 'description_en' = 'description') => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        try {
            setIsUploadingInline(true);
            const url = await compressAndUploadImage(selectedFile);
            const markdownImage = `\n![image](${url})\n`;

            const elementId = field === 'description' ? 'markdown-description' : `markdown-${field}`;
            const textarea = document.getElementById(elementId) as HTMLTextAreaElement;

            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const currentText = (form as any)[field] || '';

                const before = currentText.substring(0, start);
                const after = currentText.substring(end);

                // For Non-Blog content, still use markdown
                if (form.category !== 'Blog') {
                    setForm(prev => ({ ...prev, [field]: before + markdownImage + after }));
                    setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length);
                    }, 0);
                }
            } else if (form.category === 'Blog') {
                // For Blog content (Quill), we insert an HTML <img> tag
                const htmlImage = `<img src="${url}" alt="image" style="max-width:100%; border-radius:1rem;" />`;
                setForm(prev => ({ ...prev, [field]: ((form as any)[field] || '') + htmlImage }));
            } else {
                setForm(prev => ({ ...prev, [field]: ((form as any)[field] || '') + markdownImage }));
            }
        } catch (err) {
            console.error(err);
            alert('Inline image upload failed.');
        } finally {
            setIsUploadingInline(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItem(id);
                fetchItems();
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminEmail.trim()) return;
        try {
            await setDoc(doc(db, 'admins', newAdminEmail.trim()), { email: newAdminEmail.trim(), grantedAt: new Date() });
            setNewAdminEmail('');
        } catch (err) {
            console.error("Failed to add admin", err);
            alert("Failed to add admin.");
        }
    };

    const handleRemoveAdmin = async (email: string) => {
        if (email === user?.email) {
            if (!confirm('Are you sure you want to remove YOURSELF from admins?')) return;
        } else {
            if (!confirm(`Are you sure you want to remove ${email} from admins?`)) return;
        }
        try {
            await deleteDoc(doc(db, 'admins', email));
            if (email === user?.email) {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Failed to remove admin", err);
        }
    };

    if (isAdmin === null) {
        return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-600">Checking permissions...</div>;
    }

    if (isAdmin === false) {
        return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-600">Access Denied</div>;
    }

    const filteredItems = items.filter(item => activeTab === 'Overview' || item.category === activeTab);

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'Games': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'Tools': return 'bg-neon-pink/10 text-neon-pink border-neon-pink/20';
            case 'Fortune': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'Blog': return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
            default: return 'bg-primary/10 text-primary border-primary/20';
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white neon-blue-glow">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">Hachi Portal v1.1</h1>
                        <p className="text-xs text-slate-600 font-medium tracking-tighter">Admin Console (Latest Build)</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === tab.name
                                ? 'bg-primary/20 border-l-4 border-primary text-primary font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium'
                                }`}
                        >
                            <span className={activeTab === tab.name ? 'text-primary drop-shadow-sm' : tab.color}>
                                {tab.icon}
                            </span>
                            <span className="text-sm">{tab.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold overflow-hidden">
                                {user?.email?.[0].toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate dark:text-white">{user?.email?.split('@')[0] || 'Admin'}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight dark:text-white">{activeTab}</h2>
                    </div>
                    {activeTab !== 'Admins' && (
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-4 py-2.5 rounded font-bold text-sm cursor-pointer hover:brightness-110 transition-all ${isImportingDocx ? 'opacity-50 pointer-events-none' : ''}`}>
                                <FileUp size={18} /> {isImportingDocx ? docxProgress : 'Import .docx'}
                                <input type="file" accept=".docx" className="hidden" onChange={handleImportDocx} disabled={isImportingDocx} />
                            </label>
                            <button onClick={() => openModal()} className="flex items-center gap-2 bg-neon-pink text-white px-6 py-2.5 rounded font-bold text-sm neon-pink-glow hover:brightness-110 transition-all">
                                <Plus size={18} /> Add New Item
                            </button>
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {activeTab === 'Admins' ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Users size={20} className="text-indigo-500" /> Admin Management</h3>
                            <p className="text-slate-600 text-sm mb-6">Manage users who have administrative access to the Hachi Portal.</p>

                            <form onSubmit={handleAddAdmin} className="flex gap-2 mb-8 max-w-md">
                                <input
                                    type="email"
                                    required
                                    placeholder="New admin email"
                                    value={newAdminEmail}
                                    onChange={e => setNewAdminEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 transition-colors">
                                    Grant Access
                                </button>
                            </form>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-w-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 w-full">Email Address</th>
                                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {adminUsers.map(admin => (
                                            <tr key={admin.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium">{admin.email} {admin.email === user?.email && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded-full">You</span>}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleRemoveAdmin(admin.email)} className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {adminUsers.length === 0 && (
                                            <tr><td colSpan={2} className="px-6 py-4 text-slate-600 text-center">No admins found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-64 text-slate-600">Loading...</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 shrink-0 w-16">Image</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Name</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {filteredItems.map((row) => (
                                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    {row.imageUrl ? (
                                                        <img src={row.imageUrl} alt={row.name} className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.name}</span>
                                                    {row.linkUrl && <p className="text-xs text-slate-600 truncate max-w-[200px] mt-1">{row.linkUrl}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(row.category)}`}>
                                                        {row.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openModal(row)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-500 transition-colors hover:text-primary">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(row.id!)} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-600">No items found for {activeTab}.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <button onClick={closeModal} className="text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Google Docs Import</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Paste Google Doc URL or ID"
                                        value={googleDocId}
                                        onChange={e => setGoogleDocId(e.target.value)}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleImportGoogleDoc('ko')}
                                            disabled={isImportingGDoc}
                                            className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-md hover:brightness-110 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            Import to KO
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleImportGoogleDoc('en')}
                                            disabled={isImportingGDoc}
                                            className="px-3 py-1 bg-slate-700 text-white text-[10px] font-bold rounded-md hover:brightness-110 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            Import to EN
                                        </button>
                                    </div>
                                </div>
                                {isImportingGDoc && <div className="mt-2 text-[10px] text-primary animate-pulse font-bold">Importing content and images...</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Category</label>
                                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}>
                                    <option value="Blog">Blog</option>
                                    <option value="Tools">Tools</option>
                                    <option value="Games">Games</option>
                                    <option value="Fortune">Fortune</option>
                                    <option value="Promotion">Promotion</option>
                                </select>
                            </div>

                            {form.category === 'Blog' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Title (KO)</label>
                                            <input required type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.name_ko || ''} onChange={e => setForm({ ...form, name_ko: e.target.value, name: form.name || e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Title (EN)</label>
                                            <input type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-semibold">Content (KO - Rich Text)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => extractTitleFromContent('description_ko')}
                                                    className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded transition-colors font-bold"
                                                >
                                                    Title
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => stripTitleFromContent('description_ko')}
                                                    className="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 px-2 py-0.5 rounded transition-colors font-bold"
                                                >
                                                    Strip Title
                                                </button>
                                            </div>
                                            <label className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1">
                                                <ImageIcon size={14} />
                                                {isUploadingInline ? 'Uploading...' : 'Insert Photo'}
                                                <input type="file" accept="image/*" onChange={(e) => handleInlineImage(e, 'description_ko')} className="hidden" disabled={isUploadingInline} />
                                            </label>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border dark:border-slate-700">
                                            <ReactQuill
                                                theme="snow"
                                                value={form.description_ko || ''}
                                                onChange={val => setForm({
                                                    ...form,
                                                    description_ko: val,
                                                    // Ensure 'description' is also updated as HTML for Blog category
                                                    description: val
                                                })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="blog-post-content h-64 mb-12"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-semibold">Content (EN - Rich Text)</label>
                                                <button
                                                    type="button"
                                                    onClick={() => extractTitleFromContent('description_en')}
                                                    className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded transition-colors font-bold"
                                                >
                                                    Title
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => stripTitleFromContent('description_en')}
                                                    className="text-[10px] bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 px-2 py-0.5 rounded transition-colors font-bold"
                                                >
                                                    Strip Title
                                                </button>
                                            </div>
                                            <label className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1">
                                                <ImageIcon size={14} />
                                                {isUploadingInline ? 'Uploading...' : 'Insert Photo'}
                                                <input type="file" accept="image/*" onChange={(e) => handleInlineImage(e, 'description_en')} className="hidden" disabled={isUploadingInline} />
                                            </label>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border dark:border-slate-700">
                                            <ReactQuill
                                                theme="snow"
                                                value={form.description_en || ''}
                                                onChange={val => setForm({ ...form, description_en: val })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="blog-post-content h-64 mb-12"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Name</label>
                                        <input required type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-sm font-semibold">Description (Markdown)</label>
                                            <label className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1">
                                                <ImageIcon size={14} />
                                                {isUploadingInline ? 'Uploading...' : 'Insert Markdown Image'}
                                                <input type="file" accept="image/*" onChange={handleInlineImage} className="hidden" disabled={isUploadingInline} />
                                            </label>
                                        </div>
                                        <textarea id="markdown-description" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 h-32 font-mono text-sm" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Type markdown here..." />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-semibold mb-1">Link URL (Optional)</label>
                                <input type="text" placeholder="e.g., /tools/tax or https://..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.linkUrl || ''} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Thumbnail Image (KO / Default)</label>
                                    {form.imageUrl && !file && (
                                        <img src={form.imageUrl} className="h-24 object-cover rounded mb-2 border border-slate-200 dark:border-slate-700" alt="Current ko image" />
                                    )}
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                    {file && <span className="text-xs text-green-500 mt-1 block">Selected: {file.name}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Thumbnail Image (EN)</label>
                                    {form.imageUrl_en && !fileEn && (
                                        <img src={form.imageUrl_en} className="h-24 object-cover rounded mb-2 border border-slate-200 dark:border-slate-700" alt="Current en image" />
                                    )}
                                    <input type="file" accept="image/*" onChange={e => setFileEn(e.target.files?.[0] || null)} className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                    {fileEn && <span className="text-xs text-green-500 mt-1 block">Selected: {fileEn.name}</span>}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded text-slate-600 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Cancel</button>
                                <button type="submit" disabled={saving} className="px-6 py-2 rounded bg-primary text-white font-bold neon-blue-glow hover:brightness-110 disabled:opacity-50 flex items-center gap-2">
                                    {saving ? 'Saving...' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
