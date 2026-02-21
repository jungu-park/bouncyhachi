import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, ArrowRight } from 'lucide-react';
import { getItems, type VibeItem } from '../lib/crud';
import { Link } from 'react-router-dom';

const Blog = () => {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<VibeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getItems().then(data => {
            setPosts(data.filter(item => item.category === 'Blog'));
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col items-center justify-start py-24 px-4 w-full">
            <div className="text-center mb-16">
                <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 mb-6 neon-border">
                    <FileText size={40} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight dark:text-white">
                    {t.cards.blog.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    {t.cards.blog.desc}
                </p>
            </div>

            <div className="w-full max-w-5xl">
                {loading ? (
                    <div className="text-center text-slate-500 py-12 flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        Loading posts...
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center">
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Coming Soon</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <Link
                                to={`/blog/${post.id}`}
                                key={post.id}
                                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1 block"
                            >
                                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                            <FileText size={48} className="opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-xl font-bold mb-2 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.name}
                                    </h2>
                                    <div className="text-sm text-slate-500 mb-4 mt-auto pt-4 flex items-center justify-between">
                                        <span>{post.createdAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        <span className="text-primary font-semibold flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Read <ArrowRight size={14} /></span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
