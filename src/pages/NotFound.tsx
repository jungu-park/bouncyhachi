import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-8xl font-black text-slate-200 dark:text-slate-800 mb-6 drop-shadow-xl">404</h1>
            <h2 className="text-3xl font-bold mb-4">Lost in the Vibe</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md text-lg">
                The page you are looking for does not exist or has been moved to another dimension.
            </p>
            <Link
                to="/"
                className="px-8 py-4 rounded-full bg-primary text-white font-bold neon-blue-glow hover:brightness-110 hover:-translate-y-1 transition-all duration-300"
            >
                Return Home
            </Link>
        </div>
    );
};

export default NotFound;
