import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Gamepad2, Play } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';

const Games = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.filter(item => item.category === 'Games'));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col items-center justify-start py-24 px-4 w-full max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 mb-6 shadow-[0_0_15px_rgba(74,222,128,0.3)] border border-green-500/20">
                    <Gamepad2 size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight dark:text-white">
                    {t.cards.games.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    {t.cards.games.desc}
                </p>
            </div>
            <div className="w-full">
                {loading ? (
                    <div className="text-center text-slate-500 py-12">Loading games...</div>
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
                                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <Gamepad2 size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center pl-1 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-green-500/50">
                                        <Play size={24} className="fill-current" />
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold mb-2 dark:text-white group-hover:text-green-500 transition-colors">{item.name}</h2>
                                    <p className="text-sm text-slate-500 line-clamp-3 flex-1">{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;
