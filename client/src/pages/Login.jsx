import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center p-6 pt-12 md:pt-20">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-coral text-white p-3 rounded-2xl mb-4 shadow-sm">
            <ShoppingBag size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight mb-2">Welcome back</h1>
          <p className="text-text-muted">Sign in to your Campus Exchange account</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-text mb-2">College Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@nith.ac.in" 
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-text">Password</label>
                <a href="#" className="text-sm font-bold text-indigo hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo hover:bg-indigo-hover disabled:bg-indigo/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-text-muted mt-8 font-medium">
          New to Campus Exchange?{' '}
          <Link to="/register" className="text-indigo hover:underline font-bold">Create an account</Link>
        </p>
        
      </div>
    </div>
  );
}
