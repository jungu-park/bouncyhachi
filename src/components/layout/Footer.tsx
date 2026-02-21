import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
            <div className="container mx-auto px-4">
                <p>{t.footer.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
