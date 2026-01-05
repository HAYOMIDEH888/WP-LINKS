
import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Message, Product } from '../types';
import { getNegotiationAdvice } from '../geminiService';

interface MessagesProps {
  chats: ChatSession[];
  products: Product[];
}

const Messages: React.FC<MessagesProps> = ({ chats, products }) => {
  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id || '');
  const [input, setInput] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isHandshaking, setIsHandshaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
  const activeProduct = products.find(p => p.id === activeChat?.productId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isP2P = activeProduct?.category === 'Crypto Assets';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [activeChat?.messages.length]);

  useEffect(() => {
    if (isP2P) {
      setIsHandshaking(true);
      const timer = setTimeout(() => setIsHandshaking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeChatId, isP2P]);

  const handleSend = (text?: string, imageUrl?: string) => {
    if (!text?.trim() && !imageUrl) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: imageUrl,
      timestamp: new Date(),
      isEncrypted: isP2P,
      encryptionHash: isP2P ? `sha256:${Math.random().toString(16).slice(2, 10)}...` : undefined
    };
    
    if (activeChat) {
      activeChat.messages.push(newMessage);
      activeChat.lastMessage = imageUrl ? 'Sent an image' : (text || '');
      setInput('');
      setAdvice(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSend(undefined, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetAdvice = async () => {
    if (!activeProduct || !activeChat) return;
    setLoadingAdvice(true);
    const history = activeChat.messages.map(m => `${m.sender}: ${m.text || '[Image]'}`).join('\n');
    const suggestion = await getNegotiationAdvice(history, activeProduct.price);
    setAdvice(suggestion);
    setLoadingAdvice(false);
  };

  if (!activeChat) return <div className="p-20 text-center text-slate-400">No active conversations.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-6rem)] bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-black text-xl text-slate-900 tracking-tight">Vault Chats</h3>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">{chats.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full p-6 text-left hover:bg-white transition-all border-b border-slate-50 flex items-center gap-4 ${
                  activeChatId === chat.id ? 'bg-white border-l-4 border-l-indigo-600' : ''
                }`}
              >
                <div className="relative">
                  <img src={chat.participantAvatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-slate-900 truncate">{chat.participantName}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Live</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {isP2P ? <i className="fa-solid fa-shield-halved mr-1 text-indigo-500"></i> : null}
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-1 flex-col relative bg-slate-50/20">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <img src={activeChat.participantAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20" alt="" />
              <div>
                <h4 className="font-bold text-slate-900 leading-none">{activeChat.participantName}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">
                    {isP2P ? 'Secure Trading Link' : 'Standard Connection'}
                  </span>
                </div>
              </div>
            </div>
            {isP2P && (
              <div className="px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 flex items-center gap-2">
                <i className="fa-solid fa-lock text-indigo-600 text-xs"></i>
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">E2EE ACTIVE</span>
              </div>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {isHandshaking && (
               <div className="flex justify-center py-4">
                 <div className="bg-indigo-950 text-indigo-400 px-6 py-3 rounded-2xl border border-indigo-500/30 flex items-center gap-3 animate-pulse">
                   <i className="fa-solid fa-microchip fa-spin"></i>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exchanging Encryption Keys...</span>
                 </div>
               </div>
            )}
            
            {activeChat.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] space-y-1`}>
                  <div className={`p-4 rounded-[2rem] text-sm leading-relaxed shadow-sm relative group ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} className="max-w-full rounded-2xl mb-2 border border-black/10" alt="Sent" />
                    )}
                    {msg.text && <p className="font-medium">{msg.text}</p>}
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-1 opacity-60">
                         {msg.isEncrypted && <i className="fa-solid fa-lock text-[8px]"></i>}
                         <span className="text-[8px] font-black uppercase tracking-[0.1em]">
                          {msg.isEncrypted ? 'AES-256' : 'Standard'}
                         </span>
                      </div>
                      <span className="text-[8px] opacity-60 font-black uppercase">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.isEncrypted && (
                      <div className="absolute top-0 right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-indigo-400 p-2 rounded-xl text-[8px] font-mono whitespace-nowrap shadow-xl border border-white/5 pointer-events-none">
                        {msg.encryptionHash}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Advice UI Overlay */}
          {advice && (
            <div className="absolute bottom-28 left-8 right-8 p-6 bg-slate-900 text-white rounded-[2rem] shadow-2xl border border-white/10 animate-slideUp">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">AI Sales Agent Advice</span>
                <button onClick={() => setAdvice(null)} className="text-white/30 hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-indigo-50">"{advice}"</p>
            </div>
          )}

          {/* Input */}
          <div className="p-8 bg-white border-t border-slate-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGetAdvice}
                disabled={loadingAdvice}
                className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                title="AI Advice"
              >
                {loadingAdvice ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
              </button>

              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder={isP2P ? "Secure encrypted message..." : "Type a message..."}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend(input)}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <i className="fa-solid fa-shield-keyhole text-lg"></i>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <button 
                onClick={() => handleSend(input)}
                className="w-16 h-16 bg-indigo-700 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-slate-900 shadow-xl shadow-indigo-100 transition-all active:scale-90"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
