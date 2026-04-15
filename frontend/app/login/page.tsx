"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const validate = (data: Partial<FormData>, isLogin: boolean): string | null => {
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Please enter a valid email address.";
  if (!data.password || data.password.length < 6)
    return "Password must be at least 6 characters.";
  if (!isLogin) {
    if (!data.full_name || data.full_name.trim().length < 2)
      return "Please enter your full name.";
    if (!data.phone || !/^\+?[\d\s\-]{7,15}$/.test(data.phone))
      return "Please enter a valid phone number.";
    if (data.password !== data.confirmPassword)
      return "Passwords do not match.";
  }
  return null;
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate(form, isLogin);
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        localStorage.setItem("access_token", data.session?.access_token || "");
        router.push('/explore');
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name.trim(),
              phone: form.phone.trim(),
            },
          },
        });
        if (error) throw error;
        setForm({ full_name: '', email: '', phone: '', password: '', confirmPassword: '' });
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-8 py-4 bg-white border-2 border-gray-100 rounded-full outline-none focus:border-[#2da2c8] transition-all text-lg shadow-sm text-gray-900 placeholder:text-gray-500 font-medium";

  return (
    <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-end md:pr-40"
         style={{ backgroundImage: "url('/img1.png')" }}>

      <div className="hidden lg:block absolute left-20 top-12 select-none">
        <h1 className="text-[100px] font-[1000] text-black tracking-tighter leading-none drop-shadow-sm">AGORA</h1>
        <p className="text-2xl font-bold text-black/80 ml-2 mt-1">A shared space for shared things.</p>
      </div>

      <div className="w-[90%] max-w-[460px] bg-[#FFF8EE]/95 backdrop-blur-sm p-12 rounded-[60px] shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Agora'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 px-5 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" required
                value={form.full_name} onChange={update('full_name')}
                className={inputClass} />
              <input type="tel" placeholder="Phone (e.g. +91 98765 43210)" required
                value={form.phone} onChange={update('phone')}
                className={inputClass} />
            </>
          )}

          <input type="email" placeholder="Email" required
            value={form.email} onChange={update('email')}
            className={inputClass} />

          <input type="password" placeholder="Password" required
            value={form.password} onChange={update('password')}
            className={inputClass} />

          {!isLogin && (
            <input type="password" placeholder="Confirm Password" required
              value={form.confirmPassword} onChange={update('confirmPassword')}
              className={inputClass} />
          )}

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-2 rounded-full font-bold text-white text-2xl shadow-xl transition-all active:scale-95 disabled:opacity-60 bg-[#2da2c8]">
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-gray-900 font-bold text-sm hover:text-[#2da2c8] transition-colors border-b-2 border-[#2da2c8]">
            {isLogin ? "New to Agora? Create Account" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}