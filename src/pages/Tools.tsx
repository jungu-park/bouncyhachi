import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, ExternalLink } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';

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
            <div className="text-center mb-16">
                <div className="w-20 h-20 mx-auto bg-neon-pink/10 rounded-2xl flex items-center justify-center text-neon-pink mb-6 neon-border-pink">
                    <Wrench size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight dark:text-white">
                    {t.cards.tools.title}
                </h1>
                <p className="text-lg text-slate-700 dark:text-slate-500 max-w-lg mx-auto">
                    {t.cards.tools.desc}
                </p>
            </div>
            <div className="w-full">
                {loading ? (
                    <div className="text-center text-slate-700 py-12">Loading tools...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center max-w-2xl mx-auto">
                        <p className="text-slate-700 dark:text-slate-500 font-medium">Coming Soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map(item => (
                            <a
                                key={item.id}
                                href={item.linkUrl || '#'}
                                target={item.linkUrl?.startsWith('http') ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <Wrench size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full flex items-center justify-center text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink size={18} />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold mb-2 dark:text-white group-hover:text-neon-pink transition-colors">{item.name}</h2>
                                    <p className="text-sm text-slate-700 line-clamp-3 flex-1">{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
