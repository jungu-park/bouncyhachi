

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-sm text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using BouncyHachi (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2>2. Provision of Services</h2>
                <p>
                    BouncyHachi is constantly innovating in order to provide the best possible experience for its users. You acknowledge and agree that the form and nature of the Services which BouncyHachi provides may change from time to time without prior notice to you.
                </p>

                <h2>3. Use of the Services by You</h2>
                <p>
                    You agree to use the Services only for purposes that are permitted by (a) the Terms and (b) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdictions.
                </p>
                <p>
                    You agree that you will not engage in any activity that interferes with or disrupts the Services (or the servers and networks which are connected to the Services).
                </p>

                <h2>4. User Content</h2>
                <p>
                    Any interaction with our tools, games, or fortune telling features is for entertainment purposes. We do not guarantee the accuracy of any generated results or fortunes.
                </p>

                <h2>5. Modifications to the Terms</h2>
                <p>
                    BouncyHachi may make changes to the Terms from time to time. When these changes are made, BouncyHachi will make a new copy of the Terms available on this page.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
