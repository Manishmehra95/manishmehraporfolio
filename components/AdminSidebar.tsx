"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, User, Award, Layers, GraduationCap, 
  Briefcase, Image, Mail, Settings, Globe, Shield, Menu, X 
} from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

interface AdminSidebarProps {
  name: string;
}

export default function AdminSidebar({ name }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer automatically on route navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Profile', href: '/admin/dashboard/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Hero Section', href: '/admin/dashboard/hero', icon: <Image className="w-5 h-5" /> },
    { name: 'About Section', href: '/admin/dashboard/about', icon: <User className="w-5 h-5" /> },
    { name: 'Skills CRUD', href: '/admin/dashboard/skills', icon: <Layers className="w-5 h-5" /> },
    { name: 'Education CRUD', href: '/admin/dashboard/education', icon: <GraduationCap className="w-5 h-5" /> },
    { name: 'Experience CRUD', href: '/admin/dashboard/experience', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Projects CRUD', href: '/admin/dashboard/projects', icon: <Image className="w-5 h-5" /> },
    { name: 'Certificates CRUD', href: '/admin/dashboard/certificates', icon: <Award className="w-5 h-5" /> },
    { name: 'Contact Details', href: '/admin/dashboard/contact', icon: <Mail className="w-5 h-5" /> },
    { name: 'SEO Settings', href: '/admin/dashboard/seo', icon: <Settings className="w-5 h-5" /> },
    { name: '2FA Security', href: '/admin/dashboard/security', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-5 sticky top-0 z-40 w-full shrink-0">
        <span className="text-sm font-bold text-white tracking-wide font-heading uppercase truncate max-w-[200px]">
          {name}&apos;s Workspace
        </span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Slide-Over Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container (Mobile Drawer + Desktop Sidebar) */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 lg:w-64 bg-slate-900 border-r border-white/5 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Header on Desktop & Mobile Drawer */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-900 sticky top-0 z-10">
            <span className="text-sm font-bold text-white tracking-wide font-heading uppercase truncate">
              {name}&apos;s Workspace
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-orange text-white font-bold shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-orange transition-colors'}>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-all"
          >
            <Globe className="w-5 h-5 text-slate-500" />
            <span>View Website</span>
          </Link>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
