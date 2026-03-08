# 업데이트 로그 (Update Log) - 2026-03-08

이 문서는 바운시하치(BouncyHachi) 프로젝트의 주요 수정 사항과 개선 내용을 기록합니다.

## 1. 게임 페이지 및 네비게이션 수정 (Game Page & Navigation)
- **파일**: `src/pages/Games.tsx`
- **내용**:
    - **링크 처리 개선**: 내부 라우트 링크는 `/${lang}/` 접두사를 붙이되, `/games/`로 시작하는 정적 HTML 게임 파일은 접두사 없이 직접 연결되도록 로직을 수정했습니다.
    - **Play Now 버튼**: 추천 게임 섹션의 '지금 플레이' 버튼이 정상적으로 게임 페이지를 열도록 수정했습니다.
    - **게임 프리셋 추가**: 실제 존재하는 게임 경로(`/games/puzzle/index.html`, `/games/bubble-pop/index.html`)로 프리셋 데이터를 업데이트했습니다.

## 2. 스마트 라우팅 및 리다이렉트 (Smart Routing & Redirects)
- **파일**: `src/App.tsx`
- **내용**:
    - **LanguageWrapper 개선**: 사용자가 언어 접두사 없이 알려진 경로(blog, arcade, tools 등)로 접근할 경우, 현재 언어 설정을 유지하여 자동으로 리다이렉트(예: `/arcade` -> `/ko/arcade`)하도록 개선했습니다.
    - **NotFoundFallback 도입**: 404 발생 시 단순히 에러 페이지를 보여주는 대신, 언어 경로 누락 여부를 판단하여 적절한 주소로 보정해주는 기능을 추가했습니다.

## 3. 이미지 렌더링 이슈 해결 (Image Rendering Fixes)
- **파일**: `scripts/google_docs_worker.js`, `src/lib/r2.ts`
- **내용**:
    - **프로토콜 강제 적용**: Cloudflare R2 도메인 설정 시 `https://` 프로토콜이 누락되어 이미지가 깨지는 현상을 방지하기 위해 URL 생성 로직에 프로토콜 가드를 추가했습니다.
    - **경로 최적화**: URL 생성 시 중복 슬래시(`//`)가 발생하지 않도록 슬래시 처리 로직을 개선했습니다.
    - **구글 문서 임포트**: `google_docs_worker.js`에서 생성되는 이미지 태그의 `src` 값이 항상 절대 경로를 가지도록 보장했습니다.

## 4. 라이브러리 및 의존성 (Libraries)
- `react-router-dom`의 `useLocation` 임포트가 누락되어 있던 부분을 수정했습니다.

## 5. 블로그 404 에러 및 라우팅 수정 (Blog 404 Error & Routing Fixes)
- **파일**: `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`, `src/App.tsx`
- **내용**:
    - **언어 접두사 강제 적용**: 블로그 목록 페이지(`Blog.tsx`)와 개별 포스트 페이지(`BlogPost.tsx`)에서 모든 내부 링크와 리다이렉트 시 현재 선택된 언어 접두사(`/${lang}`)가 포함되도록 수정하여 404 에러를 방지했습니다.
    - **동적 리다이렉트 로직 개선**: `App.tsx`의 `LanguageWrapper`와 `NotFoundFallback`에서 언어 접두사가 누락된 경우, 하드코딩된 `/ko` 대신 사용자의 현재 언어 설정을 기반으로 동적으로 리다이렉트하도록 개선했습니다.
    - **네비게이션 일관성**: "블로그로 돌아가기" 등의 버튼 클릭 시에도 언어 컨텍스트가 유지되도록 보장했습니다.

---
**주의 사항**: 향후 새로운 메뉴나 정적 자산을 추가할 때 `App.tsx`의 `knowns` 목록과 `Games.tsx`의 정적 경로 판단 로직(`isStatic`)을 확인하시기 바랍니다.

## 6. 블로그 제목 처리 개선 (Blog Title Handling Improvements)
- **파일**: `src/pages/Admin.tsx`, `src/pages/BlogPost.tsx`
- **내용**:
    - **제목 추출 로직 정교화**: Google Docs 및 .docx 파일 임포트 시 제목 추출 로직을 더 보수적으로 수정하여 본문에서 제목이 중복되거나 아예 사라지는 현상을 방지했습니다.
    - **수동 제목 제거 기능**: 본문 상단에 제목이 남아있는 경우 사용자가 직접 제거할 수 있는 'Strip Title' 버튼을 추가했습니다.
    - **렌더링 일관성**: `BlogPost.tsx`에서 포스트 제목 출력 시 `name_ko`, `name_en`, `name` 순서로 fallback을 적용하여 어떤 상황에서도 제목이 표시되도록 보장했습니다.
    - **필드 동기화**: 임포트한 제목이 한국어/영어 필드 및 기본 이름 필드에 모두 올바르게 반영되도록 수정했습니다.

