import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, User, Award, Layers, GraduationCap, Briefcase, Image, Mail, Settings, Globe, Shield } from 'lucide-react';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await checkAuth();
  if (!admin) {
    redirect('/admin/login');
  }

  await dbConnect();
  const profileDoc = await Profile.findOne().lean();
  const name = profileDoc ? (profileDoc as any).name : 'Admin';

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
    <div className="min-h-screen bg-slate-955 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-white/5 bg-slate-900">
            <span className="text-sm font-bold text-white tracking-wide font-heading uppercase">
              {name}&apos;s Workspace
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-sm font-medium transition-all group"
              >
                <div className="text-slate-500 group-hover:text-brand-orange transition-colors">
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 space-y-2 bg-slate-900">
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

      {/* Main page content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-950 p-8 md:p-10">
        {children}
      </main>
    </div>
  );
}
