import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Gamepad2, Play } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Games = () => {
    const { t, lang } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [recommendedGame, setRecommendedGame] = useState<any>(null);

    useEffect(() => {
        getItems().then(data => {
            const filtered = data.filter(item => item.category === 'Games');
            setItems(filtered);

            // Random recommendation from existing items or a preset
            if (filtered.length > 0) {
                setRecommendedGame(filtered[Math.floor(Math.random() * filtered.length)]);
            } else {
                const presets = [
                    {
                        id: 'puzzle',
                        name: "Hachi Puzzle",
                        name_ko: "하치 퍼즐",
                        description: "Slide the tiles and complete the cute Hachi picture!",
                        description_ko: "타일을 밀어서 귀여운 하치 그림을 완성하세요!",
                        linkUrl: "/games/puzzle/index.html",
                        color: "#22c55e"
                    },
                    {
                        id: 'bubble',
                        name: "Bubble Pop",
                        name_ko: "버블 팝",
                        description: "Pop the bubbles and reach the high score!",
                        description_ko: "버블을 터뜨리고 높은 점수를 기록하세요!",
                        linkUrl: "/games/bubble-pop/index.html",
                        color: "#3b82f6"
                    }
                ];
                setRecommendedGame(presets[Math.floor(Math.random() * presets.length)]);
            }
        }).finally(() => setLoading(false));
    }, []);

    return (
        <main className="flex flex-col items-center justify-start py-24 px-4 w-full max-w-6xl mx-auto">
            <SEO
                title={`${t.cards.games.title} - 바운시하치 (BouncyHachi) 무설치 브라우저 게임`}
                description="설치나 다운로드 과정 없이 웹 브라우저에서 바로 즐길 수 있는 HTML5 기반의 가벼운 무설치 아케이드 게임들을 만나보세요. 짧은 휴식 시간의 지루함을 날려버릴 수 있는 간단하고 직관적인 미니 게임 컬렉션입니다."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "바운시하치 아케이드",
                    "description": "설치나 다운로드 과정 없이 웹 브라우저에서 바로 즐길 수 있는 HTML5 기반의 가벼운 무설치 아케이드 게임들",
                    "url": "https://bouncyhachi.com/arcade"
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
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        color: '#22c55e',
                        boxShadow: '0 0 24px rgba(34,197,94,0.25)',
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                    <Gamepad2 size={40} />
                </motion.div>

                <motion.h1
                    className="subpage-hero-title text-4xl md:text-5xl mb-4"
                    style={{ backgroundImage: 'linear-gradient(135deg, #22c55e, #4ade80)' }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.55, ease: 'easeOut' }}
                >
                    {t.cards.games.title}
                </motion.h1>

                <motion.p
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.games.desc}
                </motion.p>
            </motion.div>

            {/* ── Recommendation Section ── */}
            {recommendedGame && (
                <motion.section
                    className="w-full mb-20 p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
                    style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(6,182,212,0.05))', border: '1px solid rgba(34,197,94,0.1)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest mb-4">
                            {lang === 'ko' ? "오늘의 추천 게임" : "Game Recommendation"}
                        </span>
                        <h2 className="text-3xl font-black mb-4 dark:text-white">
                            {lang === 'ko' ? (recommendedGame.name_ko || recommendedGame.name) : (recommendedGame.name_en || recommendedGame.name)}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                            {lang === 'ko' ? (recommendedGame.description_ko || recommendedGame.description) : (recommendedGame.description_en || recommendedGame.description)}
                        </p>
                        <button
                            onClick={() => {
                                if (recommendedGame.linkUrl && recommendedGame.linkUrl !== '#') {
                                    const isExternal = recommendedGame.linkUrl.startsWith('http');
                                    const isStatic = recommendedGame.linkUrl.startsWith('/games/');
                                    const link = isExternal || isStatic
                                        ? recommendedGame.linkUrl
                                        : `/${lang}${recommendedGame.linkUrl.startsWith('/') ? '' : '/'}${recommendedGame.linkUrl}`;

                                    if (isExternal) {
                                        window.open(link, '_blank');
                                    } else {
                                        window.location.href = link;
                                    }
                                }
                            }}
                            className="px-8 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Play size={18} fill="currentColor" /> {lang === 'ko' ? "지금 플레이" : "Play Now"}
                        </button>
                    </div>
                    <div className="w-full md:w-64 h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative group overflow-hidden shadow-inner">
                        {(() => {
                            const thumbUrl = (lang === 'en' && recommendedGame.imageUrl_en) ? recommendedGame.imageUrl_en : recommendedGame.imageUrl;
                            return thumbUrl ? (
                                <img src={thumbUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recommendedGame.name} />
                            ) : (
                                <Gamepad2 size={64} className="text-slate-400" />
                            );
                        })()}
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                </motion.section>
            )}

            {/* ── Content Grid ── */}
            <motion.div
                className="subpage-glass-wrapper w-full"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            >
                <div className="mb-8">
                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Play size={16} className="text-green-500 fill-current" />
                        </span>
                        {lang === 'ko' ? "모든 게임 둘러보기" : "Explore All Games"}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center text-slate-500 py-12 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }}></div>
                        Loading games...
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-center max-w-2xl mx-auto bg-slate-50/50 dark:bg-slate-900/20">
                        <p className="text-slate-500 dark:text-slate-400 font-black text-xl mb-2">🕹️ Games Coming Soon</p>
                        <p className="text-sm text-slate-400">최고의 무설치 게임들을 선별 중입니다. 잠시만 기다려 주세요!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => {
                            const isExternal = item.linkUrl?.startsWith('http');
                            const isStatic = item.linkUrl?.startsWith('/games/');
                            const link = item.linkUrl && item.linkUrl !== '#'
                                ? (isExternal || isStatic ? item.linkUrl : `/${lang}${item.linkUrl.startsWith('/') ? '' : '/'}${item.linkUrl}`)
                                : '#';

                            return (
                                <a
                                    key={item.id}
                                    href={link}
                                    target={isExternal ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="vibe-item-card group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col"
                                >
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {(() => {
                                            const thumbUrl = (lang === 'en' && item.imageUrl_en) ? item.imageUrl_en : item.imageUrl;
                                            return thumbUrl ? (
                                                <img src={thumbUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                    <Gamepad2 size={48} />
                                                </div>
                                            );
                                        })()}
                                        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-300" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center pl-1 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-green-500/50">
                                            <Play size={24} className="fill-current" />
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h2
                                            className="text-xl font-bold mb-2 text-slate-800 dark:text-white transition-colors"
                                        >{lang === 'ko' ? (item.name_ko || item.name) : (item.name_en || item.name)}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
                                            {lang === 'ko' ? (item.description_ko || item.description) : (item.description_en || item.description)}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </main>
    );
};

export default Games;
