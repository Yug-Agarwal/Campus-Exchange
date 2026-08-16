import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ options, value, onChange, name, placeholder = 'Select' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value || opt.value === Number(value));

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text text-base text-left focus:outline-none focus:ring-2 focus:ring-indigo transition-shadow flex justify-between items-center"
      >
        <span>{selectedOption ? selectedOption.label : <span className="text-text-muted">{placeholder}</span>}</span>
        <ChevronDown size={18} className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-3 text-base hover:bg-bg-secondary transition-colors ${value === option.value ? 'bg-indigo/5 text-indigo font-semibold' : 'text-text'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
