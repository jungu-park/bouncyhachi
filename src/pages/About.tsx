import SEO from '../components/SEO';

const About = () => {
    return (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <SEO
                title="BouncyHachi (바운시하치) 소개"
                description="BouncyHachi는 웹 기반의 다양한 온라인 유틸리티 도구, 스트레스를 날려버릴 무설치 게임, 흥미로운 운세 테스트 등 유익한 엔터테인먼트 콘텐츠를 한곳에서 즐길 수 있도록 만들어진 크리에이티브 플랫폼입니다."
                schema={{
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    "name": "About BouncyHachi",
                    "description": "Learn about BouncyHachi, a comprehensive utility and entertainment hub.",
                    "url": "https://bouncyhachi.com/about"
                }}
            />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">About BouncyHachi</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none text-lg">
                <p>
                    Welcome to <strong>BouncyHachi</strong>, a space dedicated to sharing interesting tools, engaging web games, insightful fortunes, and thoughts on various topics.
                </p>

                <h2>Our Mission</h2>
                <p>
                    Our goal is to provide a clean, user-friendly platform where visitors can find entertaining content and useful utilities. We believe in high-quality web experiences and strive to create content that adds value to your day.
                </p>

                <h2>What We Offer</h2>
                <ul>
                    <li><strong>Blog:</strong> Regular updates, tutorials, and thoughts on technology, development, and more.</li>
                    <li><strong>Tools:</strong> Handy online utilities designed to make daily tasks a little easier.</li>
                    <li><strong>Arcade:</strong> Fun, browser-based games to pass the time.</li>
                    <li><strong>Fortunes:</strong> Daily insights and fun fortune-telling features.</li>
                </ul>

                <h2>The Tech Behind the Site</h2>
                <p>
                    BouncyHachi is built using modern web technologies including React, Tailwind CSS, Firebase, and Cloudflare R2 to ensure a fast, secure, and responsive experience across all devices.
                </p>
            </div>
        </main>
    );
};

export default About;
