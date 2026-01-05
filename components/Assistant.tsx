
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../geminiService';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Secure Protocol Established. I am the Willy Paully Security Consultant. How can I help you with our Smart Escrow or E2EE trading system today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const context = "User is on Willy Paully Links. We use AES-256 E2EE for all P2P chats. Our Smart Escrow system uses a 4-phase lock-and-release protocol. We charge 2.5% per sale for insurance and validation fees. All users are biometrically verified.";
    const response = await chatWithAssistant(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: response || 'Secure connection lost. Retrying...' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col overflow-hidden animate-slideUp">
          <div className="p-6 bg-slate-950 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <i className="fa-solid fa-fingerprint"></i>
              </div>
              <div>
                <span className="font-black text-sm uppercase tracking-[0.2em] leading-none">Security Node</span>
                <p className="text-[10px] text-indigo-400 font-bold uppercase mt-1">Protocol Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Decrypting...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
            <input 
              type="text"
              placeholder="Query security protocol..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium transition-all"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="w-14 h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl active:scale-90"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-slate-950 text-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center hover:scale-110 hover:bg-indigo-600 transition-all group relative overflow-hidden ring-4 ring-indigo-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center">
            <i className="fa-solid fa-shield-halved text-2xl"></i>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Audit</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default Assistant;
