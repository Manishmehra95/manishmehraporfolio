"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { IExperience } from '@/types';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().optional().or(z.literal('')),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export default function ExperienceDashboard() {
  const [experienceList, setExperienceList] = useState<IExperience[]>([]);
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
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
  });

  const fetchExperience = async () => {
    try {
      const res = await fetch('/api/experience');
      if (!res.ok) throw new Error('Failed to fetch experience details');
      const data = await res.json();
      setExperienceList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const handleEdit = (exp: IExperience) => {
    setEditingId(exp._id);
    setValue('company', exp.company);
    setValue('position', exp.position);
    setValue('duration', exp.duration);
    setValue('description', exp.description);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience item?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete experience details');
      setMessage({ type: 'success', text: 'Experience details deleted successfully!' });
      fetchExperience();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset({ company: '', position: '', duration: '', description: '' });
    setShowForm(false);
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to save experience details');

      setMessage({
        type: 'success',
        text: editingId ? 'Experience updated successfully!' : 'Experience added successfully!',
      });
      handleCancel();
      fetchExperience();
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
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Manage Experience</h1>
          <p className="text-slate-400 text-sm">Create, edit, or remove professional work experience history details</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm focus:outline-none"
          >
            <Plus className="w-4 h-4" /> Add Experience
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
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white focus:outline-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Company / Organization</label>
                <input
                  type="text"
                  {...register('company')}
                  placeholder="Freelance / Self-employed"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.company && <span className="text-xs text-rose-500 block">{errors.company.message}</span>}
              </div>

              {/* Position */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Position / Job Role</label>
                <input
                  type="text"
                  {...register('position')}
                  placeholder="Frontend Developer"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.position && <span className="text-xs text-rose-500 block">{errors.position.message}</span>}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Duration (e.g. 2024 - Present, Jun 2024 - Aug 2024)</label>
              <input
                type="text"
                {...register('duration')}
                placeholder="2024 - Present"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.duration && <span className="text-xs text-rose-500 block">{errors.duration.message}</span>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Description</label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Developed responsive client sites, optimized CSS bundles..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-orange-655 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingId ? 'Update Experience' : 'Save Experience'}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
        {experienceList.map((exp) => (
          <div key={exp._id} className="glass-card p-6 rounded-2xl flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-bold text-brand-blue bg-blue-500/5 px-2.5 py-1 rounded-full border border-blue-500/10 w-fit mb-3 block">
                {exp.duration}
              </span>
              <h3 className="font-bold text-white text-lg">{exp.position}</h3>
              <p className="text-sm font-medium text-slate-400 mb-2">{exp.company}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(exp)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp._id)}
                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-405 hover:text-white rounded-lg transition-all cursor-pointer focus:outline-none"
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
