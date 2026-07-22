import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import Certificate from '@/models/Certificate';
import Skill from '@/models/Skill';
import Settings from '@/models/Settings';
import Message from '@/models/Message';
import { Eye, Layers, Award, Sparkles } from 'lucide-react';
import RecentMessages from '@/components/RecentMessages';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    await dbConnect();
    
    const [
      projectsCount,
      certificatesCount,
      skillsCount,
      settings,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Skill.countDocuments(),
      Settings.findOne().lean(),
      Message.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return {
      projectsCount,
      certificatesCount,
      skillsCount,
      visitorsCount: settings ? (settings as any).visitorsCount : 0,
      recentMessages: JSON.parse(JSON.stringify(recentMessages)),
    };
  } catch (e) {
    console.error('Error fetching dashboard stats:', e);
    return {
      projectsCount: 0,
      certificatesCount: 0,
      skillsCount: 0,
      visitorsCount: 0,
      recentMessages: [],
    };
  }
}

export default async function DashboardHome() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Workspace Overview</h1>
        <p className="text-slate-400 text-sm">Monitor activity, statistics, and queries</p>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Visitors */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Eye className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <span className="text-xs text-slate-450 block font-semibold">Total Views</span>
            <span className="text-2xl font-bold text-white">{stats.visitorsCount}</span>
          </div>
        </div>

        {/* Projects */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Layers className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <span className="text-xs text-slate-455 block font-semibold">Total Projects</span>
            <span className="text-2xl font-bold text-white">{stats.projectsCount}</span>
          </div>
        </div>

        {/* Certificates */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <span className="text-xs text-slate-456 block font-semibold">Certificates</span>
            <span className="text-2xl font-bold text-white">{stats.certificatesCount}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="w-6 h-6 text-emerald-450" />
          </div>
          <div>
            <span className="text-xs text-slate-457 block font-semibold">Total Skills</span>
            <span className="text-2xl font-bold text-white">{stats.skillsCount}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <RecentMessages initialMessages={stats.recentMessages} />
    </div>
  );
}
