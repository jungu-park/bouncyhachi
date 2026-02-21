import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-800 dark:text-slate-400 text-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-4">
                    <Link to="/about" className="text-slate-900 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t.footer.about}</Link>
                    <Link to="/contact" className="text-slate-900 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t.footer.contact}</Link>
                    <Link to="/privacy" className="text-slate-900 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t.footer.privacy}</Link>
                    <Link to="/terms" className="text-slate-900 dark:text-slate-300 font-medium hover:text-primary transition-colors">{t.footer.terms}</Link>
                </div>
                <p className="text-slate-600 dark:text-slate-500">{t.footer.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
