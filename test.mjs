import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER_PAGE_ERROR:', error));

    await page.goto('http://localhost:5173');
    // Then go to admin to trigger loading Admin.tsx if it's lazy loaded
    // Or directly go to /admin depending on routing.
    await page.goto('http://localhost:5173/admin');
    await page.waitForTimeout(3000);

    await browser.close();
})();
