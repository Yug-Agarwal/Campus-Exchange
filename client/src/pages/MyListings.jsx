import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';

export default function MyListings() {
  const [myItems, setMyItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/items/mine');
        setMyItems(res.data);
      } catch (err) {
        setError('Failed to load your listings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit item clicked for ID: ${id}`);
    alert(`Edit feature coming soon for item ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await api.delete(`/items/${id}`);
        setMyItems((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        alert('Failed to delete item.');
        console.error(err);
      }
    }
  };

  const handleMarkSold = async (id) => {
    try {
      await api.patch(`/items/${id}`, { status: 'sold' });
      setMyItems((prev) => 
        prev.map((item) => item._id === id ? { ...item, status: 'sold' } : item)
      );
    } catch (err) {
      alert('Failed to update item status.');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-indigo" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <AlertCircle size={48} className="text-red-500 mb-4 opacity-80" />
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-text mb-8">My Listings</h1>
      
      {myItems.length === 0 ? (
        <div className="bg-surface border border-border border-dashed rounded-xl p-12 text-center text-text-muted shadow-sm">
          <svg className="mx-auto h-12 w-12 text-text-muted mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg">You haven't posted any items yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myItems.map((item) => (
            <div key={item._id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-md">
              
              <div className="sm:w-48 h-48 sm:h-auto bg-bg-secondary flex-shrink-0 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border relative">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-text-muted flex flex-col items-center">
                    <svg className="w-10 h-10 mb-1 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                <p className="text-2xl font-extrabold text-success mb-3">{item.price === 0 ? 'Free' : `₹${item.price}`}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-bg-secondary text-text-muted border border-border text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                    {item.category}
                  </span>
                  {item.status === 'sold' && (
                    <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                      SOLD
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-bg-secondary p-6 border-t sm:border-t-0 sm:border-l border-border flex sm:flex-col justify-center gap-3 w-full sm:w-auto">
                <button 
                  className="flex-1 sm:flex-none px-4 py-2 text-text hover:bg-surface border border-border rounded-lg font-medium transition-colors whitespace-nowrap"
                  onClick={() => handleEdit(item._id)}
                >
                  Edit
                </button>
                <button 
                  className="flex-1 sm:flex-none px-4 py-2 text-success hover:bg-success/10 border border-success/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  onClick={() => handleMarkSold(item._id)}
                  disabled={item.status === 'sold'}
                >
                  Mark Sold
                </button>
                <button 
                  className="flex-1 sm:flex-none px-4 py-2 text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded-lg font-medium transition-colors whitespace-nowrap"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
