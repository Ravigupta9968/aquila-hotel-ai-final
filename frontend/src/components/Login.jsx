import React, { useState } from 'react';
import { Lock, Mail, User, ChevronRight, Sparkles, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'eglobe_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


const getUsersFromStorage = () => {
  return JSON.parse(localStorage.getItem('eglobe_registered_users') || '{}');
};

const saveUserToStorage = (users) => {
  localStorage.setItem('eglobe_registered_users', JSON.stringify(users));
};


const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode]         = useState(true);
  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]               = useState(false);
  const [error, setError]                     = useState('');
  const [successMsg, setSuccessMsg]           = useState('');
  const [loading, setLoading]                 = useState(false);

  const resetMessages = () => { setError(''); setSuccessMsg(''); };

  const switchMode = (loginMode) => {
    setIsLoginMode(loginMode);
    resetMessages();
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const validate = () => {
    if (!email.includes('@') || !email.includes('.'))
      return 'Valid email address enter karein.';
    if (password.length < 6)
      return 'Password minimum 6 characters hona chahiye.';
    if (!isLoginMode) {
      if (!name.trim() || name.trim().length < 2)
        return 'Full name minimum 2 characters hona chahiye.';
      if (password !== confirmPassword)
        return 'Passwords match nahi kar rahe.';
      if (!/[A-Z]/.test(password))
        return 'Password mein ek capital letter (A-Z) hona chahiye.';
      if (!/[0-9]/.test(password))
        return 'Password mein ek number (0-9) hona chahiye.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);

    try {
      const hashed = await hashPassword(password);
      
      
      const storedUsers = getUsersFromStorage();

      if (isLoginMode) {
        
        if (email === 'admin@eglobe.com' && password === 'admin123') {
          onLogin({ name: 'eGlobe Admin', role: 'System Admin', email });
          setLoading(false);
          return;
        }
        
        const key = email.toLowerCase();
        const stored = storedUsers[key];
        
        if (!stored || stored.password !== hashed) {
          setError('Invalid email or password. Please try again.');
        } else {
          onLogin({ name: stored.name, role: 'Business User', email });
        }
      } else {
        const key = email.toLowerCase();
        if (storedUsers[key]) {
          setError('An account with this email already exists!');
          setLoading(false);
          return;
        }
        
       
        storedUsers[key] = { name: name.trim(), password: hashed };
        saveUserToStorage(storedUsers);
        
        setSuccessMsg('Account created successfully! Please sign in.');
        switchMode(true);
        setEmail(email);
      }
    } catch (_) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-100 flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg mb-3 hover:scale-105 transition-transform cursor-default">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">eGlobe Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoginMode ? 'Sign in to your AI Assistant' : 'Create a new Business Account'}
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              isLoginMode
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn size={15} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              !isLoginMode
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus size={15} /> Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {error      && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl text-center">{error}</div>}
          {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold rounded-xl text-center">{successMsg}</div>}

          {!isLoginMode && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={17} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                required={!isLoginMode}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={17} className="text-slate-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Business Email"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={17} className="text-slate-400" />
            </div>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
            >
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {!isLoginMode && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={17} className="text-slate-400" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          )}

          {!isLoginMode && (
            <p className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              Min 6 characters • 1 capital letter (A-Z) • 1 number (0-9)
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-1 w-full text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 group ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {loading
              ? '⏳ Please wait...'
              : isLoginMode ? 'Access Dashboard' : 'Create Account'}
            {!loading && (
              <ChevronRight size={17} className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>

        </form>

        <p className="mt-5 text-center text-[11px] font-medium text-slate-400">
          🔒 Encrypted • Session Protected
        </p>
      </div>
    </div>
  );
};

export default Login;