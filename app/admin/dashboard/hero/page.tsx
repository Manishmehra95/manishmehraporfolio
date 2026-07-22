"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

const heroSchema = z.object({
  greeting: z.string().min(2, 'Greeting must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rolesInput: z.string().min(2, 'At least one role is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  contactButtonText: z.string().min(2, 'Contact button text must be at least 2 characters'),
  resumeButtonText: z.string().min(2, 'Resume button text must be at least 2 characters'),
});

type HeroFormValues = z.infer<typeof heroSchema>;

export default function HeroDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch('/api/hero');
        if (!res.ok) throw new Error('Failed to load hero');
        const data = await res.json();
        if (data && data.name) {
          reset({
            ...data,
            rolesInput: data.roles.join(', '),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [reset]);

  const onSubmit = async (data: HeroFormValues) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    const roles = data.rolesInput.split(',').map((r) => r.trim()).filter((r) => r.length > 0);

    const payload = {
      greeting: data.greeting,
      name: data.name,
      roles,
      description: data.description,
      contactButtonText: data.contactButtonText,
      resumeButtonText: data.resumeButtonText,
    };

    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update hero');

      setMessage({ type: 'success', text: 'Hero section updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong' });
    } finally {
      setSaving(false);
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Edit Hero Section</h1>
        <p className="text-slate-400 text-sm">Customize titles, introductions, buttons, and animated roles</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {message.text && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-405'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Greeting */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Greeting Tagline</label>
              <input
                type="text"
                {...register('greeting')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.greeting && <span className="text-xs text-rose-500 block">{errors.greeting.message}</span>}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Display Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.name && <span className="text-xs text-rose-500 block">{errors.name.message}</span>}
            </div>
          </div>

          {/* Animated typing roles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Animated Typing Roles (comma-separated)</label>
            <input
              type="text"
              {...register('rolesInput')}
              placeholder="Frontend Developer, Java Programmer, Web Designer"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.rolesInput && <span className="text-xs text-rose-500 block">{errors.rolesInput.message}</span>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Description Paragraph</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
            />
            {errors.description && <span className="text-xs text-rose-500 block">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Contact Button Text</label>
              <input
                type="text"
                {...register('contactButtonText')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.contactButtonText && <span className="text-xs text-rose-500 block">{errors.contactButtonText.message}</span>}
            </div>

            {/* Resume Button */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Resume Button Text</label>
              <input
                type="text"
                {...register('resumeButtonText')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.resumeButtonText && <span className="text-xs text-rose-500 block">{errors.resumeButtonText.message}</span>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-orange hover:bg-orange-655 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer w-full md:w-auto focus:outline-none"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
