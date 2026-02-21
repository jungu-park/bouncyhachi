import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, Wand2 } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';

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
            <div className="text-center mb-16">
                <div className="w-20 h-20 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/20">
                    <Star size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight dark:text-white">
                    {t.cards.fortune.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    {t.cards.fortune.desc}
                </p>
            </div>
            <div className="w-full">
                {loading ? (
                    <div className="text-center text-slate-500 py-12">Loading fortune...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center max-w-2xl mx-auto">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Coming Soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map(item => (
                            <a
                                key={item.id}
                                href={item.linkUrl || '#'}
                                target={item.linkUrl ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <Wand2 size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition-colors duration-300" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-bold shadow-lg">Start Reading</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col text-center">
                                    <h2 className="text-xl font-bold mb-2 dark:text-white group-hover:text-purple-400 transition-colors uppercase tracking-wider">{item.name}</h2>
                                    <p className="text-sm text-slate-500 line-clamp-3 mx-auto">{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fortune;
