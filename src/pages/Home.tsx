import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Wrench, Gamepad2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { t } = useLanguage();

    const cards = [
        {
            to: '/blog',
            title: t.cards.blog.title,
            desc: t.cards.blog.desc,
            icon: <Sparkles className="w-8 h-8 text-primary" />,
            color: 'border-primary/20 hover:border-primary/50 hover:bg-primary/5',
            glow: 'neon-blue-glow'
        },
        {
            to: '/tools',
            title: t.cards.tools.title,
            desc: t.cards.tools.desc,
            icon: <Wrench className="w-8 h-8 text-neon-pink" />,
            color: 'border-neon-pink/20 hover:border-neon-pink/50 hover:bg-neon-pink/5',
            glow: 'neon-pink-glow'
        },
        {
            to: '/arcade',
            title: t.cards.games.title,
            desc: t.cards.games.desc,
            icon: <Gamepad2 className="w-8 h-8 text-green-500" />,
            color: 'border-green-500/20 hover:border-green-500/50 hover:bg-green-500/5',
            glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'
        },
        {
            to: '/fortune',
            title: t.cards.fortune.title,
            desc: t.cards.fortune.desc,
            icon: <Star className="w-8 h-8 text-purple-500" />,
            color: 'border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5',
            glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary via-neon-pink to-purple-500 bg-clip-text text-transparent transform hover:scale-105 transition duration-500">
                    {t.home.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
                    {t.home.subtitle}
                </p>
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                    {t.home.explore}
                    <Sparkles className="w-6 h-6 text-neon-pink" />
                </Link>
            </section>

            {/* Service Grid Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-20">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.to}
                        className={`flex flex-col p-8 md:p-10 rounded-3xl border bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${card.color} group relative overflow-hidden`}
                    >
                        {/* Background decorative gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className={`mb-8 p-5 rounded-2xl inline-block w-fit bg-slate-50 dark:bg-slate-800 ${card.glow} transition-all duration-500 group-hover:scale-110 relative z-10`}>
                            {card.icon}
                        </div>
                        <h3 className="text-3xl font-bold mb-4 relative z-10">{card.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-lg line-clamp-2 relative z-10">
                            {card.desc}
                        </p>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default Home;
