import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById, type VibeItem } from '../lib/crud';
import { marked } from 'marked';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import 'react-quill-new/dist/quill.snow.css';

const BlogPost = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const [post, setPost] = useState<VibeItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        if (!id) return;

        getItemById(id).then(async (data) => {
            if (data && data.category === 'Blog') {
                setPost(data);
                // Select content based on language
                const content = lang === 'ko' ? (data.description_ko || data.description) : (data.description_en || data.description);

                // Determine if content is HTML (from Quill/Docs) or Markdown (legacy)
                const isHtml = content?.trim().startsWith('<') || content?.includes('</');

                // If it's HTML, we don't need marked. If it's Markdown, parse it.
                const parsedContent = isHtml ? (content || '') : await marked.parse(content || '');
                setHtmlContent(parsedContent);
            } else {
                setPost(null);
            }
        }).catch(err => {
            console.error("Failed to load post:", err);
            setPost(null);
        }).finally(() => {
            setLoading(false);
        });
    }, [id, lang]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-24 px-4 w-full">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium animate-pulse">Loading article...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 w-full text-center">
                <h1 className="text-3xl font-bold mb-4 dark:text-white">Article Not Found</h1>
                <p className="text-slate-600 mb-8 max-w-md">The article you're looking for might have been removed, or the link is incorrect.</p>
                <button
                    onClick={() => navigate(`/${lang}/blog`)}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back to Blog
                </button>
            </div>
        );
    }

    return (
        <article className="flex flex-col items-center justify-start py-12 md:py-24 px-4 w-full">
            <div className="w-full max-w-3xl">
                <Link to={`/${lang}/blog`} className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-medium mb-8">
                    <ArrowLeft size={18} /> Back to all articles
                </Link>

                <header className="mb-10 md:mb-14">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight dark:text-white leading-[1.15]">
                        {lang === 'ko'
                            ? (post.name_ko || post.name)
                            : (post.name_en || post.name_ko || post.name)}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                        <time dateTime={post.createdAt?.toDate().toISOString()}>
                            {post.createdAt?.toDate().toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        <span className="text-primary font-bold tracking-widest text-sm uppercase">Blog</span>
                    </div>
                </header>


                <div
                    className="blog-post-content ql-editor"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {post.linkUrl && (
                    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <a
                            href={post.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Visit External Link <ExternalLink size={20} />
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
};

export default BlogPost;
