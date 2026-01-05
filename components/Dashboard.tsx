
import React, { useState, useRef, useEffect } from 'react';
import { Product, Transaction, User } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  user: User;
  onUpdateUser: (u: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions, user, onUpdateUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'billing' | 'wallet' | 'verification'>('sales');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifStep, setVerifStep] = useState<'start' | 'doc' | 'live' | 'done'>('start');
  const [scanProgress, setScanProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const myItems = products.filter(p => p.seller === user.name || p.seller === 'John Doe');
  
  const startVerification = (tier: 2 | 3) => {
    setVerifStep(tier === 2 ? 'doc' : 'live');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera required for advanced verification.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleScan = () => {
    setIsVerifying(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          if (verifStep === 'doc') {
            onUpdateUser({ ...user, verificationTier: 2, transactionLimit: 5000 });
            setVerifStep('done');
          } else if (verifStep === 'live') {
            onUpdateUser({ ...user, verificationTier: 3, transactionLimit: 1000000 });
            setVerifStep('done');
          }
          stopCamera();
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleLinkBilling = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h2>
          <p className="text-slate-500 mt-1 font-medium">Verified Level: <span className="text-indigo-600 font-bold">Tier {user.verificationTier}</span></p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar items-center">
          {['sales', 'billing', 'wallet', 'verification'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab ? 'bg-white shadow-lg text-indigo-700' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
          {user.role === 'admin' && (
            <button 
              onClick={handleLinkBilling}
              className="ml-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all whitespace-nowrap"
            >
              <i className="fa-solid fa-link mr-2"></i> Link Billing
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'verification' ? (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl font-black text-slate-900">Verification Center</h3>
            <p className="text-slate-500 font-medium">Increase your transaction limits by providing advanced biometric and document proof.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-8 rounded-[2.5rem] border ${user.verificationTier >= 1 ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6"><i className="fa-solid fa-address-card text-xl"></i></div>
              <h4 className="font-black text-slate-900">Tier 1: Basic</h4>
              <p className="text-xs text-slate-500 mt-2">ID Number Verification Only</p>
              <p className="text-lg font-black text-indigo-700 mt-4">$500 Limit</p>
              {user.verificationTier >= 1 && <div className="mt-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full inline-block">Current</div>}
            </div>

            <div className={`p-8 rounded-[2.5rem] border ${user.verificationTier >= 2 ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6"><i className="fa-solid fa-file-invoice text-xl"></i></div>
              <h4 className="font-black text-slate-900">Tier 2: Verified</h4>
              <p className="text-xs text-slate-500 mt-2">ID Document Scan Required</p>
              <p className="text-lg font-black text-indigo-700 mt-4">$5,000 Limit</p>
              {user.verificationTier < 2 && (
                <button onClick={() => startVerification(2)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase">Upgrade to Tier 2</button>
              )}
              {user.verificationTier >= 2 && <div className="mt-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full inline-block">Unlocked</div>}
            </div>

            <div className={`p-8 rounded-[2.5rem] border ${user.verificationTier >= 3 ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6"><i className="fa-solid fa-dna text-xl"></i></div>
              <h4 className="font-black text-slate-900">Tier 3: Executive</h4>
              <p className="text-xs text-slate-500 mt-2">Liveness 3D Facial Scan</p>
              <p className="text-lg font-black text-indigo-700 mt-4">Unlimited Trading</p>
              {user.verificationTier < 3 && user.verificationTier >= 2 && (
                <button onClick={() => startVerification(3)} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase">Upgrade to Tier 3</button>
              )}
              {user.verificationTier >= 3 && <div className="mt-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full inline-block">Unlocked</div>}
            </div>
          </div>

          {(verifStep === 'doc' || verifStep === 'live') && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setVerifStep('start')} />
              <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden relative shadow-2xl animate-slideUp p-10 space-y-8">
                <div className="text-center">
                   <h3 className="text-2xl font-black text-slate-900 uppercase">{verifStep === 'doc' ? 'ID Document Scan' : 'Liveness verification'}</h3>
                   <p className="text-slate-500 text-sm mt-2">Position your {verifStep === 'doc' ? 'document' : 'face'} within the frame guide.</p>
                </div>
                <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-2 border-slate-200">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 border-[30px] border-black/40 flex items-center justify-center pointer-events-none">
                     <div className={`border-2 border-white/50 border-dashed ${verifStep === 'doc' ? 'w-4/5 h-3/4 rounded-xl' : 'w-2/3 h-2/3 rounded-full'}`}></div>
                  </div>
                  {isVerifying && (
                    <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                       <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                          <div className="h-full bg-white transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Scanning {scanProgress}%</p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleScan} 
                  disabled={isVerifying}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm hover:bg-slate-900 transition-all"
                >
                  {isVerifying ? 'Processing...' : 'Start Capture'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeSubTab === 'wallet' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-950 p-10 rounded-[3rem] text-white border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
               <div className="relative z-10">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Secured Wallet Address</p>
                 <div className="flex items-center gap-4 group cursor-pointer">
                   <h3 className="text-xl font-mono opacity-80 break-all">{user.walletAddress}</h3>
                   <i className="fa-solid fa-copy text-indigo-500 group-hover:scale-120 transition-transform"></i>
                 </div>
                 <div className="grid grid-cols-3 gap-4 mt-12">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Bitcoin (BTC)</p>
                      <p className="text-2xl font-black tracking-tighter">{user.cryptoBalances?.BTC} BTC</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ethereum (ETH)</p>
                      <p className="text-2xl font-black tracking-tighter">{user.cryptoBalances?.ETH} ETH</p>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tether (USDT)</p>
                      <p className="text-2xl font-black tracking-tighter">${user.cryptoBalances?.USDT}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'sales' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.5rem] flex items-center justify-center text-2xl shadow-lg"><i className="fa-solid fa-wallet"></i></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier Limit</p>
                <p className="text-3xl font-black text-slate-900 mt-0.5 tracking-tighter">${user.transactionLimit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-2xl text-slate-900 tracking-tight">Active Inventory</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {myItems.map(item => (
                <div key={item.id} className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-colors group">
                  <img src={item.image} className="w-20 h-20 object-cover rounded-2xl shadow-md" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900 text-2xl tracking-tighter">${item.price}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Status: Active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50">
            <h3 className="font-black text-2xl text-slate-900">Financial History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ref / TX Hash</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Method</th>
                  <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Item</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/50">
                    <td className="px-10 py-8">
                      <p className="font-mono text-xs font-bold text-slate-400 uppercase">{trx.id}</p>
                    </td>
                    <td className="px-10 py-8 font-bold text-slate-800">{trx.productName}</td>
                    <td className="px-10 py-8 text-right font-black text-slate-900 text-xl tracking-tighter">${trx.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
