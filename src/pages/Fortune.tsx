import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, Wand2 } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { motion } from 'framer-motion';

const Fortune = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.filter(item => item.category === 'Fortune'));
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
                        background: 'rgba(168,85,247,0.12)',
                        border: '1px solid rgba(168,85,247,0.25)',
                        color: '#a855f7',
                        boxShadow: '0 0 24px rgba(168,85,247,0.25)',
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                    <Star size={40} />
                </motion.div>

                <motion.h1
                    className="subpage-hero-title text-4xl md:text-5xl mb-4"
                    style={{ backgroundImage: 'linear-gradient(135deg, #a855f7, #c084fc)' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
                >
                    {t.cards.fortune.title}
                </motion.h1>

                <motion.p
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.fortune.desc}
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
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#a855f7', borderTopColor: 'transparent' }}></div>
                        Loading fortune...
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
                                className="vibe-item-card group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col relative"
                            >
                                {/* Purple top accent */}
                                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <Wand2 size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-300" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-bold shadow-lg shadow-purple-500/40">Start Reading</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col text-center">
                                    <h2
                                        className="text-xl font-bold mb-2 text-slate-800 dark:text-white transition-colors uppercase tracking-wider"
                                        onMouseEnter={e => (e.currentTarget.style.color = '#a855f7')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '')}
                                    >{item.name}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mx-auto">{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Fortune;
