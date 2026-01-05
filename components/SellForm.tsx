
import React, { useState } from 'react';
import { Product } from '../types';
import { generateProductDescription } from '../geminiService';

interface SellFormProps {
  onAddProduct: (product: Product) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onAddProduct }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    features: '',
    description: '',
    image: `https://picsum.photos/seed/${Math.random()}/400/300`,
    cryptoSymbol: 'ETH',
    cryptoAmount: ''
  });

  const isCryptoMode = formData.category === 'Crypto Assets';

  const handleAICompose = async () => {
    if (!formData.name || !formData.features) {
      alert("Please enter a name and some features first!");
      return;
    }
    setLoading(true);
    const aiDescription = await generateProductDescription(formData.name, formData.category, formData.features);
    setFormData(prev => ({ ...prev, description: aiDescription || '' }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      name: isCryptoMode ? `${formData.cryptoAmount} ${formData.cryptoSymbol} P2P` : formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      image: isCryptoMode ? 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400' : formData.image,
      seller: 'John Doe',
      rating: 5.0,
      isCryptoListing: isCryptoMode,
      cryptoAmount: isCryptoMode ? parseFloat(formData.cryptoAmount) : undefined,
      cryptoSymbol: isCryptoMode ? formData.cryptoSymbol : undefined
    };
    onAddProduct(newProduct);
  };

  return (
    <div className="max-w-4xl mx-auto animate-slideUp">
      <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
        <div className={`p-10 text-white transition-colors duration-500 ${isCryptoMode ? 'bg-slate-900' : 'bg-indigo-700'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight">{isCryptoMode ? 'Create P2P Crypto Listing' : 'List Your Item'}</h2>
              <p className="text-indigo-100 mt-2 opacity-80 font-medium">Verified marketplace for global {isCryptoMode ? 'assets' : 'goods'}.</p>
            </div>
            {isCryptoMode && <i className="fa-solid fa-lock text-4xl text-emerald-400"></i>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Category</label>
              <select
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Clothing</option>
                <option>Home Decor</option>
                <option>Crypto Assets</option>
                <option>Services</option>
              </select>
            </div>

            {isCryptoMode ? (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Ticker</label>
                <div className="flex gap-2">
                  {['BTC', 'ETH', 'USDT'].map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, cryptoSymbol: t})}
                      className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${formData.cryptoSymbol === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Listing Title</label>
                <input
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="e.g. MacBook Pro M2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {isCryptoMode ? `Quantity (${formData.cryptoSymbol})` : 'Total Price ($)'}
              </label>
              <input
                required
                type="number"
                step="any"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-black text-xl"
                placeholder="0.00"
                value={isCryptoMode ? formData.cryptoAmount : formData.price}
                onChange={e => setFormData({ ...formData, [isCryptoMode ? 'cryptoAmount' : 'price']: e.target.value })}
              />
            </div>
            {isCryptoMode && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requested Payout (USD)</label>
                <input
                  required
                  type="number"
                  className="w-full px-6 py-4 bg-black text-white rounded-2xl outline-none font-black text-xl"
                  placeholder="$ 0.00"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            )}
          </div>

          {!isCryptoMode && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Features</label>
              <textarea
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                rows={2}
                placeholder="Key selling points for the AI to analyze..."
                value={formData.features}
                onChange={e => setFormData({ ...formData, features: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Pitch</label>
              <button
                type="button"
                onClick={handleAICompose}
                disabled={loading}
                className="text-[10px] font-black text-indigo-600 flex items-center gap-2 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-full uppercase tracking-widest"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                Optimize Listing
              </button>
            </div>
            <textarea
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium leading-relaxed"
              rows={4}
              placeholder={isCryptoMode ? "Explain terms of transfer or network preference..." : "Detailed product story..."}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-6 text-white font-black rounded-[2rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-sm ${
              isCryptoMode ? 'bg-slate-950 hover:bg-black shadow-slate-200' : 'bg-indigo-700 hover:bg-indigo-600 shadow-indigo-100'
            }`}
          >
            {isCryptoMode ? 'Deploy P2P Escrow Listing' : 'Publish Verified Listing'}
          </button>
        </form>
      </div>

      <div className={`mt-10 p-8 rounded-[2.5rem] border flex items-start gap-6 transition-colors ${
        isCryptoMode ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'
      }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-xl ${
          isCryptoMode ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
        }`}>
          <i className={`fa-solid ${isCryptoMode ? 'fa-shield-halved' : 'fa-circle-info'}`}></i>
        </div>
        <div>
          <h4 className={`font-black uppercase tracking-widest text-sm ${isCryptoMode ? 'text-emerald-900' : 'text-amber-900'}`}>
            {isCryptoMode ? 'Encrypted Escrow Protection' : 'Compliance Guidelines'}
          </h4>
          <p className={`text-sm leading-relaxed mt-2 font-medium ${isCryptoMode ? 'text-emerald-800/80' : 'text-amber-800/80'}`}>
            {isCryptoMode 
              ? 'Willy Paully Links acts as a secure intermediary. Crypto assets are locked in escrow until the buyer completes payment. 256-bit AES encryption secures all P2P negotiation threads.'
              : 'Standard 2.5% platform fee applies to all physical and digital goods. Ensure your descriptions are accurate to maintain your Verified Seller rating.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellForm;
