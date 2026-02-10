"use client";
import React, { useState } from 'react';
import { Search, UserCircle, LogOut, Package, ChevronDown, X, Phone, Mail, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

const INITIAL_ITEMS = [
  { id: 1, title: "Cycle", price: "3,000", type: "FOR SALE", img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400", owner: "Rahul Sharma", contact: "+91 98765 43210", email: "rahul.s@campus.edu", description: "Well-maintained mountain bike. 21 gears, disc brakes. Recently serviced." },
  { id: 2, title: "PS4 + controllers", price: "9,000", type: "FOR SALE", img: "https://images.unsplash.com/photo-1507450491964-1bf91f5b241f?w=400", owner: "Ananya Iyer", contact: "+91 88776 55443", email: "ananya.i@campus.edu", description: "Slim model, 500GB. Includes 2 original DualShock controllers." },
  { id: 3, title: "Kettle + Bucket", price: "300", type: "FOR SALE", img: "https://images.unsplash.com/photo-1594235412411-29875eca0165?w=400", owner: "Vikram Singh", contact: "+91 77665 54433", email: "v.singh@campus.edu", description: "Basic hostel essentials. Kettle is 1.5L and boils fast." },
  { id: 4, title: "Puma Sneakers", price: "1,200", type: "FOR SALE", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", owner: "Kevin Joseph", contact: "+91 99001 12233", email: "kevin.j@campus.edu", description: "UK Size 9. Only worn twice. Very comfortable." },
  { id: 5, title: "Textbooks", price: "500", type: "FOR SALE", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400", owner: "Sanya M.", contact: "+91 91122 33445", email: "sanya.m@campus.edu", description: "Core engineering textbooks for Semester 3. Minimal highlighting." },
  { id: 6, title: "Calculator", price: "500", type: "FOR SALE", img: "https://images.unsplash.com/photo-1574607383476-f517f220d398?w=400", owner: "Rohan D.", contact: "+91 92233 44556", email: "rohan.d@campus.edu", description: "Scientific calculator (fx-991ES Plus). Perfect for exams." },
  { id: 7, title: "Wireless Keyboard", price: "400", type: "FOR SALE", img: "https://images.unsplash.com/photo-1587829741301-dc798b83dadc?w=400", owner: "Ishani K.", contact: "+91 93344 55667", email: "ishani.k@campus.edu", description: "Bluetooth keyboard, compatible with tablets and laptops." },
  { id: 9, title: "Chair", price: "200 /mo", type: "FOR RENT", img: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400", owner: "Amit P.", contact: "+91 94455 66778", email: "amit.p@campus.edu", description: "Ergonomic study chair. Renting out for the semester." },
];

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = INITIAL_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" onClick={() => setIsProfileOpen(false)}>
      <div className="fixed inset-0 -z-10 bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/img2.png')" }} />

      <nav className="sticky top-0 z-50 bg-[#8B5E3C] px-8 py-3 flex items-center justify-between shadow-xl">
        <div className="text-white text-3xl font-black tracking-tighter cursor-pointer" onClick={() => router.push('/explore')}>AGORA</div>
        
        <div className="flex-1 max-w-xl mx-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={18} />
          <input 
            type="text" 
            placeholder="Search for items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#D4A373]/40 border-none rounded-lg py-2.5 pl-12 pr-4 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-8 text-white font-bold text-lg">
          <button className="border-b-2 border-white">Buy</button>
          <button onClick={() => router.push('/sell')} className="hover:text-white/80 transition-colors">Sell</button>
          
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setIsProfileOpen(!isProfileOpen); }} className="flex items-center gap-1 hover:text-white/80 transition-all">
              <UserCircle size={36} />
              <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#FFF8EE] rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-[60]" onClick={(e) => e.stopPropagation()}>
                <div className="p-3 border-b border-[#D4A373]/20"><p className="text-[#5D4037] text-xs font-black uppercase tracking-wider">Account Settings</p></div>
                <button onClick={() => { setIsProfileOpen(false); router.push('/profile'); }} className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left"><UserCircle size={18} /> My Profile</button>
                <button onClick={() => { setIsProfileOpen(false); router.push('/my-listings'); }} className="w-full flex items-center gap-3 px-4 py-4 text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"><Package size={18} /> My Listings</button>
                <button onClick={() => { setIsProfileOpen(false); router.push('/login'); }} className="w-full flex items-center gap-3 px-4 py-4 text-red-600 hover:bg-red-50 transition-colors font-bold text-sm text-left border-t border-[#D4A373]/10"><LogOut size={18} /> Log Out</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-[#5D4037] text-4xl font-bold drop-shadow-sm">{searchTerm ? `Results for "${searchTerm}"` : "Items for Sale/Rent"}</h2>
          <p className="text-[#5D4037] font-semibold opacity-70">{filteredItems.length} items found</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="bg-[#FFF8EE]/90 backdrop-blur-sm rounded-[35px] p-6 shadow-2xl border border-white/40 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className={`self-start px-4 py-1.5 rounded-lg text-[11px] font-black text-white mb-4 ${item.type.includes('SALE') ? 'bg-[#E6A04D]' : 'bg-[#4A7BB7]'}`}>{item.type}</div>
              <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-white shadow-inner flex items-center justify-center p-4">
                <img src={item.img} alt={item.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-[#5D4037] font-bold text-xl mb-1">{item.title}</h3>
              <p className="text-[#5D4037] text-3xl font-black">₹{item.price}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-[#FFF8EE] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[50px] shadow-2xl flex flex-col md:flex-row relative animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/80 rounded-full text-[#5D4037] hover:bg-[#8B5E3C] hover:text-white transition-all shadow-md">
              <X size={24} />
            </button>

            <div className="md:w-1/2 bg-white flex items-center justify-center p-12">
              <img src={selectedItem.img} alt={selectedItem.title} className="max-w-full max-h-[400px] object-contain drop-shadow-2xl" />
            </div>

            <div className="md:w-1/2 p-10 flex flex-col overflow-y-auto">
              <span className={`self-start px-4 py-1.5 rounded-lg text-[12px] font-black text-white mb-4 ${selectedItem.type.includes('SALE') ? 'bg-[#E6A04D]' : 'bg-[#4A7BB7]'}`}>{selectedItem.type}</span>
              <h2 className="text-[#5D4037] text-4xl font-black mb-2">{selectedItem.title}</h2>
              <p className="text-[#8B5E3C] text-4xl font-black mb-8">₹{selectedItem.price}</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#D4A373]/20 p-2 rounded-xl text-[#8B5E3C]"><Info size={20}/></div>
                  <div>
                    <p className="text-[#5D4037] font-black text-xs uppercase mb-1 tracking-wider">About this item</p>
                    <p className="text-[#5D4037]/80 font-medium leading-relaxed">{selectedItem.description}</p>
                  </div>
                </div>
                <hr className="border-[#D4A373]/20" />
                <div className="space-y-4">
                  <p className="text-[#5D4037] font-black text-xs uppercase tracking-wider">Owner Contact</p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#8B5E3C] rounded-full flex items-center justify-center text-white font-bold">{selectedItem.owner.charAt(0)}</div>
                    <p className="text-[#5D4037] font-bold text-lg">{selectedItem.owner}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <a href={`tel:${selectedItem.contact}`} className="flex items-center gap-3 p-3 bg-white border border-[#D4A373]/30 rounded-2xl text-[#8B5E3C] font-bold hover:bg-[#8B5E3C] hover:text-white transition-all">
                      <Phone size={18} /> {selectedItem.contact}
                    </a>
                    <a href={`mailto:${selectedItem.email}`} className="flex items-center gap-3 p-3 bg-white border border-[#D4A373]/30 rounded-2xl text-[#8B5E3C] font-bold hover:bg-[#8B5E3C] hover:text-white transition-all">
                      <Mail size={18} /> {selectedItem.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}