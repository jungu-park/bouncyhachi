import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, ExternalLink } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Tools = () => {
    const { t, lang } = useLanguage();
    const [items, setItems] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setItems(data.filter(item => item.category === 'Tools'));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <main className="flex flex-col items-center justify-start py-24 px-4 w-full max-w-6xl mx-auto">
            <SEO
                title={`${t.cards.tools.title} - 바운시하치 (BouncyHachi) 스마트 웹 툴`}
                description="일상적인 업무와 온라인 활동의 효율성을 극대화하는 다양한 무료 웹 툴을 만나보세요. 이미지 최적화, 텍스트 변환기, 보안 기능 등 번거로운 설치 과정 없이 웹상에서 바로 실행 가능한 스마트 도구들이 준비되어 있습니다."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "바운시하치 웹 툴스",
                    "description": "일상적인 업무와 온라인 활동의 효율성을 극대화하는 다양한 무료 웹 툴",
                    "url": "https://bouncyhachi.com/tools"
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
                    className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                >
                    {t.cards.tools.desc}
                </motion.p>

                {/* SEO Text Content */}
                <article className="prose prose-sm dark:prose-invert max-w-2xl mx-auto text-center text-slate-500 dark:text-slate-400">
                    <p>
                        바운시하치 웹 툴스(Web Tools)는 사용자 여러분의 소중한 시간과 노력을 절약해주는 생산성 솔루션입니다.
                        번거로운 소프트웨어 설치나 복잡한 설정 없이, 클릭 몇 번만으로 텍스트 처리, 개발 지원, 이미지 변환 등 다양한 작업을 직관적으로 수행할 수 있습니다.
                        브라우저 하나로 일상의 단순 작업을 빠르고 스마트하게 해결하는 최고의 경험을 누려보세요.
                    </p>
                </article>
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
                                    {(() => {
                                        const thumbUrl = (lang === 'en' && item.imageUrl_en) ? item.imageUrl_en : item.imageUrl;
                                        return thumbUrl ? (
                                            <img src={thumbUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <Wrench size={48} />
                                            </div>
                                        );
                                    })()}
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
                                    >{lang === 'ko' ? (item.name_ko || item.name) : (item.name_en || item.name)}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 flex-1">
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

export default Tools;
