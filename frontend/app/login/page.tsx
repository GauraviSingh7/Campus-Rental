"use client";
import React, { useState } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirects to your marketplace grid
    router.push('/explore');
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center md:justify-end md:pr-40" 
         style={{ backgroundImage: "url('/img1.png')" }}>
      
      {/* 🎨 CLEAN BRANDING: Top-left, no slant, no yellow box */}
      <div className="hidden lg:block absolute left-20 top-12 select-none">
        <h1 className="text-[100px] font-[1000] text-black tracking-tighter leading-none drop-shadow-sm">
          AGORA
        </h1>
        <p className="text-2xl font-bold text-black/80 ml-2 mt-1">
          A shared space for shared things.
        </p>
      </div>

      {/* Login/Signup Card */}
      <div className="w-[90%] max-w-[460px] bg-[#FFF8EE]/95 backdrop-blur-sm p-12 rounded-[60px] shadow-2xl border border-white/50">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Agora'}
          </h2>
        </div>

        {/* User/Admin Toggle */}
        <div className="flex bg-gray-200/60 p-1.5 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'student' ? 'bg-white text-[#2da2c8] shadow-md' : 'text-gray-600'}`}
          >
            <User size={18} /> Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-white text-[#ef4444] shadow-md' : 'text-gray-600'}`}
          >
            <ShieldCheck size={18} /> Admin
          </button>
        </div>

        <form onSubmit={handleAction} className="space-y-6">
          {!isLogin && (
             <input 
             type="text" 
             placeholder="Full Name" 
             required
             className="w-full px-8 py-4 bg-white border-2 border-gray-100 rounded-full outline-none focus:border-[#2da2c8] transition-all text-lg shadow-sm text-gray-900 placeholder:text-gray-500 font-medium"
           />
          )}
          
          <input 
            type="text" 
            placeholder="Username" 
            required
            className="w-full px-8 py-4 bg-white border-2 border-gray-100 rounded-full outline-none focus:border-[#2da2c8] transition-all text-lg shadow-sm text-gray-900 placeholder:text-gray-500 font-medium"
          />
          
          <div className="space-y-2">
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full px-8 py-4 bg-white border-2 border-gray-100 rounded-full outline-none focus:border-[#2da2c8] transition-all text-lg shadow-sm text-gray-900 placeholder:text-gray-500 font-medium"
            />
            {isLogin && (
              <div className="text-right pr-6">
                <button type="button" className="text-xs text-gray-500 font-semibold hover:text-[#2da2c8]">Forgot Password?</button>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className={`w-full py-4 mt-4 rounded-full font-bold text-white text-2xl shadow-xl transition-all active:scale-95 ${role === 'admin' ? 'bg-[#ef4444]' : 'bg-[#2da2c8]'}`}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-900 font-bold text-sm hover:text-[#2da2c8] transition-colors border-b-2 border-[#2da2c8]"
          >
            {isLogin ? "New to Agora? Create Account" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}