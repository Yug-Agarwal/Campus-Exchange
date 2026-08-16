import { X, CheckCircle, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect } from 'react';

export default function ItemDetailModal({ item, onClose }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [item]);

  if (!item) return null;

  const displayPrice = item.price === 0 ? "Free" : `₹${item.price}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-surface/80 hover:bg-bg-secondary rounded-full text-text-muted hover:text-text transition-colors backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Left: Image (40-50% width on md screens) */}
        <div className="w-full md:w-[45%] h-64 md:h-auto bg-bg-secondary flex-shrink-0 flex items-center justify-center">
          {item.images && item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="text-text-muted flex flex-col items-center opacity-50">
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-[55%] p-6 md:p-10 overflow-y-auto flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text leading-tight mb-4 pr-8">{item.title}</h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-coral">{displayPrice}</span>
              <span className="bg-bg-secondary text-text-muted border border-border text-xs font-semibold px-2.5 py-1.5 rounded-md uppercase tracking-wider">
                {item.condition}
              </span>
            </div>
          </div>

          <div className="prose prose-sm md:prose-base text-text-muted mb-8 leading-relaxed">
            <p>{item.description || "No description provided for this item."}</p>
          </div>

          <div className="mt-auto space-y-6">
            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm font-medium text-text-muted bg-bg-secondary p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-indigo" />
                <span>Hostel A area</span>
              </div>
              <span className="hidden sm:inline text-border">&middot;</span>
              <span>Listed 2 days ago</span>
            </div>

            {/* Seller Row */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-border">
              <div className="w-12 h-12 rounded-full bg-indigo/10 text-indigo flex items-center justify-center font-bold text-lg">
                {item.seller?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-text text-lg">{item.seller?.name || 'Unknown seller'}</p>
                <div className="flex items-center gap-1.5 text-success text-sm font-semibold mt-0.5">
                  <CheckCircle size={14} />
                  <span>Verified senior &middot; Batch 2024</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="flex-1 bg-success hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                <Phone size={18} />
                <span>WhatsApp seller</span>
              </button>
              <button className="flex-1 bg-indigo hover:bg-indigo-hover text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                <MessageCircle size={18} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
