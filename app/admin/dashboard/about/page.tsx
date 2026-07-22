"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

const aboutSchema = z.object({
  aboutText: z.string().min(10, 'About text must be at least 10 characters'),
  experienceSummary: z.string().min(2, 'Experience summary is required'),
  educationSummary: z.string().min(2, 'Education summary is required'),
  dob: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  languagesInput: z.string().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AboutDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        if (!res.ok) throw new Error('Failed to load about data');
        const data = await res.json();
        if (data && data.aboutText) {
          reset({
            ...data,
            languagesInput: data.languages?.join(', ') || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, [reset]);

  const onSubmit = async (data: AboutFormValues) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const languages = data.languagesInput
      ? data.languagesInput.split(',').map((l) => l.trim()).filter((l) => l.length > 0)
      : [];

    const payload = {
      aboutText: data.aboutText,
      experienceSummary: data.experienceSummary,
      educationSummary: data.educationSummary,
      dob: data.dob,
      email: data.email,
      phone: data.phone,
      address: data.address,
      languages,
    };

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update about details');

      setMessage({ type: 'success', text: 'About section updated successfully!' });
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
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Edit About Section</h1>
        <p className="text-slate-400 text-sm">Update biography, highlights, and personal stats</p>
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

          {/* About Text */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">About Biography Text</label>
            <textarea
              rows={6}
              {...register('aboutText')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
            />
            {errors.aboutText && <span className="text-xs text-rose-500 block">{errors.aboutText.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience Summary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Experience Summary Highlight</label>
              <input
                type="text"
                {...register('experienceSummary')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.experienceSummary && <span className="text-xs text-rose-500 block">{errors.experienceSummary.message}</span>}
            </div>

            {/* Education Summary */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Education Summary Highlight</label>
              <input
                type="text"
                {...register('educationSummary')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.educationSummary && <span className="text-xs text-rose-500 block">{errors.educationSummary.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Birthday */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Birthday Date</label>
              <input
                type="text"
                {...register('dob')}
                placeholder="January 01, 2005"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Personal Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.email && <span className="text-xs text-rose-500 block">{errors.email.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Personal Phone</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Personal Address</label>
              <input
                type="text"
                {...register('address')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Languages Spoken (comma-separated)</label>
            <input
              type="text"
              {...register('languagesInput')}
              placeholder="English, Hindi"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
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
