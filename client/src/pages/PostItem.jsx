import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Camera, Tag, Wallet, User, Send, CheckCircle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import api from '../api/axios';

export default function PostItem() {
  const initialFormData = {
    title: '',
    description: '',
    category: '',
    condition: 'like_new',
    price: '',
    negotiable: true,
    sellerName: '',
    whatsapp: '',
    hostel: '',
    batch: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary credentials missing in .env');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const response = await api.post('/items', {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'other',
        condition: formData.condition,
        price: Number(formData.price) || 0,
        images: imageUrl ? [imageUrl] : [] 
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitStatus('success');
        setFormData(initialFormData);
        setImageFile(null);
        setImagePreview('');
        setTimeout(() => {
          navigate('/my-listings');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      const errMessage = error.response?.data?.message || error.message || 'Failed to post listing. Please try again.';
      setSubmitStatus(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewTitle = formData.title || "Your item title will appear here";
  const previewPrice = formData.price ? `Rs ${formData.price}` : "Rs 0 — set your price";

  return (
    <div className="flex flex-col pb-20">
      
      {/* HEADER */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text tracking-tight mb-3">Sell your stuff</h1>
        <p className="text-lg text-text-muted mb-8">List an item in under two minutes and reach juniors across campus.</p>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <div className="bg-indigo text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm">
            1 &middot; Details
          </div>
          <div className="w-4 sm:w-8 h-[2px] bg-border"></div>
          <div className="bg-bg-secondary text-text-muted border border-border px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold">
            2 &middot; Photos
          </div>
          <div className="w-4 sm:w-8 h-[2px] bg-border"></div>
          <div className="bg-bg-secondary text-text-muted border border-border px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold">
            3 &middot; Review
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[65%_1fr] gap-8 items-start">
        
        {/* LEFT COLUMN: FORM CARDS */}
        <div className="space-y-6">
          
          {/* Card 1: Item details */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                <Info size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-text">Item details</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Item title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Engineering Maths books, HP laptop..." 
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe the condition, what is included, and why you are selling..." 
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card 2: Photos */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center">
                <Camera size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-text">Photos</h2>
            </div>
            <p className="text-text-muted text-sm mb-6 ml-[52px]">Add up to 6 photos. First photo becomes the cover.</p>
            
            <label className="block w-full border-2 border-dashed border-border hover:border-indigo bg-bg-secondary hover:bg-surface rounded-2xl p-10 text-center cursor-pointer transition-colors group">
              <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
              <div className="w-14 h-14 mx-auto bg-surface border border-border rounded-full flex items-center justify-center text-text-muted group-hover:text-indigo mb-4 shadow-sm transition-colors">
                <Camera size={24} />
              </div>
              <p className="text-text font-bold mb-1">Drag & drop photos here, or browse</p>
              <p className="text-text-muted text-xs">JPG or PNG, up to 10MB each</p>
            </label>
          </div>

          {/* Card 3: Category & Condition */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                <Tag size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-text">Category & condition</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Category</label>
                <CustomSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Select category"
                  options={[
                    { label: 'Books', value: 'book' },
                    { label: 'Electronics', value: 'electronics' },
                    { label: 'Furniture', value: 'furniture' },
                    { label: 'Cycles', value: 'cycle' },
                    { label: 'Notes', value: 'notes' },
                    { label: 'Appliances', value: 'appliance' },
                    { label: 'Clothing', value: 'clothing' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Other', value: 'other' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-2">Condition</label>
                <CustomSelect
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  options={[
                    { label: 'Like new', value: 'like_new' },
                    { label: 'Good', value: 'good' },
                    { label: 'Fair', value: 'fair' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Price */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-text">Price</h2>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-text mb-2">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-text-muted font-bold">Rs</span>
                  </div>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="Enter price" 
                    className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border rounded-xl text-text font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-start gap-4 md:mt-7 bg-bg-secondary p-3 md:px-4 rounded-xl border border-border">
                <span className="font-bold text-text text-sm">Negotiable</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Card 5: Seller Details */}
          <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 text-indigo flex items-center justify-center">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-text">Seller details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Your name</label>
                <input type="text" name="sellerName" value={formData.sellerName} onChange={handleChange} placeholder="First name" className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-2">WhatsApp number</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+91" className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Hostel block</label>
                <CustomSelect
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  placeholder="Select hostel"
                  options={[
                    { label: 'Hostel A', value: 'Hostel A' },
                    { label: 'Hostel B', value: 'Hostel B' },
                    { label: 'Hostel C', value: 'Hostel C' },
                    { label: 'Hostel D', value: 'Hostel D' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-2">Batch year</label>
                <CustomSelect
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="Select batch"
                  options={Array.from({length: 5}, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return { label: String(year), value: String(year) };
                  })}
                />
              </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: STICKY PREVIEW */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <h2 className="text-2xl font-extrabold text-text px-1 hidden lg:block">Listing preview</h2>
          
          <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="w-full aspect-[4/3] bg-bg-secondary flex items-center justify-center relative border-b border-border">
              {/* Condition Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-surface/90 backdrop-blur-sm text-text text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-border">
                  {formData.condition === 'like_new' ? 'Like new' : formData.condition}
                </span>
              </div>
              
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-text-muted flex flex-col items-center">
                  <Camera size={32} className="mb-2 opacity-30" />
                  <span className="text-xs font-semibold opacity-50 uppercase tracking-widest">No photo</span>
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className={`font-bold text-lg line-clamp-2 leading-tight mb-4 ${formData.title ? 'text-text' : 'text-text-muted italic'}`}>
                {previewTitle}
              </h3>
              
              <div className="flex justify-between items-center mb-5">
                <span className={`text-xl font-extrabold ${formData.price ? 'text-coral' : 'text-text-muted opacity-50'}`}>
                  {previewPrice}
                </span>
                {formData.negotiable && (
                  <span className="bg-bg-secondary text-text-muted border border-border text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider">
                    Negotiable
                  </span>
                )}
              </div>
              
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo/10 text-indigo flex items-center justify-center font-bold text-[10px]">
                  {formData.sellerName ? formData.sellerName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-xs font-bold text-text leading-none mb-1">
                    {formData.sellerName || 'You'}
                  </p>
                  <p className="text-[10px] text-success font-bold flex items-center gap-1">
                    <CheckCircle size={10} /> Verified senior
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-700 dark:text-yellow-500 text-sm font-medium flex gap-3">
            <span className="text-lg leading-none">✨</span>
            <p className="leading-snug">Clear photos and an honest description help items sell 2x faster.</p>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-coral hover:bg-coral-hover disabled:bg-coral/50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-lg"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'Posting...' : 'Post listing'}</span>
            </button>
            <p className="text-center text-xs text-text-muted font-medium mt-3">
              Free for NITH students &middot; You will get a confirmation once your listing is live.
            </p>
            {submitStatus === 'success' && (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                Listing posted successfully!
              </div>
            )}
            {submitStatus && submitStatus !== 'success' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center text-sm font-bold">
                {submitStatus}
              </div>
            )}
          </div>
          
        </div>

      </form>
    </div>
  );
}
