"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Upload, IndianRupee, LogOut, Package, ChevronDown } from 'lucide-react';

export default function SellPage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    sell_price: '',
    rent_price_per_day: '',
    type: 'FOR SALE',
    description: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) { router.push('/login'); return; }

      // Step 1: Create the item as JSON
      const payload = {
        title: formData.title,
        is_for_sale: formData.type === 'FOR SALE',
        is_for_rent: formData.type === 'FOR RENT',
        sell_price: formData.type === 'FOR SALE' ? parseFloat(formData.sell_price) : null,
        rent_price_per_day: formData.type === 'FOR RENT' ? parseFloat(formData.rent_price_per_day) : null,
        description: formData.description,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(err.detail) || "Failed to create item");
      }

      const createdItem = await res.json();

      // Step 2: Upload each image one by one
      for (const image of images) {
        const form = new FormData();
        form.append("file", image);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${createdItem.id}/images`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }

      router.push('/explore');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col" onClick={() => setIsProfileOpen(false)}>
      <div className="fixed inset-0 -z-10 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/img2.png')" }} />

      <nav className="z-50 bg-[#8B5E3C] px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="text-white text-3xl font-black tracking-tighter cursor-pointer" onClick={() => router.push('/explore')}>AGORA</div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-8 text-white font-bold text-lg">
          <button onClick={() => router.push('/explore')} className="hover:text-white/80 transition-colors">Buy</button>
          <button className="text-white border-b-2 border-white">Sell</button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-1 hover:text-white/80 transition-all">
              <UserCircle size={36} />
              <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#FFF8EE] rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-[60]" onClick={(e) => e.stopPropagation()}>
                <div className="p-3 border-b border-[#D4A373]/20"><p className="text-[#5D4037] text-xs font-black uppercase tracking-wider">Account Settings</p></div>
                <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left"><UserCircle size={18} /> My Profile</button>
                <button onClick={() => router.push('/my-listings')} className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"><Package size={18} /> My Listings</button>
                <button onClick={() => { localStorage.removeItem("access_token"); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm text-left border-t"><LogOut size={18} /> Log Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center py-0.5 px-6">
        <div className="bg-[#FFF8EE]/95 backdrop-blur-md rounded-[40px] p-8 shadow-2xl border border-white/50 w-full max-w-xl">
          <div className="mb-6">
            <h2 className="text-[#5D4037] text-3xl font-bold mb-1">List Your Item</h2>
            <p className="text-[#8B5E3C] font-medium italic">Enter details to post on the community board.</p>
          </div>

          {error && <p className="text-red-500 font-semibold text-sm mb-4 break-all">{error}</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="w-full h-32 border-2 border-dashed border-[#D4A373]/50 rounded-3xl flex flex-col items-center justify-center text-[#8B5E3C] bg-white/40 hover:bg-white/70 transition-all cursor-pointer group">
              <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm text-center px-4">
                {images.length > 0 ? `${images.length} image(s) selected` : "Click to upload images (max 5)"}
              </span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#5D4037] font-bold text-sm ml-1">Listing Type</label>
                <select className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-4 outline-none font-semibold text-[#5D4037]"
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="FOR SALE">FOR SALE</option>
                  <option value="FOR RENT">FOR RENT</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[#5D4037] font-bold text-sm ml-1">Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4A373]" size={16} />
                  <input type="number" placeholder="0" required
                    value={formData.type === 'FOR SALE' ? formData.sell_price : formData.rent_price_per_day}
                    onChange={(e) => setFormData({...formData, [formData.type === 'FOR SALE' ? 'sell_price' : 'rent_price_per_day']: e.target.value})}
                    className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 pl-10 pr-4 outline-none font-bold text-[#5D4037]" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm ml-1">Item Name</label>
              <input type="text" placeholder="e.g. Scientific Calculator" required value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-6 outline-none font-medium text-[#5D4037]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm ml-1">Description</label>
              <textarea
                placeholder="Describe your item..."
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-6 outline-none font-medium text-[#5D4037] resize-none"
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#8B5E3C] hover:bg-[#5D4037] text-white py-3.5 rounded-2xl font-black text-xl shadow-lg mt-2 transition-all active:scale-[0.98] disabled:opacity-60">
              {loading ? 'Posting...' : 'POST TO BOARD'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
