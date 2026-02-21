

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Privacy Policy</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-sm text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information that you provide directly to us, such as when you create an account, participate in any interactive features of the Services, fill out a form, request customer support, or otherwise communicate with us.
                </p>

                <h2>2. Use of Information</h2>
                <p>
                    We may use information about you for various purposes, including to:
                </p>
                <ul>
                    <li>Provide, maintain and improve our Services;</li>
                    <li>Provide and deliver the products and services you request, process transactions and send you related information, including confirmations and invoices;</li>
                    <li>Send you technical notices, updates, security alerts and support and administrative messages;</li>
                    <li>Respond to your comments, questions and requests and provide customer service;</li>
                    <li>Communicate with you about products, services, offers, promotions, rewards, and events offered by BouncyHachi and others.</li>
                </ul>

                <h2>3. Third-Party Advertisers and Google AdSense</h2>
                <p>
                    We use third-party advertising companies to serve ads when you visit our Website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                </p>
                <ul>
                    <li>Google, as a third-party vendor, uses cookies to serve ads on our site.</li>
                    <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
                    <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
                </ul>

                <h2>4. Data Storage and Security</h2>
                <p>
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Our site uses Firebase for database operations and authentication, which adheres to strict security standards.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us via our Contact page.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
