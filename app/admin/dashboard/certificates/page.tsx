"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { ICertificate } from '@/types';
import ImageUpload from '@/components/ImageUpload';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.string().min(1, 'Certificate image is required'),
  credentialLink: z.string().optional().or(z.literal('')),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

export default function CertificatesDashboard() {
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
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
    watch,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
  });

  const image = watch('image');

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleEdit = (cert: ICertificate) => {
    setEditingId(cert._id);
    setValue('title', cert.title);
    setValue('issuer', cert.issuer);
    setValue('date', cert.date);
    setValue('image', cert.image);
    setValue('credentialLink', cert.credentialLink || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete certificate');
      setMessage({ type: 'success', text: 'Certificate deleted successfully!' });
      fetchCertificates();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset({ title: '', issuer: '', date: '', image: '', credentialLink: '' });
    setShowForm(false);
  };

  const onSubmit = async (data: CertificateFormValues) => {
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const url = editingId ? `/api/certificates/${editingId}` : '/api/certificates';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to save certificate');

      setMessage({
        type: 'success',
        text: editingId ? 'Certificate updated successfully!' : 'Certificate added successfully!',
      });
      handleCancel();
      fetchCertificates();
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
          <h1 className="text-3xl font-bold text-white mb-2 font-heading">Manage Certificates</h1>
          <p className="text-slate-400 text-sm">Add, update, or delete certificates from your portfolio</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-semibold rounded-xl transition-all cursor-pointer text-sm focus:outline-none"
          >
            <Plus className="w-4 h-4" /> Add Certificate
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
              {editingId ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-white focus:outline-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Certificate Title</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="AWS Certified Cloud Practitioner"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.title && <span className="text-xs text-rose-500 block">{errors.title.message}</span>}
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Issuing Organization</label>
                <input
                  type="text"
                  {...register('issuer')}
                  placeholder="Amazon Web Services"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.issuer && <span className="text-xs text-rose-500 block">{errors.issuer.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Issue Date (e.g. 2025)</label>
                <input
                  type="text"
                  {...register('date')}
                  placeholder="2025"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
                {errors.date && <span className="text-xs text-rose-500 block">{errors.date.message}</span>}
              </div>

              {/* Credential Link */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Verification URL / Credential Link</label>
                <input
                  type="text"
                  {...register('credentialLink')}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="pt-4 border-t border-white/5">
              <ImageUpload
                value={image || ''}
                onChange={(url) => setValue('image', url)}
                label="Certificate Copy/Badge Image"
              />
              {errors.image && <span className="text-xs text-rose-500 block mt-1">{errors.image.message}</span>}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-orange-655 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingId ? 'Update Certificate' : 'Save Certificate'}
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
        {certificates.map((cert) => (
          <div key={cert._id} className="glass-card p-4 rounded-2xl flex flex-col justify-between font-sans">
            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-900 border border-white/5 relative">
              <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
            </div>

            <div className="px-2 pb-2">
              <h3 className="font-bold text-white text-base mb-1 leading-tight">{cert.title}</h3>
              <p className="text-xs text-brand-orange mb-1 font-semibold">{cert.issuer}</p>
              <span className="text-[10px] text-slate-400 block mb-4">{cert.date}</span>

              <div className="flex gap-2 justify-end border-t border-white/5 pt-4">
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-red-405 hover:text-white rounded-lg transition-all cursor-pointer focus:outline-none"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
