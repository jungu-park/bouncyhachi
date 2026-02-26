const i18n = {
    en: {
        navBtn: "Get API Key",
        heroBadge: "🌟 NEW API RELEASE",
        heroTitle: "The ultimate <br><span class=\"gradient-text\">data refining</span> tool for RAG",
        heroSub: "Drop the noisy HTML. Convert any webpage into clean, LLM-friendly Markdown in 1 second.",
        heroCta: "Start on Apify Store",
        featTitle: "Why choose Universal Markdown API?",
        featDesc: "Providing an overwhelming pipeline experience to boost LLM performance.",
        feat1Title: "Pure Content Extraction",
        feat1Desc: "Automatically filters out ads, footers, navigation bars, and noisy elements intelligently to extract pure body content.",
        feat2Title: "RAG-Optimized URLs",
        feat2Desc: "Perfectly converts all relative paths and image sources to absolute URLs, preventing context and reference errors in LLMs.",
        feat3Title: "Zero-Cost Engine",
        feat3Desc: "Achieves extreme parsing speed utilizing Cheerio instead of heavy browsers that consume excess resources. Drastically cuts computing costs.",
        compTitle: "The Transformation",
        compDesc: "A chaotic DOM tree reborn as refined Markdown knowledge.",
        priceTitle: "Build your AI pipeline with unbeatable efficiency",
        priceDesc: "Forget opaque pricing. Pay only for what you use, at some of the lowest rates in the industry.",
        priceTier: "Developer API",
        priceStart: "Actor Start Cost: <strong>$0.01</strong>",
        priceData: "Data Processing: <strong>$0.50</strong> per 1,000 pages",
        pricePlatform: "Platform Fee: <strong>Free</strong>",
        priceCta: "Start Scraping Now",
        trustBadge: "Secure Payments Powered by",
        diveTitle: "Technical Deep Dive",
        diveDesc: "How did I build this RAG-Ready API?",
        diveCta: "Read the Devlog"
    },
    ko: {
        navBtn: "API Key 발급",
        heroBadge: "🌟 NEW API RELEASE",
        heroTitle: "RAG를 위한 가장 <br><span class=\"gradient-text\">완벽한 데이터 정제</span> 도구",
        heroSub: "노이즈 가득한 HTML을 버리세요. 어떤 웹페이지든 LLM이 가장 사랑하는 깔끔한 Markdown으로 1초 만에 변환합니다.",
        heroCta: "Apify 스토어에서 바로 시작하기",
        featTitle: "Why choose Universal Markdown API?",
        featDesc: "LLM 성능 향상을 위한 압도적인 파이프라인 경험을 제공합니다.",
        feat1Title: "순수 콘텐츠 추출",
        feat1Desc: "광고, 푸터, 내비게이션 바 등 불필요한 노이즈를 자동으로 쳐내고 순수한 본문 콘텐츠만 지능적으로 추출합니다.",
        feat2Title: "RAG 최적화 URL 변환",
        feat2Desc: "모든 상대 경로 링크와 이미지 주소를 절대 경로(Absolute URL)로 완벽하게 변환하여 LLM의 맥락 파악 및 참조 오류를 방지합니다.",
        feat3Title: "Zero-Cost 초고속 엔진",
        feat3Desc: "초과 리소스를 소모하는 무거운 브라우저 대신 Cheerio를 활용해 극강의 파싱 속도를 완성했습니다. 컴퓨팅 비용을 극단적으로 낮춥니다.",
        compTitle: "데이터 변환 시뮬레이션",
        compDesc: "어지러운 DOM 트리가 정갈한 Markdown 지식으로 재탄생합니다.",
        priceTitle: "압도적인 가성비로 AI 파이프라인을 구축하세요",
        priceDesc: "불투명한 요금제는 잊으세요. 사용한 만큼만, 업계 최저 수준으로.",
        priceTier: "Developer API",
        priceStart: "초기 실행 비용 (Actor Start): <strong>$0.01</strong>",
        priceData: "데이터 처리 비용: 1,000페이지 당 <strong>$0.50</strong>",
        pricePlatform: "플랫폼 이용료: <strong>Free</strong>",
        priceCta: "지금 바로 크롤링 시작",
        trustBadge: "안전한 결제 지원",
        diveTitle: "기술적 심층 분석",
        diveDesc: "이 RAG 최적화 API를 어떻게 만들었을까요?",
        diveCta: "개발 로그 읽기"
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ko' : 'en';
        langToggleBtn.innerText = currentLang === 'en' ? 'KO' : 'EN';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const isHtml = el.getAttribute('data-i18n-html') === 'true';
            if (i18n[currentLang][key]) {
                if (isHtml) {
                    el.innerHTML = i18n[currentLang][key];
                } else {
                    el.innerText = i18n[currentLang][key];
                }
            }
        });
    });

    // 1. Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));


    // 2. Simple Typing / Glitch effect for the Hero Code Block or "Before/After" Section
    const typeWriterElement = document.getElementById('typing-md');

    if (typeWriterElement) {
        const originalMarkdownText = typeWriterElement.innerText;

        const codeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriterText(typeWriterElement, originalMarkdownText, 15);
                } else {
                    typeWriterElement.innerText = '';
                }
            });
        }, { threshold: 0.5 });

        typeWriterElement.innerText = '';
        codeObserver.observe(typeWriterElement);
    }

    function typeWriterText(element, text, speed) {
        element.innerText = '';
        let i = 0;
        element.classList.add('typing');

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
            }
        }

        type();
    }
});
