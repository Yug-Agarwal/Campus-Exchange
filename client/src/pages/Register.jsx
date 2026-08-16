import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: '',
    year: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register({
        ...formData,
        year: Number(formData.year)
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
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
          <h1 className="text-3xl font-extrabold text-text tracking-tight mb-2">Create an account</h1>
          <p className="text-text-muted">Join the exclusive NIT Hamirpur marketplace</p>
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
              <label className="block text-sm font-bold text-text mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe" 
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              />
            </div>
            
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
              <label className="block text-sm font-bold text-text mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Branch</label>
                <CustomSelect
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Select"
                  options={[
                    { label: 'CSE', value: 'CSE' },
                    { label: 'ECE', value: 'ECE' },
                    { label: 'ME', value: 'ME' },
                    { label: 'CE', value: 'CE' },
                    { label: 'EE', value: 'EE' }
                  ]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text mb-2">Batch Year</label>
                <CustomSelect
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Select"
                  options={Array.from({length: 5}, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return { label: String(year), value: year };
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-2">WhatsApp Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91" 
                className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo hover:bg-indigo-hover disabled:bg-indigo/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <p className="text-center text-text-muted mt-8 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo hover:underline font-bold">Sign in</Link>
        </p>
        
      </div>
    </div>
  );
}
