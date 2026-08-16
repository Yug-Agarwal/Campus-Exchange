import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import BrowseItemCard from '../components/BrowseItemCard';
import ItemDetailModal from '../components/ItemDetailModal';
import { Search, SlidersHorizontal, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const initialFilters = {
    category: initialCategory ? [initialCategory] : [],
    condition: [],
    minPrice: '',
    maxPrice: ''
  };
  const [filters, setFilters] = useState(initialFilters);

  const fetchItems = async (currentFilters = filters) => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (currentFilters.category.length > 0) params.append('category', currentFilters.category.join(','));
      if (currentFilters.condition.length > 0) params.append('condition', currentFilters.condition.join(','));
      if (currentFilters.minPrice) params.append('minPrice', currentFilters.minPrice);
      if (currentFilters.maxPrice) params.append('maxPrice', currentFilters.maxPrice);

      const res = await api.get(`/items?${params.toString()}`);
      setItems(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load items. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      const current = prev[field];
      if (checked) {
        return { ...prev, [field]: [...current, value] };
      } else {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchItems();
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    fetchItems(initialFilters);
  };

  return (
    <div className="flex flex-col pb-20">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-text tracking-tight mb-2">Browse listings</h1>
        <p className="text-lg text-text-muted">Fresh items from seniors across campus</p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
              placeholder="Search laptops, cycles, furniture..."
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-surface border border-border rounded-xl text-text font-medium hover:bg-bg-secondary transition-colors shadow-sm">
            <SlidersHorizontal size={18} />
            <span>Sort: Newest</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* LEFT SIDEBAR (Filters) */}
        <aside className="w-full bg-surface border border-border rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-text">Filters</h2>
            <button onClick={resetFilters} className="text-sm text-indigo font-medium hover:underline">Reset</button>
          </div>

          <div className="space-y-6">
            {/* Category */}
            <div>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Category</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Books', value: 'book' },
                  { label: 'Electronics', value: 'electronics' },
                  { label: 'Furniture', value: 'furniture' },
                  { label: 'Cycles', value: 'cycle' },
                  { label: 'Notes', value: 'notes' },
                  { label: 'Appliances', value: 'appliance' },
                  { label: 'Clothing', value: 'clothing' },
                  { label: 'Sports', value: 'sports' },
                  { label: 'Other', value: 'other' }
                ].map(cat => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      value={cat.value} 
                      checked={filters.category.includes(cat.value)}
                      onChange={(e) => handleCheckboxChange(e, 'category')}
                      className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo bg-bg-secondary" 
                    />
                    <span className="text-text-muted group-hover:text-text transition-colors">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Price range</h3>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input 
                  type="number" 
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min price" 
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-1 focus:ring-indigo" 
                />
                <span className="hidden sm:inline text-text-muted">-</span>
                <input 
                  type="number" 
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max price" 
                  className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-1 focus:ring-indigo" 
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* Condition */}
            <div>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Condition</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Like new', value: 'like_new' },
                  { label: 'Good', value: 'good' },
                  { label: 'Fair', value: 'fair' }
                ].map(cond => (
                  <label key={cond.value} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      value={cond.value}
                      checked={filters.condition.includes(cond.value)}
                      onChange={(e) => handleCheckboxChange(e, 'condition')}
                      className="w-4 h-4 border-border text-indigo focus:ring-indigo bg-bg-secondary rounded" 
                    />
                    <span className="text-text-muted group-hover:text-text transition-colors">{cond.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Location */}
            <div>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Location</h3>
              <div className="space-y-2.5">
                {['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D'].map(loc => (
                  <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo bg-bg-secondary" />
                    <span className="text-text-muted group-hover:text-text transition-colors">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Batch year */}
            <div>
              <h3 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Batch year</h3>
              <div className="space-y-2.5">
                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(batch => (
                  <label key={batch} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-border text-indigo focus:ring-indigo bg-bg-secondary" />
                    <span className="text-text-muted group-hover:text-text transition-colors">Batch {batch}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={applyFilters} className="w-full bg-indigo hover:bg-indigo-hover text-white font-bold py-3 rounded-xl transition-colors shadow-sm mt-4">
              Apply filters
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT (Grid) */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <p className="font-medium text-text">
              {isLoading ? 'Loading items...' : `${items.length} items found`}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary text-text-muted text-xs font-semibold border border-border">
              <MapPin size={12} />
              <span>All campus locations</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-indigo" size={40} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <AlertCircle size={48} className="text-red-500 mb-4 opacity-80" />
              <p className="text-lg">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg">No items match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {items.map((item, idx) => (
                <BrowseItemCard 
                  key={item._id || idx} 
                  item={item} 
                  onClick={(clickedItem) => setSelectedItem(clickedItem)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <ItemDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}
