import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';
import { mockItems } from '../data/mockItems';
import { 
  Search, Book, Laptop, Armchair, Bike, FileText, Coffee, Shirt, Trophy, 
  Camera, MessageSquare, Wallet, CheckCircle, MapPin, Tag, Eye 
} from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        // The backend sorts by newest automatically
        const res = await api.get('/items');
        // Limit to 6 items
        setItems(res.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to load items for home page', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const categories = [
    { name: 'Books', value: 'book', icon: Book, color: 'text-indigo' },
    { name: 'Electronics', value: 'electronics', icon: Laptop, color: 'text-coral' },
    { name: 'Furniture', value: 'furniture', icon: Armchair, color: 'text-green-500' },
    { name: 'Cycles', value: 'cycle', icon: Bike, color: 'text-yellow-500' },
    { name: 'Notes', value: 'notes', icon: FileText, color: 'text-blue-500' },
    { name: 'Appliances', value: 'appliance', icon: Coffee, color: 'text-orange-500' },
    { name: 'Clothing', value: 'clothing', icon: Shirt, color: 'text-pink-500' },
    { name: 'Sports', value: 'sports', icon: Trophy, color: 'text-purple-500' },
  ];

  return (
    <div className="flex flex-col space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div className="w-full flex flex-col items-start space-y-8 lg:max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/10 text-coral text-sm font-semibold border border-coral/20">
            <MapPin size={14} />
            <span>Campus-only marketplace &middot; NIT Hamirpur</span>
          </div>
          
          <h1 className="text-[40px] md:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-tight">
            Campus deals from <br className="hidden lg:block"/> seniors you trust.
          </h1>
          
          <p className="text-lg text-text-muted leading-relaxed">
            Seniors sell, juniors save. Books, gadgets, cycles and more - all inside NIT Hamirpur with verified sellers, fair prices and zero hassle.
          </p>
          
          <form onSubmit={handleSearch} className="w-full relative mt-2 shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-24 py-4 bg-surface border border-border rounded-full text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              placeholder="Search books, cycles, gadgets..."
            />
            <button type="submit" className="absolute inset-y-1.5 right-1.5 bg-coral hover:bg-coral-hover text-white font-medium px-5 rounded-full transition-colors">
              Search
            </button>
          </form>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link to="/browse" className="bg-coral hover:bg-coral-hover text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm">
              Browse listings
            </Link>
            <Link to="/post" className="border-2 border-indigo text-indigo hover:bg-indigo hover:text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Sell your items
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 mt-4 border-t border-border w-full">
            <div>
              <p className="text-2xl font-bold text-text">500+</p>
              <p className="text-sm text-text-muted font-medium">Items listed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">300+</p>
              <p className="text-sm text-text-muted font-medium">Verified seniors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">1,200+</p>
              <p className="text-sm text-text-muted font-medium">Students browsing</p>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-full relative mt-8 lg:mt-0">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative w-full h-[400px] lg:h-[500px]">
            {/* Campus building sunset placeholder */}
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="NIT Hamirpur Campus" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          {/* Floating Sample Card */}
          <div className="absolute -bottom-8 -left-4 md:-left-12 bg-surface p-4 rounded-xl shadow-xl border border-border w-72 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
            <p className="font-bold text-text line-clamp-1 mb-1">HP Pavilion i5 &middot; 12th Gen</p>
            <p className="text-xl font-extrabold text-coral mb-3">Rs 32,000</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
              <CheckCircle size={12} />
              <span>Verified senior &middot; Batch 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY ROW */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <h2 className="text-3xl font-bold text-text tracking-tight">Browse by category</h2>
          <p className="text-text-muted">Everything your hostel room needs, from seniors nearby</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/browse?category=${cat.value}`} className="flex flex-col items-center justify-center p-4 bg-surface border border-border rounded-xl hover:border-indigo hover:shadow-md transition-all group">
              <cat.icon className={`w-8 h-8 mb-3 ${cat.color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              <span className="font-semibold text-text text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FRESH FROM SENIORS */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text tracking-tight mb-2">Fresh from seniors</h2>
            <p className="text-text-muted">Just listed this week across campus</p>
          </div>
          <Link to="/browse" className="text-indigo font-semibold hover:underline hidden sm:block">View all &rarr;</Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface border border-dashed border-border rounded-2xl py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center text-text-muted mb-4">
              <Camera size={28} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">No items yet</h3>
            <p className="text-text-muted mb-6">Be the first to sell something on campus!</p>
            <Link to="/post" className="bg-coral hover:bg-coral-hover text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
              Sell an item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {items.map((item, idx) => (
              <ItemCard key={item._id || idx} item={item} />
            ))}
          </div>
        )}
        
        {!isLoading && items.length > 0 && (
          <div className="mt-6 text-center sm:hidden">
            <Link to="/browse" className="text-indigo font-semibold hover:underline">View all items &rarr;</Link>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-bg-secondary px-8 py-16 lg:px-16 rounded-3xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-text tracking-tight mb-3">How it works</h2>
          <p className="text-text-muted">Three simple steps to declutter your room or find your next bargain.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-coral/10 text-coral rounded-2xl flex items-center justify-center mb-6">
              <Camera size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Step 1: Post your item</h3>
            <p className="text-text-muted">Snap a picture, set a fair price, and list your item in less than a minute.</p>
          </div>
          
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-indigo/10 text-indigo rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Step 2: Connect with juniors</h3>
            <p className="text-text-muted">Chat directly with interested buyers on campus to arrange a meetup.</p>
          </div>
          
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-16 h-16 mx-auto bg-success/10 text-success rounded-2xl flex items-center justify-center mb-6">
              <Wallet size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-text mb-2">Step 3: Buy & save</h3>
            <p className="text-text-muted">Meet up at the student center, inspect the item, and pay directly.</p>
          </div>
        </div>
      </section>

      {/* MADE FOR CAMPUS TRUST */}
      <section id="trust-and-safety">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-text tracking-tight mb-3">Made for campus trust</h2>
          <p className="text-text-muted">We built this platform to solve the chaos of WhatsApp groups.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-secondary p-6 rounded-xl border border-border">
            <CheckCircle className="w-8 h-8 text-success mb-4" strokeWidth={1.5} />
            <h4 className="font-bold text-text mb-2">Verified seniors</h4>
            <p className="text-sm text-text-muted">Every seller is verified using their institute email ID.</p>
          </div>
          <div className="bg-bg-secondary p-6 rounded-xl border border-border">
            <MapPin className="w-8 h-8 text-coral mb-4" strokeWidth={1.5} />
            <h4 className="font-bold text-text mb-2">Campus-only</h4>
            <p className="text-sm text-text-muted">No external spam. Just students inside NIT Hamirpur.</p>
          </div>
          <div className="bg-bg-secondary p-6 rounded-xl border border-border">
            <Tag className="w-8 h-8 text-indigo mb-4" strokeWidth={1.5} />
            <h4 className="font-bold text-text mb-2">Fair prices</h4>
            <p className="text-sm text-text-muted">Seniors passing down resources at student-friendly rates.</p>
          </div>
          <div className="bg-bg-secondary p-6 rounded-xl border border-border">
            <Eye className="w-8 h-8 text-orange-500 mb-4" strokeWidth={1.5} />
            <h4 className="font-bold text-text mb-2">Inspect first</h4>
            <p className="text-sm text-text-muted">Meet in person to inspect the item before you pay.</p>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-indigo rounded-3xl p-10 md:p-16 text-white text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-indigo-hover">
          <div className="pt-4 sm:pt-0">
            <p className="text-4xl md:text-5xl font-extrabold mb-2">500+</p>
            <p className="text-indigo-100 font-medium">Items listed by seniors</p>
          </div>
          <div className="pt-8 sm:pt-0">
            <p className="text-4xl md:text-5xl font-extrabold mb-2">300+</p>
            <p className="text-indigo-100 font-medium">Verified seniors</p>
          </div>
          <div className="pt-8 sm:pt-0">
            <p className="text-4xl md:text-5xl font-extrabold mb-2">1,200+</p>
            <p className="text-indigo-100 font-medium">Students browsing</p>
          </div>
          <div className="pt-8 sm:pt-0">
            <p className="text-4xl md:text-5xl font-extrabold mb-2">92%</p>
            <p className="text-indigo-100 font-medium">Deals closed on campus</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-text tracking-tight mb-3">Loved across campus</h2>
          <p className="text-text-muted">Real students, real deals</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
            <p className="text-text italic mb-6 leading-relaxed">"Got my entire 1st-year drawing equipment for half the price. The senior even gave me some old notes for free!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">A</div>
              <div>
                <p className="font-bold text-text text-sm">Ankit</p>
                <p className="text-xs text-text-muted">2nd Year CSE</p>
              </div>
            </div>
          </div>
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
            <p className="text-text italic mb-6 leading-relaxed">"Sold my old bicycle within 2 hours of posting. Way better than dealing with spam on WhatsApp groups."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral/20 text-coral flex items-center justify-center font-bold">R</div>
              <div>
                <p className="font-bold text-text text-sm">Rahul</p>
                <p className="text-xs text-text-muted">4th Year ME</p>
              </div>
            </div>
          </div>
          <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
            <p className="text-text italic mb-6 leading-relaxed">"Bought a used lab coat that looked brand new. Saved a trip to the local market and saved money too."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">P</div>
              <div>
                <p className="font-bold text-text text-sm">Priya</p>
                <p className="text-xs text-text-muted">1st Year ECE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-indigo rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to declutter or find a deal?</h2>
        <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">Join hundreds of students saving money and recycling resources across campus.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/browse" className="w-full sm:w-auto bg-white text-indigo font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
            Browse listings
          </Link>
          <Link to="/post" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-full transition-colors">
            Sell your items
          </Link>
        </div>
        <p className="mt-6 text-sm text-indigo-200">Free for every NITH student</p>
      </section>

    </div>
  );
}
