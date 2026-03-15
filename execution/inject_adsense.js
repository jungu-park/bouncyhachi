/**
 * [EN] Safely injects Google AdSense after the main content has loaded to protect SEO/Performance.
 * [KO] 메인 콘텐츠가 로드된 후 SEO 및 사이트 성능 보호를 위해 구글 애드센스를 안전하게 지연 삽입합니다.
 */

export function loadAdSenseLazy(clientId) {
    // 이미 로드되었는지 확인
    if (document.getElementById('adsense-script')) return;

    // 스크롤, 마우스 움직임, 터치 등 사용자의 첫 상호작용이 있을 때만 광고 로드
    const initAds = () => {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        // 이벤트 리스너 정리 (한 번만 실행되도록)
        document.removeEventListener('scroll', initAds);
        document.removeEventListener('mousemove', initAds);
        document.removeEventListener('touchstart', initAds);
    };

    // 이벤트 리스너 등록
    document.addEventListener('scroll', initAds, { once: true });
    document.addEventListener('mousemove', initAds, { once: true });
    document.addEventListener('touchstart', initAds, { once: true });
    
    // 만약 사용자가 아무 행동도 안 하더라도 3초 뒤에는 강제로 로드
    setTimeout(initAds, 3000);
}

/**
 * [EN] Pushes the ad unit into the specified container.
 * [KO] 지정된 컨테이너에 광고 단위를 푸시합니다. (Bento Box 레이아웃 내부에 호출)
 */
export function pushAdUnit() {
    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        console.error("AdSense Push Error: ", e);
    }
}