"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { ISkill } from '@/types';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon class is required'),
  percentage: z.number().min(0, 'Min percentage is 0').max(100, 'Max percentage is 100'),
  category: z.string().min(1, 'Category is required'),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export default function SkillsDashboard() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
  });

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      setSkills(data);
    } catch (e) {
      console.error(e);
    } {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleEdit = (skill: ISkill) => {
    setEditingId(skill._id);
    setValue('name', skill.name);
    setValue('icon', skill.icon);
    setValue('percentage', skill.percentage);
    setValue('category', skill.category);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill');
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
      fetchSkills();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset({ name: '', icon: '', percentage: 0, category: '' });
    setShowForm(false);
  };

  const onSubmit = async (data: SkillFormValues) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to save skill');

      setMessage({
        type: 'success',
        text: editingId ? 'Skill updated successfully!' : 'Skill added successfully!',
      });
      handleCancel();
      fetchSkills();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Manage Skills</h1>
          <p className="text-slate-400 text-sm">Add, update, or delete skills from your portfolio</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm focus:outline-none"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        )}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-2 max-w-4xl ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-405'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {showForm && (
        <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white focus:outline-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Skill Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="JavaScript"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.name && <span className="text-xs text-rose-500 block">{errors.name.message}</span>}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">FontAwesome Icon Class</label>
                <input
                  type="text"
                  {...register('icon')}
                  placeholder="fab fa-js"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.icon && <span className="text-xs text-rose-500 block">{errors.icon.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Percentage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Proficiency Percentage (0 - 100)</label>
                <input
                  type="number"
                  {...register('percentage', { valueAsNumber: true })}
                  placeholder="85"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.percentage && <span className="text-xs text-rose-500 block">{errors.percentage.message}</span>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Skill Category</label>
                <input
                  type="text"
                  {...register('category')}
                  placeholder="Frontend"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.category && <span className="text-xs text-rose-500 block">{errors.category.message}</span>}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-orange-655 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingId ? 'Update Skill' : 'Save Skill'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {skills.map((skill) => (
          <div key={skill._id} className="glass-card p-6 rounded-2xl flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                  <i className={`${skill.icon} text-xl text-brand-orange`} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{skill.name}</h3>
                  <span className="text-xs text-slate-400 block">{skill.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Proficiency:</span>
                <span className="text-sm text-brand-blue font-bold">{skill.percentage}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill._id)}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer focus:outline-none"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
