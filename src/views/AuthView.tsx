import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Zap, Clock, DollarSign } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both your email address and a password.');
      return;
    }

    if (password.length < 4) {
      setError('Password should be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('omerkilic80@gmail.com');
    setPassword('password123');
    setIsSubmitting(true);
    setError(null);
    try {
      await login('omerkilic80@gmail.com', 'password123');
    } catch (err: any) {
      setError('Could not sign in with demo account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gentle background ambient circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F0F4F2]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F0F4F2]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand header */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#4F6D7A] flex items-center justify-center text-white shadow-lg shadow-[#4F6D7A]/20">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <h1 className="text-center text-3xl font-light tracking-tight text-[#1A202C]">
          Monthly Will Ledger
        </h1>
        <p className="mt-2 text-center text-sm text-[#718096] max-w-xs mx-auto">
          A calm, supportive space to balance your mental energy, time, and budget.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex justify-center items-center gap-2 mt-4 text-[11px] text-[#718096]">
          <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#EDEAE5]">
            <Zap className="w-3 h-3 text-amber-500" /> Will Energy
          </span>
          <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#EDEAE5]">
            <Clock className="w-3 h-3 text-blue-500" /> Time Limits
          </span>
          <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#EDEAE5]">
            <DollarSign className="w-3 h-3 text-[#4F6D7A]" /> Budget
          </span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs border border-[#EDEAE5] rounded-3xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#F7F9F9] p-1 mb-6 border border-[#EDEAE5]">
            <button
              id="tab-sign-in"
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError(null);
              }}
              className={`w-1/2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-[#1A202C] shadow-xs'
                  : 'text-[#718096] hover:text-[#1A202C]'
              }`}
            >
              Sign In
            </button>
            <button
              id="tab-sign-up"
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError(null);
              }}
              className={`w-1/2 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-[#1A202C] shadow-xs'
                  : 'text-[#718096] hover:text-[#1A202C]'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div
              id="auth-error-banner"
              className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed animate-in fade-in duration-200"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1.5"
                >
                  Your Name (Optional)
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Omer Kilic"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C] placeholder:text-gray-400"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C] placeholder:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-bold uppercase tracking-widest text-[#A0AEC0] mb-1.5"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#4F6D7A] outline-none text-sm text-[#1A202C] placeholder:text-gray-400"
              />
            </div>

            <button
              id="btn-submit-auth"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-medium text-white bg-[#4F6D7A] hover:bg-[#3D545E] transition-colors shadow-lg shadow-[#4F6D7A]/15 disabled:opacity-50 cursor-pointer mt-2"
            >
              <span>{isRegister ? 'Start Your Monthly Ledger' : 'Sign In to Your Ledger'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center">
            <button
              id="btn-quick-demo-login"
              type="button"
              onClick={handleQuickDemo}
              disabled={isSubmitting}
              className="text-xs text-[#4F6D7A] hover:text-[#3D545E] font-medium bg-[#F0F4F2] hover:bg-[#E2EBE8] px-4 py-2 rounded-xl border border-[#EDEAE5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#4F6D7A]" />
              <span>Explore Demo Account (1-Click)</span>
            </button>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#A0AEC0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F6D7A]" />
              <span>Your personal resource data is saved persistently.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
