"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCircle, ChevronDown, LogOut, Package, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function MyListingsPage() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editItem, setEditItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', sell_price: '', rent_price_per_day: '', type: 'FOR SALE' });

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/login'); return; }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/items/?owner_id=${session.user.id}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        setError('Failed to load your listings.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    const token = localStorage.getItem('access_token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${editItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: editForm.title,
        description: editForm.description,
        is_for_sale: editForm.type === 'FOR SALE',
        is_for_rent: editForm.type === 'FOR RENT',
        sell_price: editForm.type === 'FOR SALE' ? parseFloat(editForm.sell_price) : null,
        rent_price_per_day: editForm.type === 'FOR RENT' ? parseFloat(editForm.rent_price_per_day) : null,
      }),
    });
    const updated = await res.json();
    setItems(items.map(i => i.id === updated.id ? { ...i, ...updated } : i));
    setEditItem(null);
  };

  return (
    <div className="min-h-screen" onClick={() => setIsProfileOpen(false)}>
      <div className="fixed inset-0 -z-10 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/img2.png')" }} />

      <nav className="sticky top-0 z-50 bg-[#8B5E3C] px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="text-white text-3xl font-black tracking-tighter cursor-pointer" onClick={() => router.push('/explore')}>AGORA</div>
        <div className="flex items-center gap-8 text-white font-bold text-lg">
          <button onClick={() => router.push('/explore')} className="hover:text-white/80">Buy</button>
          <button onClick={() => router.push('/sell')} className="hover:text-white/80">Sell</button>
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-1 hover:text-white/80">
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

      <main className="p-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="bg-white/80 p-2 rounded-full shadow hover:bg-white transition-all">
            <ArrowLeft size={20} className="text-[#5D4037]" />
          </button>
          <h2 className="text-[#5D4037] text-4xl font-bold">My Active Listings</h2>
        </div>

        {loading && <p className="text-[#5D4037] text-center text-xl font-semibold">Loading your listings...</p>}
        {error && <p className="text-red-500 text-center text-xl font-semibold">{error}</p>}
        {!loading && items.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-[#5D4037] text-2xl font-bold mb-4">No listings yet!</p>
            <button onClick={() => router.push('/sell')} className="bg-[#8B5E3C] text-white px-8 py-3 rounded-2xl font-bold text-lg hover:bg-[#5D4037] transition-all">
              Post Your First Item
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const type = item.is_for_sale ? "FOR SALE" : "FOR RENT";
            const price = item.sell_price || item.rent_price_per_day;
            return (
              <div key={item.id} className="bg-[#FFF8EE]/90 backdrop-blur-sm rounded-[35px] p-6 shadow-2xl border border-white/40 flex flex-col items-center text-center">
                <div className={`self-start px-4 py-1.5 rounded-lg text-[11px] font-black text-white mb-4 ${type === 'FOR SALE' ? 'bg-[#E6A04D]' : 'bg-[#4A7BB7]'}`}>{type}</div>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-white shadow-inner flex items-center justify-center p-4">
                  {item.images?.[0]?.image_url ? (
                    <img src={item.images[0].image_url} alt={item.title} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-[#D4A373] text-sm font-semibold">No image</div>
                  )}
                </div>
                <h3 className="text-[#5D4037] font-bold text-xl mb-1">{item.title}</h3>
                <p className="text-[#5D4037] text-3xl font-black mb-6">₹{price}</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => { setEditItem(item); setEditForm({ title: item.title, description: item.description || '', sell_price: item.sell_price || '', rent_price_per_day: item.rent_price_per_day || '', type: item.is_for_sale ? 'FOR SALE' : 'FOR RENT' }); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#8B5E3C] text-white py-2.5 rounded-2xl font-bold hover:bg-[#5D4037] transition-all">
                    <Pencil size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2.5 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {editItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditItem(null)}>
          <div className="bg-[#FFF8EE] rounded-[40px] p-8 shadow-2xl w-full max-w-md space-y-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-[#5D4037] text-2xl font-black">Edit Listing</h2>
            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm">Listing Type</label>
              <select className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-4 outline-none font-semibold text-[#5D4037]"
                value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
                <option value="FOR SALE">FOR SALE</option>
                <option value="FOR RENT">FOR RENT</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm">Item Name</label>
              <input className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-4 outline-none font-medium text-[#5D4037]"
                value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm">Price (₹)</label>
              <input type="number" className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-4 outline-none font-bold text-[#5D4037]"
                value={editForm.type === 'FOR SALE' ? editForm.sell_price : editForm.rent_price_per_day}
                onChange={e => setEditForm({...editForm, [editForm.type === 'FOR SALE' ? 'sell_price' : 'rent_price_per_day']: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#5D4037] font-bold text-sm">Description</label>
              <textarea rows={2} className="w-full bg-white border-2 border-[#D4A373]/20 rounded-2xl py-2.5 px-4 outline-none font-medium text-[#5D4037] resize-none"
                value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditItem(null)} className="flex-1 py-3 rounded-2xl border-2 border-[#D4A373]/30 text-[#5D4037] font-bold hover:bg-[#D4A373]/10 transition-all">Cancel</button>
              <button onClick={handleEdit} className="flex-1 py-3 rounded-2xl bg-[#8B5E3C] text-white font-black hover:bg-[#5D4037] transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}