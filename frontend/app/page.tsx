import { redirect } from 'next/navigation';

export default function Home() {
  // This tells the browser: "Don't show the default page, go to /login instead"
  redirect('/login');
}