import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import AdminSidebar from '@/components/AdminSidebar';

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

  return (
    <div className="min-h-screen bg-slate-955 flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* Responsive Mobile Header + Sidebar */}
      <AdminSidebar name={name} />

      {/* Main page workspace content */}
      <main className="flex-1 overflow-y-auto lg:h-screen bg-slate-950 p-4 sm:p-6 md:p-10 w-full max-w-full">
        {children}
      </main>
    </div>
  );
}
