import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/items/${id}`);
        setItem(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load item details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id]);

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
        <Link to="/browse" className="mt-4 text-indigo hover:underline">Back to Browse</Link>
      </div>
    );
  }

  const displayPrice = item.price === 0 ? "Free" : `₹${item.price}`;

  return (
    <div className="max-w-5xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center text-primary-600 hover:text-primary-800 font-semibold mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Browse
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Image Section */}
        <div className="md:w-1/2 bg-gray-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-auto rounded-xl object-contain max-h-[500px]"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center py-24">
              <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-lg font-medium">No Image Uploaded</span>
            </div>
          )}
        </div>
        
        {/* Info Section */}
        <div className="md:w-1/2 p-8 lg:p-10 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {item.category}
            </span>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {item.condition}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h1>
          <p className="text-4xl font-extrabold text-green-600 mb-8">{displayPrice}</p>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 pb-2 border-b border-gray-100">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{item.description || "No description provided."}</p>
          </div>
          
          <div className="mt-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Contact Seller</h3>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mr-3">
                  {item.seller.name.charAt(0)}
                </div>
                <p className="font-semibold text-gray-900 text-lg">{item.seller.name}</p>
              </div>
              <div className="space-y-2 text-gray-600 ml-13">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <a href={`mailto:${item.seller.email}`} className="text-primary-600 hover:underline">{item.seller.email}</a>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  {item.seller.phone}
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
