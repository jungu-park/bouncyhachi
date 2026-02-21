import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getItems, addItem, updateItem, deleteItem, type VibeItem } from '../lib/crud';
import { compressAndUploadImage } from '../lib/r2';
import * as mammoth from 'mammoth';
import TurndownService from 'turndown';
import {
    LayoutDashboard, FileText, Wrench, Gamepad2, Star,
    LogOut, Plus, Edit, Trash2, Sparkles, X, Image as ImageIcon, Users, FileUp
} from 'lucide-react';

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
    const [saving, setSaving] = useState(false);
    const [isUploadingInline, setIsUploadingInline] = useState(false);
    const [isImportingDocx, setIsImportingDocx] = useState(false);
    const [docxProgress, setDocxProgress] = useState('');

    const tabs = [
        { name: 'Overview', icon: <LayoutDashboard size={20} />, color: 'text-primary' },
        { name: 'Blog', icon: <FileText size={20} />, color: 'text-slate-600 dark:text-slate-400' },
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

            setDocxProgress('Converting format...');
            const turndownService = new TurndownService({ headingStyle: 'atx' });
            let markdown = turndownService.turndown(html);

            let title = selectedFile.name.replace(/\.[^/.]+$/, "");
            const lines = markdown.split('\n');
            const firstNonEmptyLineIndex = lines.findIndex((line: string) => line.trim().length > 0);

            if (firstNonEmptyLineIndex !== -1) {
                const firstLine = lines[firstNonEmptyLineIndex].trim();
                // If it looks like a heading, use it as title and remove it
                if (firstLine.startsWith('# ') || firstLine.startsWith('## ')) {
                    title = firstLine.replace(/^#+\s*/, '').trim();
                    lines.splice(firstNonEmptyLineIndex, 1);
                    markdown = lines.join('\n').trim();
                } else if (firstLine.replace(/\*/g, '').trim().length > 0 && firstLine.length < 50) {
                    // Fallback, maybe the first line is simply strong or just text
                    title = firstLine.replace(/\*/g, '').trim();
                    lines.splice(firstNonEmptyLineIndex, 1);
                    markdown = lines.join('\n').trim();
                }
            }

            console.log('Docx import successful:', { title, markdownLength: markdown.length, firstImageUrl });
            // Pre-fill modal
            setEditingItem(null);
            setForm({
                name: title,
                category: activeTab !== 'Overview' && activeTab !== 'Admins' ? activeTab as any : 'Blog',
                description: markdown,
                imageUrl: firstImageUrl,
            });
            setFile(null);
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

    const handleLogout = () => signOut(auth);

    const openModal = (item?: VibeItem) => {
        if (item) {
            setEditingItem(item);
            setForm(item);
        } else {
            setEditingItem(null);
            setForm({
                name: '', category: activeTab !== 'Overview' && activeTab !== 'Admins' ? activeTab as any : 'Blog', description: '', linkUrl: '', imageUrl: ''
            });
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm({});
        setFile(null);
        setEditingItem(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        console.log('Starting handleSave...', { editingId: editingItem?.id, formName: form.name });
        try {
            let finalImageUrl = form.imageUrl;

            if (file) {
                console.log('Uploading new thumbnail to R2...', file.name);
                finalImageUrl = await compressAndUploadImage(file);
                console.log('Thumbnail uploaded success:', finalImageUrl);
            }

            const itemData: any = {
                ...form,
                imageUrl: finalImageUrl,
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

    const handleInlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        try {
            setIsUploadingInline(true);
            const url = await compressAndUploadImage(selectedFile);
            setForm(prev => ({ ...prev, description: (prev.description || '') + `\n![image](${url})\n` }));
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
        return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Checking permissions...</div>;
    }

    if (isAdmin === false) {
        return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Access Denied</div>;
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
                        <p className="text-xs text-slate-500 font-medium tracking-tighter">Admin Console (Latest Build)</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${activeTab === tab.name
                                ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                                }`}
                        >
                            <span className={activeTab === tab.name ? 'text-primary' : tab.color}>
                                {tab.icon}
                            </span>
                            <span className="text-sm">{tab.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold overflow-hidden">
                                {user?.email?.[0].toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate dark:text-white">{user?.email?.split('@')[0] || 'Admin'}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
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
                            <p className="text-slate-500 text-sm mb-6">Manage users who have administrative access to the Hachi Portal.</p>

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
                                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 w-full">Email Address</th>
                                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {adminUsers.map(admin => (
                                            <tr key={admin.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-medium">{admin.email} {admin.email === user?.email && <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded-full">You</span>}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleRemoveAdmin(admin.email)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {adminUsers.length === 0 && (
                                            <tr><td colSpan={2} className="px-6 py-4 text-slate-500 text-center">No admins found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-64 text-slate-500">Loading...</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 w-16">Image</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Name</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {filteredItems.map((row) => (
                                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    {row.imageUrl ? (
                                                        <img src={row.imageUrl} alt={row.name} className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                            <ImageIcon size={16} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.name}</span>
                                                    {row.linkUrl && <p className="text-xs text-slate-500 truncate max-w-[200px] mt-1">{row.linkUrl}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(row.category)}`}>
                                                        {row.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => openModal(row)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors hover:text-primary">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(row.id!)} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-500">No items found for {activeTab}.</td>
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
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Name</label>
                                <input required type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
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

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-semibold">Description (Markdown)</label>
                                    <label className="text-xs font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1">
                                        <ImageIcon size={14} />
                                        {isUploadingInline ? 'Uploading...' : 'Insert Markdown Image'}
                                        <input type="file" accept="image/*" onChange={handleInlineImage} className="hidden" disabled={isUploadingInline} />
                                    </label>
                                </div>
                                <textarea className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 h-32 font-mono text-sm" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Type markdown here... You can embed images via the button above." />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Link URL (Optional)</label>
                                <input type="url" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-primary/50" value={form.linkUrl || ''} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Thumbnail Image</label>
                                {form.imageUrl && !file && (
                                    <img src={form.imageUrl} className="h-24 object-cover rounded mb-2 border border-slate-200 dark:border-slate-700" alt="Current image" />
                                )}
                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                                {file && <span className="text-xs text-green-500 mt-1 block">New file selected: {file.name} (Will be compressed to Cloudflare R2)</span>}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">Cancel</button>
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
