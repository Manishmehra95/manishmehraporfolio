"use client";

import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Upload Image' }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold text-slate-400 block">{label}</label>}

      {value ? (
        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-white/10 group bg-slate-900">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-650 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative w-40 h-40 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-orange/40 bg-slate-900 transition-colors flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-slate-400">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          ) : (
            <>
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Choose File</span>
            </>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            disabled={loading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}

      {error && <span className="text-xs text-rose-500 block">{error}</span>}
    </div>
  );
}
