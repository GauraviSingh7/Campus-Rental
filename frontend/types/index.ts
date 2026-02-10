export interface Item {
  id: string;
  title: string;
  sell_price: number | null;
  rent_price_per_day: number | null;
  owner_id: string;
  category: string;
  images: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}