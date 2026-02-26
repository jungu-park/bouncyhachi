import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Blog = () => {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setPosts(data.filter(item => item.category === 'Blog'));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col items-center justify-start py-24 px-4 w-full">
            {/* ── Hero Section ── */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6"
                    style={{
                        background: 'rgba(6,127,249,0.12)',
                        border: '1px solid rgba(6,127,249,0.25)',
                        color: '#067ff9',
                        boxShadow: '0 0 24px rgba(6,127,249,0.25)',
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                    <FileText size={40} />
                </motion.div>

                <motion.h1
                    className="subpage-hero-title text-4xl md:text-5xl mb-4"
                    style={{ backgroundImage: 'linear-gradient(135deg, #067ff9, #60a5fa)' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
                >
                    {t.cards.blog.title}
                </motion.h1>

                <motion.p
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.blog.desc}
                </motion.p>
            </motion.div>

            {/* ── Content Glass Wrapper ── */}
            <motion.div
                className="subpage-glass-wrapper w-full max-w-5xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
                {loading ? (
                    <div className="text-center text-slate-500 py-12 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading posts...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
                        <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary opacity-50" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Coming Soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <Link
                                to={`/blog/${post.id}`}
                                key={post.id}
                                className="vibe-item-card group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col block"
                                style={{ '--glow': 'rgba(6,127,249,0.35)' } as React.CSSProperties}
                            >
                                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <FileText size={48} className="opacity-50" />
                                        </div>
                                    )}
                                    {/* Blue top accent on hover */}
                                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.name}
                                    </h2>
                                    <div className="text-sm text-slate-400 mb-4 mt-auto pt-4 flex items-center justify-between">
                                        <span>{post.createdAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        <span
                                            className="font-semibold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                            style={{ color: '#067ff9' }}
                                        >Read <ArrowRight size={14} /></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Blog;
