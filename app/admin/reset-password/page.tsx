"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Missing token link');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/reset-password-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Reset failed');

      setSuccess('Password updated and 2FA disabled successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Invalid or expired password reset link. Please request a new one.</span>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-sm text-brand-orange hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Go back to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* New Password */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
            required
            disabled={!!success}
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
            required
            disabled={!!success}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !!success}
        className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 font-semibold rounded-xl text-white transition-all cursor-pointer shadow-lg shadow-orange-500/20"
      >
        {loading ? 'Updating Password...' : 'Save New Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-955 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading text-white mb-2 font-heading">Choose New Password</h2>
            <p className="text-slate-400 text-sm">Please set your new secure login password</p>
          </div>

          <Suspense fallback={
            <div className="text-center text-slate-400 py-6 text-sm">Loading security context...</div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
