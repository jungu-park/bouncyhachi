

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
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
        </div>
    );
};

export default About;
