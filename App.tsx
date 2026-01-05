
import React, { useState } from 'react';
import { AppTab, Product, ChatSession, Transaction, User } from './types';
import Marketplace from './components/Marketplace';
import Messages from './components/Messages';
import SellForm from './components/SellForm';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import Auth from './components/Auth';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vintage Film Camera',
    price: 120,
    category: 'Electronics',
    description: 'A classic 35mm film camera in pristine condition. Perfect for enthusiasts.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
    seller: 'Alex Rivera',
    rating: 4.8,
    isSellerVerified: true
  },
  {
    id: 'crypto-1',
    name: '0.05 BTC Asset Bundle',
    price: 3200,
    category: 'Crypto Assets',
    description: 'Selling 0.05 BTC directly via P2P. Funds held in secure escrow. Instant release upon payment confirmation.',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=400',
    seller: 'CryptoWhale_99',
    rating: 5.0,
    isSellerVerified: true,
    isCryptoListing: true,
    cryptoAmount: 0.05,
    cryptoSymbol: 'BTC'
  },
  {
    id: '2',
    name: 'Artisan Ceramic Vase',
    price: 45,
    category: 'Home Decor',
    description: 'Hand-thrown stoneware vase with a unique cobalt glaze.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400',
    seller: 'Elena Potter',
    rating: 4.9,
    isSellerVerified: true
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.MARKETPLACE);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 'chat-1',
      participantName: 'Alex Rivera',
      participantAvatar: 'https://i.pravatar.cc/150?u=alex',
      lastMessage: 'Is the camera still available?',
      productId: '1',
      messages: [
        { id: 'm1', sender: 'seller', text: 'Hi! Yes, it is.', timestamp: new Date() },
        { id: 'm2', sender: 'user', text: 'Is the camera still available?', timestamp: new Date() }
      ]
    }
  ]);

  if (!user) {
    return <Auth onComplete={setUser} />;
  }

  const addProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    setActiveTab(AppTab.MARKETPLACE);
  };

  const handlePurchase = (product: Product, tx: Transaction) => {
    if (tx.amount > user.transactionLimit) {
      alert(`Transaction exceeds your Tier ${user.verificationTier} limit of $${user.transactionLimit}. Please upgrade your verification in the Dashboard.`);
      return;
    }
    setTransactions([tx, ...transactions]);
    if (product.isCryptoListing && product.cryptoSymbol && product.cryptoAmount) {
      const symbol = product.cryptoSymbol as keyof typeof user.cryptoBalances;
      if (user.cryptoBalances && symbol in user.cryptoBalances) {
        const updatedBalances = { ...user.cryptoBalances };
        updatedBalances[symbol] += product.cryptoAmount;
        setUser({ ...user, cryptoBalances: updatedBalances });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <nav className="w-full lg:w-64 bg-slate-900 text-white flex flex-col lg:h-screen sticky top-0 z-50 shadow-2xl border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-indigo-400/30">W</div>
          <h1 className="text-lg font-black tracking-tight leading-none uppercase">Willy Paully<br/><span className="text-indigo-400 text-xs">Links</span></h1>
        </div>

        <div className="flex-1 px-4 py-6 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
          <NavItem icon="fa-shopping-bag" label="Marketplace" active={activeTab === AppTab.MARKETPLACE} onClick={() => setActiveTab(AppTab.MARKETPLACE)} />
          <NavItem icon="fa-comment-dots" label="Messages" active={activeTab === AppTab.MESSAGES} onClick={() => setActiveTab(AppTab.MESSAGES)} />
          <NavItem icon="fa-plus-circle" label="Sell Item" active={activeTab === AppTab.SELL} onClick={() => setActiveTab(AppTab.SELL)} />
          <NavItem icon="fa-chart-line" label="Dashboard" active={activeTab === AppTab.DASHBOARD} onClick={() => setActiveTab(AppTab.DASHBOARD)} />
        </div>

        <div className="p-4 border-t border-slate-800 hidden lg:block">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="relative">
              <img src={user.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500" alt="" />
              {user.isVerified && <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900"><i className="fa-solid fa-check"></i></div>}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Tier {user.verificationTier} Member</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-40 flex justify-between items-center lg:hidden shadow-sm">
            <span className="font-black text-slate-900 uppercase tracking-tighter">Willy Paully Links</span>
            <button className="p-2 text-slate-500"><i className="fa-solid fa-bars"></i></button>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {activeTab === AppTab.MARKETPLACE && <Marketplace products={products} onPurchase={handlePurchase} />}
          {activeTab === AppTab.MESSAGES && <Messages chats={chats} products={products} />}
          {activeTab === AppTab.SELL && <SellForm onAddProduct={addProduct} />}
          {activeTab === AppTab.DASHBOARD && <Dashboard products={products} transactions={transactions} user={user} onUpdateUser={setUser} />}
        </div>
      </main>

      <Assistant />
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap lg:w-full group ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-[1.02]' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}
  >
    <i className={`fa-solid ${icon} text-lg w-6 transition-transform group-hover:scale-110`}></i>
    <span className="font-bold tracking-tight text-sm uppercase">{label}</span>
  </button>
);

export default App;
