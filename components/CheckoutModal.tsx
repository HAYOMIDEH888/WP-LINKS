
import React, { useState } from 'react';
import { Product, Transaction } from '../types';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onComplete: (product: Product, tx: Transaction) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, onComplete }) => {
  const [step, setStep] = useState<'review' | 'method' | 'escrow' | 'payment' | 'crypto' | 'success'>('review');
  const [escrowPhase, setEscrowPhase] = useState<'locking' | 'paying' | 'validating' | 'releasing'>('locking');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>('ETH');

  const fee = product.price * 0.025;
  const total = product.price + fee;

  const isP2P = product.category === 'Crypto Assets';

  const startEscrowFlow = () => {
    setStep('escrow');
    setEscrowPhase('locking');
    setTimeout(() => setEscrowPhase('paying'), 3000);
  };

  const handleFiatPay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx: Transaction = {
        id: `WP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        productId: product.id,
        productName: product.name,
        amount: product.price,
        fee: fee,
        date: new Date(),
        status: 'completed',
        paymentMethod: 'card'
      };
      setIsProcessing(false);
      onComplete(product, tx);
      setStep('success');
    }, 2000);
  };

  const handleCryptoPay = () => {
    setIsProcessing(true);
    setEscrowPhase('validating');
    setTimeout(() => {
      setEscrowPhase('releasing');
      setTimeout(() => {
        const tx: Transaction = {
          id: `WP-TX-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
          productId: product.id,
          productName: product.name,
          amount: product.price,
          fee: fee,
          date: new Date(),
          status: 'completed',
          paymentMethod: 'crypto',
          cryptoCurrency: selectedToken,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          escrowStatus: 'released'
        };
        setIsProcessing(false);
        onComplete(product, tx);
        setStep('success');
      }, 3000);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn" onClick={onClose} />
      
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-slideUp">
        {step !== 'success' && (
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg">
                <i className={isP2P ? "fa-solid fa-shield-halved" : "fa-solid fa-shopping-cart"}></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{isP2P ? 'Secure Escrow' : 'Checkout'}</h3>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Willy Paully Protocol v3.1</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-xmark text-slate-400"></i>
            </button>
          </div>
        )}

        <div className="p-8">
          {step === 'review' && (
            <div className="space-y-6">
              <div className="flex gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <img src={product.image} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
                <div className="flex flex-col justify-center">
                  <p className="font-black text-slate-900 text-lg leading-tight">{product.name}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{product.category}</p>
                  <p className="text-indigo-600 font-black mt-2 text-xl">${product.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-bold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Escrow Insurance (2.5%)</span>
                  <span className="text-slate-900 font-bold">${fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-5 flex justify-between items-end">
                  <span className="text-slate-900 font-black text-lg">Final Payout</span>
                  <span className="text-4xl font-black text-indigo-700 tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={isP2P ? startEscrowFlow : () => setStep('method')} 
                className="w-full py-6 bg-indigo-700 text-white rounded-2xl font-black text-lg hover:bg-indigo-800 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:scale-95 uppercase tracking-widest"
              >
                {isP2P ? 'Initialize Secure Escrow' : 'Choose Payment Method'}
              </button>
            </div>
          )}

          {step === 'escrow' && (
            <div className="space-y-8 py-4">
               <div className="relative flex justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                    <div className={`absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin ${escrowPhase === 'releasing' ? 'hidden' : ''}`}></div>
                    <i className={`fa-solid ${escrowPhase === 'locking' ? 'fa-lock' : escrowPhase === 'paying' ? 'fa-wallet' : escrowPhase === 'validating' ? 'fa-network-wired' : 'fa-check'} text-4xl text-indigo-600`}></i>
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="text-center">
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                    {escrowPhase === 'locking' ? 'Locking Assets' : 
                     escrowPhase === 'paying' ? 'Awaiting Payment' : 
                     escrowPhase === 'validating' ? 'Validating Multi-Sig' : 'Transferring'}
                   </h4>
                   <p className="text-slate-500 text-sm font-medium mt-1">
                    {escrowPhase === 'locking' ? 'Securing seller collateral in the smart vault...' : 
                     escrowPhase === 'paying' ? 'Funds will be held until node verification.' : 
                     escrowPhase === 'validating' ? 'Checking 3/3 independent oracle signatures.' : 'Finalizing blockchain release.'}
                   </p>
                 </div>

                 <div className="flex flex-col gap-2">
                    {[
                      { id: 'locking', label: '1. Asset Collateralization', active: escrowPhase === 'locking' || ['paying', 'validating', 'releasing'].includes(escrowPhase) },
                      { id: 'paying', label: '2. Encrypted Payment', active: escrowPhase === 'paying' || ['validating', 'releasing'].includes(escrowPhase) },
                      { id: 'validating', label: '3. Multi-Sig Node Validation', active: escrowPhase === 'validating' || escrowPhase === 'releasing' },
                      { id: 'releasing', label: '4. Decentralized Asset Release', active: escrowPhase === 'releasing' }
                    ].map(stage => (
                      <div key={stage.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${stage.active ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${stage.active ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>
                          {['paying', 'validating', 'releasing'].includes(escrowPhase) && stage.id !== escrowPhase ? <i className="fa-solid fa-check"></i> : null}
                          {stage.id === escrowPhase ? <i className="fa-solid fa-circle-notch fa-spin"></i> : null}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{stage.label}</span>
                      </div>
                    ))}
                 </div>
               </div>

               {escrowPhase === 'paying' && (
                 <button onClick={() => setStep('method')} className="w-full py-5 bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest animate-fadeIn">Pay Securely</button>
               )}
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <h4 className="text-center font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4">Select Encrypted Gateway</h4>
              <button 
                onClick={() => setStep('payment')}
                className="w-full p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] flex items-center gap-6 hover:border-indigo-500 transition-all group shadow-sm"
              >
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900">Verified Card</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Visa / Master / AMEX</p>
                </div>
                <i className="fa-solid fa-chevron-right ml-auto text-slate-300"></i>
              </button>

              <button 
                onClick={() => setStep('crypto')}
                className="w-full p-6 bg-slate-950 text-white border-2 border-slate-800 rounded-[2.5rem] flex items-center gap-6 hover:border-indigo-500 transition-all group shadow-xl"
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl group-hover:bg-indigo-600 transition-colors">
                  <i className="fa-solid fa-bitcoin-sign"></i>
                </div>
                <div className="text-left">
                  <p className="font-black">Digital Asset Node</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Direct Blockchain Payout</p>
                </div>
                <i className="fa-solid fa-chevron-right ml-auto text-slate-700"></i>
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
                <i className="fa-solid fa-fingerprint animate-pulse"></i>
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">ENCRYPTED GATEWAY</h4>
              <p className="text-slate-500 text-sm font-medium">Validating PII encryption layer...</p>
              <button 
                onClick={handleFiatPay}
                disabled={isProcessing}
                className="w-full py-6 bg-indigo-700 text-white rounded-2xl font-black text-lg hover:bg-indigo-800 disabled:bg-slate-300 transition-all uppercase tracking-widest"
              >
                {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : `Verify & Pay $${total.toFixed(2)}`}
              </button>
            </div>
          )}

          {step === 'crypto' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-4 mb-4">
                {['ETH', 'BTC', 'USDT'].map(token => (
                  <button 
                    key={token}
                    onClick={() => setSelectedToken(token)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${selectedToken === token ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {token}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-950 rounded-[3rem] p-10 text-center space-y-6 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="w-40 h-40 bg-white rounded-3xl mx-auto p-4 shadow-2xl relative z-10">
                   <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white/10 text-6xl">
                    <i className="fa-solid fa-qrcode"></i>
                   </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Encrypted Node Address</p>
                  <div className="bg-black/80 p-4 rounded-2xl border border-white/5 flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform">
                    <p className="text-[11px] font-mono text-white/50 truncate flex-1">0x{Math.random().toString(16).substr(2, 36)}...</p>
                    <i className="fa-solid fa-copy text-indigo-500"></i>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-1"></i>
                <p className="text-[10px] text-amber-600 font-bold leading-relaxed uppercase tracking-tight">Node Verification Required. Assets held in Smart Escrow during network confirmation.</p>
              </div>

              <button 
                onClick={handleCryptoPay}
                disabled={isProcessing}
                className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20"
              >
                {isProcessing ? <><i className="fa-solid fa-tower-broadcast fa-spin mr-3"></i> Syncing Nodes...</> : `Commit Secure Payment`}
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="py-16 text-center animate-fadeIn px-6">
              <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 text-5xl shadow-lg ring-4 ring-emerald-100">
                <i className="fa-solid fa-lock-open animate-pulse"></i>
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Assets Released.</h3>
              <p className="text-slate-500 mb-10 font-medium text-lg leading-relaxed">Encrypted ledger updated. Multi-sig verification complete. Your digital assets are now available in your vault.</p>
              <button onClick={onClose} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-2xl uppercase tracking-widest">Return to Market</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
