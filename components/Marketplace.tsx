
import React, { useState, useMemo } from 'react';
import { Product, Transaction } from '../types';
import CheckoutModal from './CheckoutModal';

interface MarketplaceProps {
  products: Product[];
  onPurchase: (p: Product, tx: Transaction) => void;
}

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: number;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, onPurchase }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    minRating: 0,
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const categories = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                           p.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || p.category === filters.category;
      const matchesMinPrice = filters.minPrice === '' || p.price >= parseFloat(filters.minPrice);
      const matchesMaxPrice = filters.maxPrice === '' || p.price <= parseFloat(filters.maxPrice);
      const matchesRating = p.rating >= filters.minRating;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
    });
  }, [products, filters]);

  const handleStartCheckout = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsCheckingOut(true);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      minPrice: '',
      maxPrice: '',
      minRating: 0,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Marketplace</h2>
          <p className="text-slate-500 mt-2 font-medium">Verified Goods & Secure P2P Crypto Assets.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-80">
            <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
            <input
              type="text"
              placeholder="Search items or assets..."
              className="pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl w-full shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-4 rounded-3xl border transition-all flex items-center gap-2 font-bold ${
              showFilters ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <i className="fa-solid fa-sliders"></i>
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 space-y-8 shrink-0 animate-slideRight`}>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-8 sticky top-24">
            <h3 className="font-bold text-slate-900">Trading Tiers</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters({...filters, category: cat})}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filters.category === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'Crypto Assets' ? <i className="fa-solid fa-coins mr-1"></i> : null}
                  {cat}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-50">
              <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
                <i className="fa-solid fa-shield-check text-indigo-600"></i>
                <p className="text-[10px] text-indigo-900 font-bold leading-tight uppercase tracking-widest">End-to-End<br/>Encrypted P2P</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col h-full relative ${product.isCryptoListing ? 'ring-2 ring-indigo-500/20' : ''}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.isCryptoListing && (
                    <div className="absolute top-4 left-4 flex gap-2">
                       <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">P2P Asset</div>
                       <div className="px-3 py-1 bg-white/90 backdrop-blur text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1">
                        <i className="fa-solid fa-bolt-lightning text-amber-500"></i> Instant
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">{product.name}</h3>
                    {product.isCryptoListing && <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg ml-2">{product.cryptoSymbol}</span>}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                      <img src={product.sellerAvatar || `https://i.pravatar.cc/150?u=${product.seller}`} className="w-4 h-4 rounded-full" alt="" />
                      {product.seller}
                    </p>
                    {product.isSellerVerified && <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest"><i className="fa-solid fa-circle-check mr-1"></i>Verified</span>}
                  </div>

                  {product.isCryptoListing && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Rate</span>
                        <span className="text-slate-900">${(product.price / (product.cryptoAmount || 1)).toLocaleString()}/unit</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-6">
                    <div>
                      <span className="text-3xl font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</span>
                      {product.isCryptoListing && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Fixed P2P Rate</p>}
                    </div>
                    <button 
                      onClick={(e) => handleStartCheckout(e, product)} 
                      className={`px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                        product.isCryptoListing ? 'bg-indigo-600 text-white hover:bg-slate-900' : 'bg-slate-900 text-white hover:bg-indigo-600'
                      }`}
                    >
                      {product.isCryptoListing ? 'Trade Now' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCheckingOut && selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          onClose={() => setIsCheckingOut(false)} 
          onComplete={(p, tx) => {
            onPurchase(p, tx);
            setIsCheckingOut(false);
          }}
        />
      )}
    </div>
  );
};

export default Marketplace;
