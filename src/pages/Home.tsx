import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Wrench, Gamepad2, Star, ArrowRight } from 'lucide-react';
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
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary via-neon-pink to-purple-500 bg-clip-text text-transparent transform hover:scale-105 transition duration-500 uppercase">
                    {t.home.title}
                </h1>
                <p className="text-xl md:text-2xl text-slate-900 dark:text-slate-200 max-w-4xl mx-auto mb-10 leading-relaxed font-bold opacity-90">
                    {t.home.subtitle}
                </p>
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl bg-primary text-white font-black text-xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(6,127,249,0.3)] transition-all duration-300 neon-blue-glow"
                >
                    {t.home.explore}
                    <Sparkles className="w-6 h-6" />
                </Link>
            </section>

            {/* Service Grid Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 mb-20">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.to}
                        className={`flex flex-col p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover-invert group relative overflow-hidden shadow-sm`}
                    >
                        <div className={`mb-8 p-5 rounded-2xl inline-block w-fit bg-slate-50 dark:bg-slate-800 ${card.glow} transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 relative z-10`}>
                            {card.icon}
                        </div>
                        <h3 className="text-4xl font-black mb-4 relative z-10 tracking-tight">{card.title}</h3>
                        <p className="text-slate-800 dark:text-slate-300 text-lg font-medium leading-relaxed relative z-10">
                            {card.desc}
                        </p>

                        <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 group-hover:duration-500">
                            <ArrowRight className="w-8 h-8 text-primary group-hover:text-white" />
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default Home;
