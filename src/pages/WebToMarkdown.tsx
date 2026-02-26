import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './WebToMarkdown.css';

const WebToMarkdown: React.FC = () => {
    const { t } = useLanguage();
    const webT = (t as any).webToMarkdown;
    const typingRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const [typingText, setTypingText] = useState('');

    const originalMarkdownText = `# LLM Architecture\n\nTransformers are...\n\n![Arch](https://noisy-website.com/img/arch.png)\n\n[Next Page](https://noisy-website.com/next)`;

    useEffect(() => {
        // Fade-in animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        elementsRef.current.forEach(el => {
            if (el) observer.observe(el);
        });

        // Typing effect
        const codeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTyping(originalMarkdownText, 15);
                } else {
                    setTypingText('');
                }
            });
        }, { threshold: 0.5 });

        if (typingRef.current) {
            codeObserver.observe(typingRef.current);
        }

        return () => {
            observer.disconnect();
            codeObserver.disconnect();
        };
    }, []);

    const startTyping = (text: string, speed: number) => {
        let i = 0;
        setTypingText('');

        const type = () => {
            if (i < text.length) {
                setTypingText(prev => prev + text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    };

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return (
        <div className="web-to-markdown-page">
            <div className="background-effects">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="grid-overlay"></div>
            </div>

            <main>
                {/* Home / Hero Section */}
                <section className="hero-section">
                    <div className="container hero-content">
                        <div className="hero-text-area">
                            <div className="badge fade-in-up" ref={addToRefs}>{webT.heroBadge}</div>
                            <h1
                                className="main-title fade-in-up delay-1"
                                ref={addToRefs}
                                dangerouslySetInnerHTML={{ __html: webT.heroTitle }}
                            />
                            <p className="sub-title fade-in-up delay-2" ref={addToRefs}>
                                {webT.heroSub}
                            </p>
                            <div className="cta-wrapper fade-in-up delay-3" ref={addToRefs}>
                                <a href="https://apify.com/hachi-dev/universal-web-to-markdown" target="_blank" rel="noopener noreferrer" className="cta-button primary-btn">
                                    <span className="btn-text">{webT.heroCta}</span>
                                    <span className="btn-icon">→</span>
                                </a>
                            </div>
                        </div>

                        {/* 3D / Code Animation Area */}
                        <div className="hero-visual fade-in-up delay-4" ref={addToRefs}>
                            <div className="code-transformer-window">
                                <div className="window-header">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                    <span className="window-title">api-request.js</span>
                                </div>
                                <div className="window-body">
                                    <pre><code className="language-js">
                                        <span className="keyword">const</span> <span className="variable">response</span> = <span className="keyword">await</span> fetch(<span className="string">'/api/convert'</span>, {'{'}<br />
                                        &nbsp;&nbsp;method: <span className="string">'POST'</span>,<br />
                                        &nbsp;&nbsp;body: JSON.<span className="function">stringify</span>({'{'} <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;url: <span className="string">'https://noisy-website.com'</span> <br />
                                        &nbsp;&nbsp;{'}'})<br />
                                        {'}'});<br /><br />
                                        <span className="keyword">const</span> {'{'} <span className="variable">markdown</span> {'}'} = <span className="keyword">await</span> response.<span className="function">json</span>();<br />
                                        <span className="comment">// 🚀 1.2s: Clean Markdown Extracted!</span>
                                    </code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <div className="container">
                        <div className="section-header text-center fade-in-up" ref={addToRefs}>
                            <h2 className="section-title">{webT.featTitle}</h2>
                            <p className="section-desc">{webT.featDesc}</p>
                        </div>

                        <div className="features-grid">
                            <div className="feature-card glass-panel fade-in-up delay-1" ref={addToRefs}>
                                <div className="feature-icon icon-broom">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 3H21V8" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 20L21 3" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21 16V21H16" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M15 15L9 21" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 9L3 15" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#00d2ff" />
                                                <stop offset="1" stopColor="#3a7bd5" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <h3 className="feature-title">{webT.feat1Title}</h3>
                                <p className="feature-text">{webT.feat1Desc}</p>
                            </div>

                            <div className="feature-card glass-panel fade-in-up delay-2" ref={addToRefs}>
                                <div className="feature-icon icon-link">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 13C10.5304 13.5304 11.25 13.8284 12 13.8284C12.75 13.8284 13.4696 13.5304 14 13L18.5 8.5C19.4282 7.57175 19.9497 6.31295 19.9497 5C19.9497 3.68705 19.4282 2.42825 18.5 1.5C17.5717 0.571748 16.313 0.0502529 15 0.0502529C13.687 0.0502529 12.4282 0.571748 11.5 1.5L8.5 4.5" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 11C13.4696 10.4696 12.75 10.1716 12 10.1716C11.25 10.1716 10.5304 10.4696 10 11L5.5 15.5C4.57175 16.4283 4.05025 17.6871 4.05025 19C4.05025 20.3129 4.57175 21.5717 5.5 22.5C6.42825 23.4283 7.68705 23.9497 9 23.9497C10.3129 23.9497 11.5717 23.4283 12.5 22.5L15.5 19.5" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="paint1_linear" x1="12" y1="0.0502529" x2="12" y2="23.9497" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#b92b27" />
                                                <stop offset="1" stopColor="#1565C0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <h3 className="feature-title">{webT.feat2Title}</h3>
                                <p className="feature-text">{webT.feat2Desc}</p>
                            </div>

                            <div className="feature-card glass-panel fade-in-up delay-3" ref={addToRefs}>
                                <div className="feature-icon icon-rocket">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="paint2_linear" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#f12711" />
                                                <stop offset="1" stopColor="#f5af19" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <h3 className="feature-title">{webT.feat3Title}</h3>
                                <p className="feature-text">{webT.feat3Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="comparison-section">
                    <div className="container">
                        <div className="section-header text-center fade-in-up" ref={addToRefs}>
                            <h2 className="section-title">{webT.compTitle}</h2>
                            <p className="section-desc">{webT.compDesc}</p>
                        </div>

                        <div className="comparison-container fade-in-up delay-1" ref={addToRefs}>
                            <div className="code-box before-box glass-panel">
                                <div className="box-header">
                                    <span className="label error">Target: Raw HTML</span>
                                </div>
                                <div className="box-content">
                                    <div className="code-overlay noise">
                                        <div>&lt;html&gt;</div>
                                        <div> &lt;body&gt;</div>
                                        <div className="dim">&lt;!-- 2MB of JS libs --&gt;</div>
                                        <div className="dim">&lt;nav class="header"&gt;...&lt;/nav&gt;</div>
                                        <div className="dim">&lt;script src="ads.js"&gt;&lt;/script&gt;</div>
                                        <div> &lt;main id="content"&gt;</div>
                                        <div> &lt;div class="article-body font-size-lg"&gt;</div>
                                        <div> &lt;h1&gt;LLM Architecture&lt;/h1&gt;</div>
                                        <div> &lt;p&gt;Transformers are...&lt;/p&gt;</div>
                                        <div> &lt;img src="/img/arch.png" alt="Arch"&gt;</div>
                                        <div className="dim">&lt;div class="share-btns"&gt;...&lt;/div&gt;</div>
                                        <div> &lt;a href="/next"&gt;Next Page&lt;/a&gt;</div>
                                        <div> &lt;/div&gt;</div>
                                        <div> &lt;/main&gt;</div>
                                        <div className="dim">&lt;footer&gt;Copyright 2026&lt;/footer&gt;</div>
                                        <div> &lt;/body&gt;</div>
                                        <div>&lt;/html&gt;</div>
                                    </div>
                                </div>
                            </div>

                            <div className="comparison-divider">
                                <div className="animated-arrow">➔</div>
                            </div>

                            <div className="code-box after-box glass-panel">
                                <div className="box-header">
                                    <span className="label success">Result: Clean Markdown</span>
                                    <span className="ms-badge">0.8s</span>
                                </div>
                                <div
                                    className="box-content markdown-result"
                                    ref={typingRef}
                                    dangerouslySetInnerHTML={{ __html: typingText.replace(/\n/g, '<br>') }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="pricing-section">
                    <div className="container">
                        <div className="section-header text-center fade-in-up" ref={addToRefs}>
                            <h2 className="section-title">{webT.priceTitle}</h2>
                            <p className="section-desc">{webT.priceDesc}</p>
                        </div>

                        <div className="pricing-card glass-panel text-center fade-in-up delay-1" ref={addToRefs}>
                            <div className="price-header">
                                <div className="price-tier">{webT.priceTier}</div>
                                <div className="price-amount">$0.0005<span className="price-unit">/ page</span></div>
                            </div>

                            <ul className="price-features">
                                <li>
                                    <span className="check-icon">✓</span>
                                    <span dangerouslySetInnerHTML={{ __html: webT.priceStart }} />
                                </li>
                                <li>
                                    <span className="check-icon">✓</span>
                                    <span dangerouslySetInnerHTML={{ __html: webT.priceData }} />
                                </li>
                                <li>
                                    <span className="check-icon">✓</span>
                                    <span dangerouslySetInnerHTML={{ __html: webT.pricePlatform }} />
                                </li>
                            </ul>

                            <a href="https://apify.com/hachi-dev/universal-web-to-markdown" target="_blank" rel="noopener noreferrer" className="cta-button primary-btn full-width">
                                <span className="btn-text">{webT.priceCta}</span>
                            </a>

                            <div className="trust-badges">
                                <span className="badge-text">{webT.trustBadge}</span>
                                <div className="badge-logos">
                                    <span className="trust-brand apify">Apify</span>
                                    <span className="trust-brand divider">×</span>
                                    <span className="trust-brand paypal">PayPal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Deep Dive Section */}
                <section className="deep-dive-section">
                    <div className="container text-center fade-in-up" ref={addToRefs}>
                        <h2 className="section-title">{webT.diveTitle}</h2>
                        <p className="section-desc">{webT.diveDesc}</p>
                        <div className="cta-wrapper">
                            <a href="/blog/JLIgYHpoNA9QWMFAviOB" className="cta-button primary-btn shine-effect">
                                <span className="btn-text">{webT.diveCta}</span>
                                <span className="btn-icon">🚀</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2026 VibeToolz - A Division of Antigravity AI</p>
                </div>
            </footer>
        </div>
    );
};

export default WebToMarkdown;
