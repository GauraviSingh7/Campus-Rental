"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserCircle, ChevronDown, Package, LogOut, Camera, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for user details (Institute removed)
  const [user, setUser] = useState({
    name: "Aryan Sharma",
    email: "aryan.s@campus.edu",
    phone: "+91 98765 43210",
    bio: "Looking to sell my old tech and books. Everything is well-maintained!"
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" onClick={() => setIsProfileOpen(false)}>
      <div className="fixed inset-0 -z-10 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/img2.png')" }} />

      {/* 🏷️ AGORA NAVBAR */}
      <nav className="z-50 bg-[#8B5E3C] px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="text-white text-3xl font-black tracking-tighter cursor-pointer" onClick={() => router.push('/explore')}>AGORA</div>
        <div className="flex items-center gap-8 text-white font-bold text-lg">
          <button onClick={() => router.push('/explore')} className="hover:text-white/80 transition-colors">Buy</button>
          <button onClick={() => router.push('/sell')} className="hover:text-white/80 transition-colors">Sell</button>
          
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-1 hover:text-white/80 transition-all">
              <UserCircle size={36} />
              <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#FFF8EE] rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-[60]">
                <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-4 bg-[#8B5E3C] text-white font-bold text-sm text-left"><UserCircle size={18} /> My Profile</button>
                <button onClick={() => router.push('/my-listings')} className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"><Package size={18} /> My Listings</button>
                <button onClick={() => router.push('/login')} className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm text-left border-t"><LogOut size={18} /> Log Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 👤 PROFILE CONTENT */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#FFF8EE]/95 backdrop-blur-md rounded-[40px] p-10 shadow-2xl border border-white/50 w-full max-w-2xl relative">
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-8 right-8 text-[#8B5E3C] font-bold hover:underline flex items-center gap-2"
          >
            {isEditing ? <><X size={18}/> Cancel</> : "Edit Profile"}
          </button>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-[#8B5E3C] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white">
                <UserCircle size={80} />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg text-[#8B5E3C] hover:scale-110">
                  <Camera size={20} />
                </button>
              )}
            </div>

            <h2 className="text-[#5D4037] text-4xl font-black mb-10">{isEditing ? "Editing Profile" : user.name}</h2>

            <div className="w-full space-y-6">
              {isEditing && (
                <div className="space-y-1">
                  <label className="text-[#5D4037] text-xs font-black ml-1 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-3 px-6 text-[#5D4037]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[#5D4037] text-xs font-black ml-1 uppercase">Email Address</label>
                  <input 
                    disabled={!isEditing}
                    type="email" 
                    value={user.email} 
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className={`w-full border-2 rounded-2xl py-3 px-6 font-medium text-[#5D4037] ${isEditing ? 'bg-white border-[#D4A373]/20' : 'bg-transparent border-transparent cursor-default'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#5D4037] text-xs font-black ml-1 uppercase">Phone Number</label>
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={user.phone} 
                    onChange={(e) => setUser({...user, phone: e.target.value})}
                    className={`w-full border-2 rounded-2xl py-3 px-6 font-medium text-[#5D4037] ${isEditing ? 'bg-white border-[#D4A373]/20' : 'bg-transparent border-transparent cursor-default'}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#5D4037] text-xs font-black ml-1 uppercase">Bio / About Me</label>
                <textarea 
                  disabled={!isEditing}
                  rows={3}
                  value={user.bio}
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                  className={`w-full border-2 rounded-2xl py-3 px-6 font-medium text-[#5D4037] resize-none ${isEditing ? 'bg-white border-[#D4A373]/20' : 'bg-transparent border-transparent cursor-default'}`}
                />
              </div>

              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="w-full bg-[#8B5E3C] hover:bg-[#5D4037] text-white py-4 rounded-2xl font-black text-xl shadow-lg mt-4 flex items-center justify-center gap-2"
                >
                  <Save size={24} /> SAVE CHANGES
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}