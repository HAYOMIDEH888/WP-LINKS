
import React, { useState, useEffect } from 'react';

const DeployGuide: React.FC = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'active' | 'missing'>('checking');

  useEffect(() => {
    // Simulate check for the environment variable
    setTimeout(() => {
      if (process.env.API_KEY && process.env.API_KEY !== 'undefined') {
        setApiKeyStatus('active');
      } else {
        setApiKeyStatus('missing');
      }
    }, 1500);
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/40">
            <i className="fa-solid fa-rocket-launch"></i>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tight leading-none uppercase">Go Live Protocol</h2>
            <p className="text-indigo-300 mt-3 text-lg font-medium">Connect your billing account and publish to your users.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${apiKeyStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest">
                {apiKeyStatus === 'checking' ? 'Checking Config...' : apiKeyStatus === 'active' ? 'Billing API Linked' : 'Billing Key Missing'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StepCard 
          num="01"
          title="Secure Your Key"
          desc="Log into your Gmail with active billing. Go to Google AI Studio and copy your 'Production' API Key."
          icon="fa-key"
          color="indigo"
          link="https://aistudio.google.com/app/apikey"
          linkText="Get Key from AI Studio"
        />
        <StepCard 
          num="02"
          title="Hosting Setup"
          desc="Push your files to GitHub. Connect your Repo to Vercel or Netlify. These are free for personal P2P apps."
          icon="fa-cloud-arrow-up"
          color="emerald"
          link="https://vercel.com"
          linkText="Go to Vercel"
        />
        <StepCard 
          num="03"
          title="Link Billing"
          desc="In your hosting dashboard (Vercel), add an Environment Variable named 'API_KEY' and paste your key."
          icon="fa-link-slash"
          color="amber"
          link="#"
          linkText="View Guide"
        />
        <StepCard 
          num="04"
          title="Mobile Install"
          desc="Once live, open your URL on a phone. Tap 'Add to Home Screen' to download it as a native app."
          icon="fa-mobile-screen-button"
          color="slate"
          link="#"
          linkText="PWA Documentation"
        />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Final Deployment Bundle</h3>
        <p className="text-slate-500 mb-8 font-medium">Download these files to your local computer to upload them to your hosting provider.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {['index.html', 'package.json', 'vite.config.ts', 'App.tsx', 'metadata.json', 'types.ts'].map(file => (
            <div key={file} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-500 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                <i className="fa-solid fa-file-code"></i>
              </div>
              <span className="font-bold text-slate-700 text-sm">{file}</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-10 py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all">
          <i className="fa-solid fa-download mr-3"></i> Download Project ZIP
        </button>
      </div>
    </div>
  );
};

const StepCard: React.FC<{ num: string, title: string, desc: string, icon: string, color: string, link: string, linkText: string }> = ({ num, title, desc, icon, color, link, linkText }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500">
    <div className="flex justify-between items-start mb-8">
      <div className={`w-14 h-14 bg-${color}-100 text-${color}-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">{num}</span>
    </div>
    <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{desc}</p>
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors flex items-center gap-2`}
    >
      {linkText} <i className="fa-solid fa-arrow-up-right-from-square"></i>
    </a>
  </div>
);

export default DeployGuide;
