"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('/api/contact');
        if (!res.ok) throw new Error('Failed to load contact data');
        const data = await res.json();
        if (data && data.email) {
          reset(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [reset]);

  const onSubmit = async (data: ContactFormValues) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to update contact info');

      setMessage({ type: 'success', text: 'Contact details updated successfully!' });
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
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Edit Contact Info</h1>
        <p className="text-slate-400 text-sm">Update the contact coordinates displayed on the public footer and maps</p>
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

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Public Contact Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.email && <span className="text-xs text-rose-500 block">{errors.email.message}</span>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Public Contact Phone</label>
            <input
              type="text"
              {...register('phone')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.phone && <span className="text-xs text-rose-500 block">{errors.phone.message}</span>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">Public Contact Address</label>
            <input
              type="text"
              {...register('address')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
            />
            {errors.address && <span className="text-xs text-rose-500 block">{errors.address.message}</span>}
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
