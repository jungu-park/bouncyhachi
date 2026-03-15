# Directive 00: Global UI/UX & Stitch Implementation Rules

## 1. Goal
Establish the baseline modern UI/UX design standards for all web applications and define how to implement them strictly using Stitch components.

## 2. Core UI/UX Trends (Latest Standards)
Regardless of the project type, all interfaces must adhere to the following modern trends:
- **Bento Box Layouts:** Use clean, grid-based modular layouts for dashboards and tools.
- **Dark Mode First:** Default to a sleek dark mode UI with high-contrast text, unless a light theme is explicitly requested.
- **Glassmorphism:** Apply subtle blur effects and semi-transparent backgrounds for modals, sticky headers, and floating action buttons.
- **Micro-interactions:** Add smooth, fast transitions (e.g., hover effects, active states) to all interactive elements. 
- **Minimalist Typography:** Use sans-serif, highly legible fonts with clear visual hierarchy (distinct H1, H2, body sizes).

## 3. Stitch Execution Rules
When generating or modifying UI code using Stitch:
1. **Mobile-First Responsiveness:** All Stitch components must be fully responsive. Start with mobile layouts and scale up to desktop using proper breakpoints.
2. **Component Modularity:** Break down the UI into small, reusable Stitch components (e.g., Buttons, Cards, Navbars) rather than writing monolithic files.
3. **Utility Classes:** Utilize Stitch's utility-first approach (similar to Tailwind CSS) for styling. Avoid custom CSS files unless absolutely necessary.
4. **Accessibility (a11y):** Ensure proper semantic HTML tags (`<nav>`, `<main>`, `<article>`) and include `aria-labels` for icon-only buttons.

## 4. Edge Cases
- If a specific Stitch component fails to render or behaves unexpectedly, fallback to standard flexbox/grid layouts with semantic HTML.
- Never use outdated design patterns (e.g., heavy drop shadows, 3D skeuomorphism, cluttered layouts).