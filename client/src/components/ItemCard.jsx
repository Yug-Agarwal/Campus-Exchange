import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const displayPrice = item.price === 0 ? "Free" : `₹${item.price}`;
  
  const formatCategory = (cat) => {
    const map = { book: 'Books', electronics: 'Electronics', furniture: 'Furniture', cycle: 'Cycles', notes: 'Notes', appliance: 'Appliances', clothing: 'Clothing', sports: 'Sports', other: 'Other' };
    return map[cat] || cat;
  };
  
  const formatCondition = (cond) => {
    const map = { like_new: 'Like new', good: 'Good', fair: 'Fair' };
    return map[cond] || cond;
  };

  return (
    <Link 
      to={`/items/${item._id}`}
      className="group bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg hover:border-indigo hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="w-full aspect-[4/3] bg-bg-secondary flex items-center justify-center relative overflow-hidden">
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-surface/90 backdrop-blur-sm text-indigo text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-border">
            {formatCategory(item.category)}
          </span>
        </div>

        {item.images && item.images.length > 0 ? (
          <img 
            src={item.images[0]} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="text-text-muted flex flex-col items-center">
            <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-text text-lg line-clamp-2 leading-tight mb-4 group-hover:text-indigo transition-colors">{item.title}</h3>
        
        <div className="flex justify-between items-center mb-4 mt-auto">
          <span className="text-xl font-extrabold text-coral">{displayPrice}</span>
          <span className="bg-bg-secondary text-text-muted border border-border text-xs font-semibold px-2 py-1 rounded-md capitalize">
            {formatCondition(item.condition)}
          </span>
        </div>
        
        <div className="pt-4 border-t border-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo/10 text-indigo flex items-center justify-center font-bold text-[10px]">
            {item.seller?.name?.charAt(0) || 'U'}
          </div>
          <p className="text-xs text-text-muted truncate flex-1 font-medium">
            {item.seller?.name || 'Unknown seller'}
            <span className="opacity-70 ml-1 font-normal">· Batch 2024</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
