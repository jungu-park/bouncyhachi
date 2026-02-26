import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, ExternalLink } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { motion } from 'framer-motion';

const Tools = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.filter(item => item.category === 'Tools'));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col items-center justify-start py-24 px-4 w-full max-w-6xl mx-auto">
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
                        background: 'rgba(255,46,136,0.12)',
                        border: '1px solid rgba(255,46,136,0.25)',
                        color: '#ff2e88',
                        boxShadow: '0 0 24px rgba(255,46,136,0.25)',
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                    <Wrench size={40} />
                </motion.div>

                <motion.h1
                    className="subpage-hero-title text-4xl md:text-5xl mb-4"
                    style={{ backgroundImage: 'linear-gradient(135deg, #ff2e88, #f472b6)' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
                >
                    {t.cards.tools.title}
                </motion.h1>

                <motion.p
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.tools.desc}
                </motion.p>
            </motion.div>

            {/* ── Content Glass Wrapper ── */}
            <motion.div
                className="subpage-glass-wrapper w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            >
                {loading ? (
                    <div className="text-center text-slate-500 py-12 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ff2e88', borderTopColor: 'transparent' }}></div>
                        Loading tools...
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center max-w-2xl mx-auto">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Coming Soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                            <a
                                key={item.id}
                                href={item.linkUrl || '#'}
                                target={item.linkUrl?.startsWith('http') ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="vibe-item-card group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col"
                            >
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <Wrench size={48} />
                                        </div>
                                    )}
                                    {/* Pink top accent on hover */}
                                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#ff2e88' }}>
                                        <ExternalLink size={18} />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2
                                        className="text-xl font-bold mb-2 text-slate-800 dark:text-white transition-colors"
                                        style={{}}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#ff2e88')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '')}
                                    >{item.name}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Tools;
