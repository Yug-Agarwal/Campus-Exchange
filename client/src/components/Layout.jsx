import { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { Sun, Moon, ShoppingBag, Plus } from 'lucide-react';

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <nav className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-coral text-white p-2 rounded-lg">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <Link to="/" className="text-xl font-bold text-text tracking-tight hover:opacity-80 transition-opacity">
              Campus Exchange
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-text-muted hover:text-text font-medium transition-colors">Browse</Link>
            <Link to="/post" className="text-text-muted hover:text-text font-medium transition-colors">Sell</Link>
            <Link to="/#how-it-works" className="text-text-muted hover:text-text font-medium transition-colors">How it works</Link>
            <Link to="/#trust-and-safety" className="text-text-muted hover:text-text font-medium transition-colors">Trust & Safety</Link>
            {isLoggedIn && (
              <Link to="/my-listings" className="text-text-muted hover:text-text font-medium transition-colors">My listings</Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-text-muted hover:bg-bg-secondary hover:text-text transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3 ml-2 border-l border-border pl-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-text leading-none">{user.name.split(' ')[0]}</span>
                  <button onClick={logout} className="text-xs text-text-muted hover:text-red-500 font-medium transition-colors">Logout</button>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo/10 text-indigo flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-text-muted border border-border px-4 py-2 rounded-lg font-medium hover:bg-bg-secondary hover:text-text transition-colors">
                Sign in
              </Link>
            )}
            
            <Link to="/post" className="bg-coral text-white px-4 py-2 rounded-full font-medium hover:bg-coral-hover transition-colors flex items-center space-x-1 shadow-sm">
              <Plus size={18} />
              <span className="hidden sm:inline">List an item</span>
              <span className="sm:hidden">List</span>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-16 py-8">
        <Outlet />
      </main>

      <footer className="bg-footer-bg text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-coral text-white p-1.5 rounded-md">
                  <ShoppingBag size={16} strokeWidth={2.5} />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Campus Exchange</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">The exclusive marketplace for NIT Hamirpur students. Buy and sell with trust.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse items</Link></li>
                <li><Link to="/post" className="hover:text-white transition-colors">Sell your stuff</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Categories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">For students</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="#" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Trust & Safety</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Hostel guides</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="mailto:support@campusexchange.nith.ac.in" className="hover:text-white transition-colors">support@campusexchange.nith.ac.in</a></li>
                <li>NIT Hamirpur Campus</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; {new Date().getFullYear()} Campus Exchange. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ for NIT Hamirpur</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
