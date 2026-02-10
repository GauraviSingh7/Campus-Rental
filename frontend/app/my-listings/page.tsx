"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, UserCircle, LogOut, Package, ChevronDown, Trash2, Edit3, ArrowLeft } from 'lucide-react';

// Mock data representing ONLY the items listed by the current user
const MY_ITEMS = [
  { id: 1, title: "Cycle", price: "3,000", type: "FOR SALE", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400" },
  { id: 4, title: "Puma Sneakers", price: "1,200", type: "FOR SALE", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { id: 9, title: "Chair", price: "200 /mo", type: "FOR RENT", img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400" },
];

export default function MyListingsPage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [listings, setListings] = useState(MY_ITEMS);

  // Logic to delete an item
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this listing?")) {
      setListings(listings.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col" onClick={() => setIsProfileOpen(false)}>
      {/* 🖼️ STATIC BACKGROUND */}
      <div 
        className="fixed inset-0 -z-10 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/img2.png')" }}
      />

      {/* 🏷️ AGORA NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#8B5E3C] px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="text-white text-3xl font-black tracking-tighter cursor-pointer" onClick={() => router.push('/explore')}>
          AGORA
        </div>
        
        <div className="flex-1 max-w-xl mx-12 relative opacity-50 cursor-not-allowed">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
           <input disabled type="text" placeholder="Search your items..." className="w-full bg-[#D4A373]/40 border-none rounded-lg py-2.5 pl-12 pr-4 text-white placeholder:text-white/60 outline-none" />
        </div>

        <div className="flex items-center gap-8 text-white font-bold text-lg">
          <button onClick={() => router.push('/explore')} className="hover:text-white/80 transition-colors">Buy</button>
          <button onClick={() => router.push('/sell')} className="hover:text-white/80 transition-colors">Sell</button>
          
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-1">
              <UserCircle size={36} />
              <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* The Dropdown Menu */}
{isProfileOpen && (
  <div 
    className="absolute right-0 mt-3 w-56 bg-[#FFF8EE] rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-[60] animate-in fade-in zoom-in duration-150"
    onClick={(e) => e.stopPropagation()} 
  >
    <div className="p-3 border-b border-[#D4A373]/20">
      <p className="text-[#5D4037] text-xs font-black uppercase tracking-wider">Account Settings</p>
    </div>

    {/* My Profile Button */}
    <button 
      onClick={() => {
        setIsProfileOpen(false); // Close menu
        router.push('/profile');
      }}
      className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left"
    >
      <UserCircle size={18} /> My Profile
    </button>

    {/* My Listings Button */}
    <button 
      onClick={() => {
        setIsProfileOpen(false); // Close menu
        router.push('/my-listings');
      }}
      className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"
    >
      <Package size={18} /> My Listings
    </button>

    {/* Log Out Button */}
    <button 
      onClick={() => {
        setIsProfileOpen(false);
        router.push('/login');
      }}
      className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"
    >
      <LogOut size={18} /> Log Out
    </button>
  </div>
)}
          </div>
        </div>
      </nav>

      {/* 📦 CONTENT AREA */}
      <main className="p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10">
            <button 
                onClick={() => router.push('/explore')}
                className="p-2 bg-[#FFF8EE]/80 rounded-full text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-all shadow-md"
            >
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-[#5D4037] text-4xl font-bold drop-shadow-sm">My Active Listings</h2>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {listings.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#FFF8EE]/90 backdrop-blur-sm rounded-[35px] p-6 shadow-2xl border border-white/40 flex flex-col items-center text-center group"
              >
                <div className={`self-start px-4 py-1.5 rounded-lg text-[11px] font-black text-white mb-4 ${item.type.includes('SALE') ? 'bg-[#E6A04D]' : 'bg-[#4A7BB7]'}`}>
                  {item.type}
                </div>

                <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-white shadow-inner flex items-center justify-center p-4">
                  <img src={item.img} alt={item.title} className="max-w-full max-h-full object-contain" />
                </div>

                <h3 className="text-[#5D4037] font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-[#5D4037] text-3xl font-black mb-6">₹{item.price}</p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 w-full">
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 bg-[#8B5E3C] text-white py-3 rounded-xl font-bold hover:bg-[#5D4037] transition-colors"
                        onClick={() => alert('Editing feature coming soon!')}
                    >
                        <Edit3 size={18} /> Edit
                    </button>
                    <button 
                        className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors border border-red-200"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/20 backdrop-blur-md rounded-[40px] border-2 border-dashed border-[#8B5E3C]/30">
            <p className="text-[#5D4037] text-2xl font-bold italic">You haven't posted anything yet!</p>
            <button 
              onClick={() => router.push('/sell')}
              className="mt-4 bg-[#8B5E3C] text-white px-8 py-3 rounded-xl font-bold shadow-lg"
            >
              Post your first item
            </button>
          </div>
        )}
      </main>
    </div>
  );
}