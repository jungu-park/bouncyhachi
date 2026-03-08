import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Star, Wand2 } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Fortune = () => {
    const { t, lang } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [dailyFortune, setDailyFortune] = useState<{ title: string, text: string, color: string } | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.filter(item => item.category === 'Fortune'));
        }).finally(() => setLoading(false));
    }, []);

    const fortunes = {
        ko: [
            { title: "대길 (Great Luck)", text: "오늘은 모든 일이 술술 풀리는 날입니다. 새로운 도전을 시작하기에 완벽한 타이밍이에요!", color: "#22c55e" },
            { title: "소길 (Small Luck)", text: "작은 기쁨들이 모여 행복한 하루를 만듭니다. 주변 사람들에게 따뜻한 말 한마디를 건네보세요.", color: "#3b82f6" },
            { title: "평온 (Peaceful)", text: "차분하게 하루를 정리하기 좋은 날입니다. 명상이나 독서로 내면을 채워보세요.", color: "#64748b" },
            { title: "지혜 (Wisdom)", text: "어려운 문제에 대한 해답을 찾게 될 것입니다. 직관을 믿고 나아가세요.", color: "#a855f7" },
            { title: "인연 (Connection)", text: "뜻밖의 장소에서 소중한 인연을 만날 수 있습니다. 열린 마음으로 사람들을 대하세요.", color: "#ec4899" },
            { title: "변화 (Change)", text: "지루한 일상에 새로운 바람이 불어옵니다. 변화를 두려워하지 말고 즐기세요.", color: "#f59e0b" },
        ],
        en: [
            { title: "Great Luck", text: "Everything will go smoothly today. It's the perfect timing to start a new challenge!", color: "#22c55e" },
            { title: "Small Luck", text: "Small joys will gather to make a happy day. Try giving a warm word to those around you.", color: "#3b82f6" },
            { title: "Peaceful", text: "A good day to organize your day calmly. Fill your inner self with meditation or reading.", color: "#64748b" },
            { title: "Wisdom", text: "You will find answers to difficult problems. Trust your intuition and move forward.", color: "#a855f7" },
            { title: "Connection", text: "You might meet a precious connection in an unexpected place. Treat people with an open mind.", color: "#ec4899" },
            { title: "Change", text: "A new wind blows into your boring daily life. Don't be afraid of change, enjoy it!", color: "#f59e0b" },
        ]
    };

    const getDailyFortune = () => {
        setIsThinking(true);
        setDailyFortune(null);

        // Use date as seed for "Daily" consistency
        const today = new Date().toDateString();
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }

        setTimeout(() => {
            const list = lang === 'ko' ? fortunes.ko : fortunes.en;
            const index = seed % list.length;
            setDailyFortune(list[index]);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <main className="flex flex-col items-center justify-start py-24 px-4 w-full max-w-6xl mx-auto">
            <SEO
                title={`${t.cards.fortune.title} - 바운시하치 (BouncyHachi) 오늘의 운세`}
                description="매일 아침 업데이트되는 바운시하치의 무료 운세 서비스로 하루를 기분 좋게 시작하세요. 재미로 보는 오늘의 운세부터 타로, 사주 등 다양한 형태의 운세 콘텐츠를 통해 일상의 활력을 충전할 수 있습니다."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "바운시하치 오늘의 운세",
                    "description": "매일 업데이트되는 무료 운세 서비스",
                    "url": "https://bouncyhachi.com/fortune"
                }}
            />
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
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.fortune.desc}
                </motion.p>
            </motion.div>

            {/* ── Daily Fortune Interaction ── */}
            <motion.section
                className="w-full max-w-2xl mb-24 p-8 glass-card rounded-3xl text-center relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

                <h2 className="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter">
                    {lang === 'ko' ? "✨ 오늘의 행운 확인하기" : "✨ Check Your Daily Luck"}
                </h2>

                <div className="min-h-[160px] flex items-center justify-center mb-8">
                    {isThinking ? (
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                            <p className="text-purple-500 font-bold animate-pulse">
                                {lang === 'ko' ? "우주의 기운을 모으는 중..." : "Gathering cosmic energy..."}
                            </p>
                        </div>
                    ) : dailyFortune ? (
                        <motion.div
                            className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-purple-200 dark:border-purple-900/50 w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="text-3xl font-black mb-3" style={{ color: dailyFortune.color }}>
                                {dailyFortune.title}
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                {dailyFortune.text}
                            </p>
                        </motion.div>
                    ) : (
                        <div className="text-slate-400 dark:text-slate-500 italic">
                            {lang === 'ko' ? "버튼을 눌러 오늘의 운세를 확인하세요." : "Click the button to reveal your fortune today."}
                        </div>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={getDailyFortune}
                    disabled={isThinking}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
                >
                    {lang === 'ko' ? "운세 보기" : "Reveal My Luck"}
                </motion.button>
            </motion.section>

            {/* ── Content Grid ── */}
            <motion.div
                className="subpage-glass-wrapper w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            >
                <div className="mb-10 flex items-center gap-3">
                    <Wand2 className="text-purple-500" />
                    <h2 className="text-2xl font-bold dark:text-white">
                        {lang === 'ko' ? "더 많은 운세 서비스" : "More Fortune Services"}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center text-slate-500 py-12 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#a855f7', borderTopColor: 'transparent' }}></div>
                        Loading fortune...
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center max-w-2xl mx-auto bg-slate-50/50 dark:bg-slate-900/20">
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">Coming Soon</p>
                        <p className="text-xs text-slate-400">다양한 타로와 사주 콘텐츠가 준비 중입니다.</p>
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
                                    >{lang === 'ko' ? (item.name_ko || item.name) : (item.name_en || item.name)}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mx-auto">
                                        {lang === 'ko' ? (item.description_ko || item.description) : (item.description_en || item.description)}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </motion.div>
        </main>
    );
};

export default Fortune;
