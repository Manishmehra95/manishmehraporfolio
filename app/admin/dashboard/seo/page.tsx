"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const seoSchema = z.object({
  title: z.string().min(2, 'SEO Title must be at least 2 characters'),
  description: z.string().min(10, 'SEO Description must be at least 10 characters'),
  keywordsInput: z.string().min(2, 'At least one keyword is required'),
  openGraphImage: z.string().optional(),
  favicon: z.string().optional(),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function SeoDashboard() {
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
  } = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
  });

  const openGraphImage = watch('openGraphImage');

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch('/api/seo');
        if (!res.ok) throw new Error('Failed to load SEO data');
        const data = await res.json();
        if (data && data.title) {
          reset({
            ...data,
            keywordsInput: data.keywords?.join(', ') || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, [reset]);

  const onSubmit = async (data: SeoFormValues) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    const keywords = data.keywordsInput
      ? data.keywordsInput.split(',').map((k) => k.trim()).filter((k) => k.length > 0)
      : [];

    const payload = {
      title: data.title,
      description: data.description,
      keywords,
      openGraphImage: data.openGraphImage,
      favicon: data.favicon,
    };

    try {
      const response = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update SEO configurations');

      setMessage({ type: 'success', text: 'SEO settings updated successfully!' });
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
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">SEO Settings</h1>
        <p className="text-slate-400 text-sm">Optimize your metadata, keywords, favicons, and social sharing graphics</p>
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

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">SEO Website Title</label>
            <input
              type="text"
              {...register('title')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.title && <span className="text-xs text-rose-500 block">{errors.title.message}</span>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">SEO Meta Description</label>
            <textarea
              rows={4}
              {...register('description')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
            />
            {errors.description && <span className="text-xs text-rose-500 block">{errors.description.message}</span>}
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Keywords (comma-separated)</label>
            <input
              type="text"
              {...register('keywordsInput')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.keywordsInput && <span className="text-xs text-rose-500 block">{errors.keywordsInput.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <ImageUpload
              value={openGraphImage || ''}
              onChange={(url) => setValue('openGraphImage', url)}
              label="OpenGraph Social Image (1200x630)"
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Favicon Shortcut Link (e.g. /favicon.ico)</label>
              <input
                type="text"
                {...register('favicon')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
              />
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
