import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-extrabold text-indigo mb-4 opacity-20">404</h1>
      <h2 className="text-3xl font-bold text-text tracking-tight mb-3">Page not found</h2>
      <p className="text-lg text-text-muted mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or might have been moved.
      </p>
      <Link 
        to="/" 
        className="bg-indigo hover:bg-indigo-hover text-white font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Home size={20} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}
