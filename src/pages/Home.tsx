import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Wrench, Gamepad2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ui/ParticleBackground';
import SEO from '../components/SEO';


interface Card {
    to: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    accent: string;
    glowColor: string;
    gradientFrom: string;
    gradientTo: string;
}

const Home = () => {
    const { t, lang } = useLanguage();

    const cards: Card[] = [
        {
            to: `/${lang}/blog`,
            title: t.cards.blog.title,
            desc: t.cards.blog.desc,
            icon: <Sparkles className="w-7 h-7" />,
            accent: '#067ff9',
            glowColor: 'rgba(6,127,249,0.35)',
            gradientFrom: 'rgba(6,127,249,0.15)',
            gradientTo: 'rgba(6,127,249,0)',
        },
        {
            to: `/${lang}/tools`,
            title: t.cards.tools.title,
            desc: t.cards.tools.desc,
            icon: <Wrench className="w-7 h-7" />,
            accent: '#ff2e88',
            glowColor: 'rgba(255,46,136,0.35)',
            gradientFrom: 'rgba(255,46,136,0.15)',
            gradientTo: 'rgba(255,46,136,0)',
        },
        {
            to: `/${lang}/arcade`,
            title: t.cards.games.title,
            desc: t.cards.games.desc,
            icon: <Gamepad2 className="w-7 h-7" />,
            accent: '#22c55e',
            glowColor: 'rgba(34,197,94,0.35)',
            gradientFrom: 'rgba(34,197,94,0.15)',
            gradientTo: 'rgba(34,197,94,0)',
        },
        {
            to: `/${lang}/fortune`,
            title: t.cards.fortune.title,
            desc: t.cards.fortune.desc,
            icon: <Star className="w-7 h-7" />,
            accent: '#a855f7',
            glowColor: 'rgba(168,85,247,0.35)',
            gradientFrom: 'rgba(168,85,247,0.15)',
            gradientTo: 'rgba(168,85,247,0)',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    return (
        <main className="relative min-h-screen">
            <SEO
                title="바운시하치 (BouncyHachi) - 종합 유틸리티 및 무설치 웹 엔터테인먼트 플랫폼"
                description="바운시하치는 무료로 제공되는 다양한 웹 툴, 무설치 HTML5 아케이드 게임, 매일 확인하는 오늘의 운세, 그리고 유익한 블로그 포스팅을 한곳에 모은 종합 엔터테인먼트 플랫폼입니다. 별도의 다운로드 없이 브라우저에서 바로 즐겨보세요."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "BouncyHachi",
                    "url": "https://bouncyhachi.com/",
                    "description": "바운시하치는 무료로 제공되는 다양한 웹 툴, 무설치 HTML5 아케이드 게임, 매일 확인하는 오늘의 운세, 그리고 유익한 블로그 포스팅을 한곳에 모은 종합 엔터테인먼트 플랫폼입니다."
                }}
            />
            {/* Three.js particle layer */}
            <ParticleBackground />

            {/* Content layer */}
            <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">

                {/* Hero */}
                <motion.section
                    className="text-center py-20 px-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-semibold tracking-wide uppercase"
                        style={{ background: 'rgba(6,127,249,0.12)', border: '1px solid rgba(6,127,249,0.3)', color: '#067ff9' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI-Powered Creative Hub</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary via-neon-pink to-purple-500 bg-clip-text text-transparent uppercase">
                        {t.home.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        {t.home.subtitle}
                    </p>

                    {/* SEO / AdSense Content Text */}
                    <article className="prose dark:prose-invert max-w-4xl mx-auto mb-12 text-left text-slate-500 dark:text-slate-400">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t.home.introTitle}</h2>
                        <p className="mb-4">
                            {t.home.introP1}
                        </p>
                        <p className="mb-4">
                            {t.home.introP2}
                        </p>
                        <p>
                            {t.home.introP3}
                        </p>
                    </article>

                    <motion.div
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="inline-block"
                    >
                        <Link
                            to={`/${lang}/blog`}
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg text-white transition-all duration-300"
                            style={{
                                background: 'linear-gradient(135deg, #067ff9, #9333ea)',
                                boxShadow: '0 0 40px rgba(6,127,249,0.4), 0 0 80px rgba(147,51,234,0.2)',
                            }}
                        >
                            {t.home.explore}
                            <Sparkles className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </motion.section>

                {/* Card Grid */}
                <motion.section
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-20"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {cards.map((card) => (
                        <motion.div key={card.to} variants={cardVariants}>
                            <Link to={card.to} className="block w-full h-full outline-none group">
                                <motion.div
                                    className="glass-card flex flex-col p-9 rounded-3xl relative overflow-hidden h-full cursor-pointer"
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                    style={{
                                        backdropFilter: 'blur(18px)',
                                        WebkitBackdropFilter: 'blur(18px)',
                                    }}
                                >
                                    {/* Radial glow overlay — appears on hover */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                                        style={{
                                            background: `radial-gradient(circle at 30% 40%, ${card.gradientFrom} 0%, ${card.gradientTo} 70%)`,
                                        }}
                                    />
                                    {/* Top border accent */}
                                    <div
                                        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
                                    />

                                    {/* Icon */}
                                    <div
                                        className="light-icon-box mb-7 p-4 rounded-2xl inline-flex items-center justify-center w-14 h-14 relative z-10 pointer-events-none"
                                        style={{
                                            color: card.accent,
                                            boxShadow: `0 0 20px ${card.glowColor}`,
                                        }}
                                    >
                                        {card.icon}
                                    </div>

                                    <h3
                                        className="text-3xl font-black mb-3 relative z-10 tracking-tight text-slate-800 dark:text-white group-hover:text-white transition-colors duration-300 pointer-events-none"
                                    >
                                        {card.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed relative z-10 group-hover:text-slate-300 transition-colors duration-300 pointer-events-none">
                                        {card.desc}
                                    </p>

                                    {/* Arrow */}
                                    <div
                                        className="mt-6 flex items-center gap-2 text-sm font-semibold relative z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-400 pointer-events-none"
                                        style={{ color: card.accent }}
                                    >
                                        <span>Explore</span>
                                        <span>→</span>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.section>
            </div>
        </main>
    );
};

export default Home;
