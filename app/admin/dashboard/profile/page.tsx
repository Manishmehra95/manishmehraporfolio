"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  profession: z.string().min(2, 'Profession must be at least 2 characters'),
  greeting: z.string().min(2, 'Greeting must be at least 2 characters'),
  profilePicture: z.string().min(1, 'Profile picture is required'),
  resumeUrl: z.string().min(1, 'Resume is required'),
  shortIntro: z.string().min(10, 'Short intro must be at least 10 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const profilePicture = watch('profilePicture');
  const resumeUrl = watch('resumeUrl');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        if (data && data.name) {
          reset(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update profile');

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Edit Profile</h1>
        <p className="text-slate-400 text-sm">Update your base professional profile, profile photo, and resume</p>
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
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.name && <span className="text-xs text-rose-500 block">{errors.name.message}</span>}
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Profession</label>
              <input
                type="text"
                {...register('profession')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.profession && <span className="text-xs text-rose-500 block">{errors.profession.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Greeting */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Greeting</label>
              <input
                type="text"
                {...register('greeting')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.greeting && <span className="text-xs text-rose-500 block">{errors.greeting.message}</span>}
            </div>

            {/* Resume Link */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Resume File Link (or PDF Upload)</label>
              <input
                type="text"
                {...register('resumeUrl')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
              {errors.resumeUrl && <span className="text-xs text-rose-500 block">{errors.resumeUrl.message}</span>}
            </div>
          </div>

          {/* Short Intro */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Short Bio Intro</label>
            <textarea
              rows={3}
              {...register('shortIntro')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
            />
            {errors.shortIntro && <span className="text-xs text-rose-500 block">{errors.shortIntro.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            {/* Image Upload for Profile Picture */}
            <ImageUpload
              value={profilePicture || ''}
              onChange={(url) => setValue('profilePicture', url)}
              label="Profile Photo"
            />

            {/* Document Upload for Resume */}
            <ImageUpload
              value={resumeUrl || ''}
              onChange={(url) => setValue('resumeUrl', url)}
              label="Upload Resume Document"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer w-full md:w-auto focus:outline-none"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
