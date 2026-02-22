import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';

const Navbar = () => {
    const { lang, t, toggleLang } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 glass-effect transition-colors duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white neon-blue-glow font-black text-xl transform group-hover:rotate-12 transition-transform">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter leading-none text-slate-900 dark:text-white group-hover:text-primary transition-colors">BOUNCY</span>
                        <span className="font-bold text-sm tracking-[0.2em] leading-none text-neon-pink dark:text-neon-pink opacity-80 group-hover:opacity-100 transition-opacity">HACHI</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/blog" className="nav-link-bold">{t.nav.blog}</Link>
                    <Link to="/tools" className="nav-link-bold hover:text-neon-pink">{t.nav.tools}</Link>
                    <Link to="/arcade" className="nav-link-bold hover:text-green-500">{t.nav.games}</Link>
                    <Link to="/fortune" className="nav-link-bold hover:text-purple-500">{t.nav.fortune}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-black hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 transition-all shadow-sm"
                    >
                        <Globe className="w-4 h-4" />
                        <span>{lang === 'en' ? 'EN' : 'KR'}</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 font-bold" /> : <Moon className="w-5 h-5 font-bold" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
