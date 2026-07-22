"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-rose-400 hover:text-white hover:bg-rose-500/15 rounded-xl text-sm font-medium transition-all cursor-pointer text-left focus:outline-none"
    >
      <LogOut className="w-5 h-5 text-rose-500" />
      <span>Log Out</span>
    </button>
  );
}
