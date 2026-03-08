import { BrowserRouter, Routes, Route, Navigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import Games from './pages/Games';
import Fortune from './pages/Fortune';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Contact from './pages/Contact';
import WebToMarkdown from './pages/WebToMarkdown';

// 초기 접속 시 언어 설정에 따라 리다이렉트하는 컴포넌트
function InitialRedirect() {
  const { lang } = useLanguage();
  return <Navigate to={`/${lang}`} replace />;
}

// URL 파라미터를 LanguageContext에 동기화하는 래퍼 컴포넌트
function LanguageWrapper() {
  const { lang: urlLang } = useParams<{ lang: string }>();
  const { setLangDirectly, lang } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터가 변경될 때 Context 언어도 동기화
    if (urlLang === 'ko' || urlLang === 'en') {
      if (lang !== urlLang) {
        setLangDirectly(urlLang as 'ko' | 'en');
      }
    }
  }, [urlLang, lang, setLangDirectly]);

  if (urlLang !== 'ko' && urlLang !== 'en') {
    // urlLang이 ko/en이 아닌데 blog, arcade 등의 메뉴인 경우 해당 언어 경로로 리다이렉트
    const knowns = ['blog', 'tools', 'arcade', 'fortune', 'privacy', 'terms', 'about', 'contact', 'admin', 'login'];
    if (urlLang && knowns.includes(urlLang)) {
      return <Navigate to={`/${lang}${location.pathname}`} replace />;
    }
    return <Navigate to={`/${lang}`} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / 접속 시 기본 언어 경로로 리다이렉트 */}
        <Route path="/" element={<InitialRedirect />} />

        {/* 언어별 경로 그룹 */}
        <Route path="/:lang" element={<LanguageWrapper />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="tools" element={<Tools />} />
            <Route path="arcade" element={<Games />} />
            <Route path="fortune" element={<Fortune />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="tools/web-to-markdown" element={<WebToMarkdown />} />
          </Route>

          {import.meta.env.DEV && (
            <Route path="login" element={<Login />} />
          )}
          {import.meta.env.DEV && (
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          )}
        </Route>

        <Route path="*" element={<NotFoundFallback />} />
      </Routes>
    </BrowserRouter>
  );
}

// 404 발생 시 언어 접두사가 없는 경우 현재 언어로 리다이렉트 시도
function NotFoundFallback() {
  const { lang } = useLanguage();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];

  const isLangPrefix = firstPart === 'ko' || firstPart === 'en';

  const isKnownPath = (path: string) => {
    const knowns = ['blog', 'tools', 'arcade', 'fortune', 'privacy', 'terms', 'about', 'contact', 'admin', 'login'];
    // path가 /blog... 처럼 시작하거나 parts[0]이 knowns에 포함된 경우
    const p = path.startsWith('/') ? path.substring(1) : path;
    const firstP = p.split('/')[0];
    return knowns.includes(firstP);
  };

  if (!isLangPrefix && isKnownPath(location.pathname)) {
    return <Navigate to={`/${lang}${location.pathname}`} replace />;
  }

  // 만약 /games/ 같은 정적 파일 경로인 경우 리다이렉트하지 않고 그대로 둠 (또는 별도 처리)
  // 여기서는 단순히 NotFound를 보여주거나, 실제 파일이 존재하는지 확인 불가능하므로 
  // 일반적인 SPA 404 처리를 따름
  return <NotFound />;
}

export default App;
