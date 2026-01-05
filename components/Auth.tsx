
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';

interface AuthProps {
  onComplete: (user: User) => void;
}

const COUNTRIES = [
  { 
    code: 'US', 
    name: 'United States', 
    idTypes: ['Driver License', 'Passport', 'SSN'],
    regulatoryBody: 'FINCEN / SEC',
    legalNotice: 'Subject to US Federal AML/KYC laws. High-volume trades may require SSN disclosure.',
    flag: '🇺🇸'
  },
  { 
    code: 'GB', 
    name: 'United Kingdom', 
    idTypes: ['Passport', 'BRP', 'Driving Licence'],
    regulatoryBody: 'FCA / GDPR',
    legalNotice: 'Compliant with UK Financial Conduct Authority and GDPR.',
    flag: '🇬🇧'
  },
  { 
    code: 'NG', 
    name: 'Nigeria', 
    idTypes: ['National ID', 'NIN', 'BVN', 'Voters Card', 'Passport'],
    regulatoryBody: 'CBN / SEC NG',
    legalNotice: 'BVN/NIN validation is mandatory for P2P Fiat-to-Crypto settlement.',
    flag: '🇳🇬'
  },
  { 
    code: 'KE', 
    name: 'Kenya', 
    idTypes: ['National ID', 'Passport', 'Huduma Namba'],
    regulatoryBody: 'CBK / ODPC',
    legalNotice: 'Strict adherence to the Data Protection Act 2019.',
    flag: '🇰🇪'
  },
  { 
    code: 'OTHER', 
    name: 'Other International', 
    idTypes: ['Passport', 'National ID'],
    regulatoryBody: 'FATF Standards',
    legalNotice: 'Aligned with Global AML recommendations.',
    flag: '🌐'
  },
];

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'NG',
    idType: '',
    idNumber: '',
    role: 'customer' as 'admin' | 'customer'
  });
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?u=newuser');
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.code === details.country) || COUNTRIES[0];

  useEffect(() => {
    if (step === 2) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 640 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.translate(canvasRef.current.width, 0);
        context.scale(-1, 1);
        context.drawImage(videoRef.current, 0, 0);
        setAvatar(canvasRef.current.toDataURL('image/jpeg'));
      }
    }
  };

  const finish = () => {
    // Determine admin status automatically for developer ease
    const isAdmin = details.email.toLowerCase().includes('admin') || details.role === 'admin';

    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      name: details.name,
      email: details.email,
      avatar: avatar,
      role: isAdmin ? 'admin' : 'customer',
      isVerified: true,
      joinedDate: new Date(),
      phoneNumber: details.phone,
      country: selectedCountry.name,
      idType: details.idType,
      idNumber: details.idNumber,
      verificationTier: 1,
      transactionLimit: 500,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      cryptoBalances: { BTC: 0, ETH: 0, USDT: 0 }
    });
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col lg:flex-row relative font-sans">
      <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl">W</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Willy Paully<br/><span className="text-indigo-500 text-sm">Links</span></h1>
        </div>
        <div className="max-w-md space-y-6">
          <h2 className="text-5xl font-black text-white leading-none tracking-tighter">Register <span className="text-indigo-500">Vault</span>.</h2>
          <p className="text-slate-400 text-lg">Quick registration for Tier 1 access. Advanced identity scanning can be performed later to increase trading limits.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#0d1117] border border-white/5 rounded-[3rem] p-10 lg:p-14 shadow-2xl">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-indigo-500' : 'bg-slate-800'}`} />)}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-2xl font-black text-white">Account Type</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setDetails({...details, role: 'customer'}); setStep(2); }}
                  className="p-6 bg-black border border-slate-800 rounded-2xl text-left group hover:border-indigo-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black uppercase tracking-widest text-sm">Customer / Trader</span>
                    <i className="fa-solid fa-user text-slate-700 group-hover:text-indigo-500 transition-colors"></i>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">Access the marketplace, chat with sellers, and trade assets.</p>
                </button>
                <button 
                  onClick={() => { setDetails({...details, role: 'admin'}); setStep(2); }}
                  className="p-6 bg-black border border-slate-800 rounded-2xl text-left group hover:border-indigo-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-black uppercase tracking-widest text-sm">Platform Owner</span>
                    <i className="fa-solid fa-crown text-slate-700 group-hover:text-indigo-500 transition-colors"></i>
                  </div>
                  <p className="text-slate-500 text-xs mt-2">Manage the platform, access deployment tools, and billing config.</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Basic Info</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{details.role}</span>
              </div>
              <div className="space-y-4">
                <select className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.country} onChange={e => setDetails({...details, country: e.target.value})}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                </select>
                <input type="text" placeholder="Full Legal Name" className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} />
                <input type="tel" placeholder="Phone Number" className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <h3 className="text-2xl font-black text-white">Profile Photo</h3>
              <div className="relative w-40 h-40 mx-auto group">
                <img src={avatar} className="w-full h-full rounded-full object-cover border-4 border-indigo-500" />
                <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center"><i className="fa-solid fa-upload"></i></button>
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const r = new FileReader();
                    r.onload = () => setAvatar(r.result as string);
                    r.readAsDataURL(file);
                  }
                }} />
              </div>
              <div className="relative aspect-square bg-black rounded-3xl overflow-hidden border border-slate-800">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                <button onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-black text-[10px] font-black uppercase rounded-full">Snap Photo</button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-2xl font-black text-white">ID Verification</h3>
              <p className="text-slate-500 text-sm">Provide your {selectedCountry.name} identification number.</p>
              <div className="space-y-4">
                <select className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.idType} onChange={e => setDetails({...details, idType: e.target.value})}>
                  <option value="">Select ID Type</option>
                  {selectedCountry.idTypes.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
                <input type="text" placeholder="Identification Number" className="w-full px-6 py-4 bg-black border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500" value={details.idNumber} onChange={e => setDetails({...details, idNumber: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(3)} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-2xl">Back</button>
                <button onClick={() => details.idType && details.idNumber && setStep(5)} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl">Verify</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center space-y-8 py-10 animate-fadeIn">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white text-4xl shadow-xl"><i className="fa-solid fa-check"></i></div>
              <h3 className="text-3xl font-black text-white">{details.role === 'admin' ? 'Owner Vault Active' : 'Tier 1 Active'}</h3>
              <p className="text-slate-400">Your account is created. {details.role === 'admin' ? 'You have administrative access to deployment tools.' : 'You can start trading immediately with a $500 limit.'}</p>
              <button onClick={finish} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20">Enter Marketplace</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
