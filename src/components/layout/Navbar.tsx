import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';

const Navbar = () => {
    const { lang, t, toggleLang } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 glass-effect border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white neon-blue-glow font-bold text-lg">
                        B
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block text-slate-900 dark:text-white">BouncyHachi</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/blog" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">{t.nav.blog}</Link>
                    <Link to="/tools" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-neon-pink transition-colors">{t.nav.tools}</Link>
                    <Link to="/arcade" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-green-500 transition-colors">{t.nav.games}</Link>
                    <Link to="/fortune" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-purple-500 transition-colors">{t.nav.fortune}</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'EN' : 'KR'}</span>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
