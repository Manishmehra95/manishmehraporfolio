"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Mail, AlertCircle, ArrowLeft, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Forgot password mode states
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetMethod, setResetMethod] = useState<'email' | 'recovery'>('email');
  
  // Email reset state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Recovery key reset states
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Login failed');

      if (resData.twoFactorRequired) {
        setTwoFactorRequired(true);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/login/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Verification failed');

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to send link');

      setSuccess(resData.message || 'Password reset link sent to your Gmail inbox!');
      setForgotEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryKey || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey, newPassword }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Reset failed');

      setSuccess('Password updated and 2FA disabled successfully! Please log in.');
      setForgotPasswordMode(false);
      setRecoveryKey('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>

        <div className="glass p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          {success && (
            <div className="p-4 mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {forgotPasswordMode ? (
            /* Forgot Password Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-brand-orange mx-auto mb-4">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-white mb-2">Reset Password</h2>
                <p className="text-slate-400 text-sm">
                  {resetMethod === 'email' 
                    ? 'Get a password reset link sent to your registered email' 
                    : 'Use your Security Recovery Key to reset your password'}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Reset Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-white/5 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('email');
                    setError('');
                    setSuccess('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    resetMethod === 'email' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Email Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('recovery');
                    setError('');
                    setSuccess('');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    resetMethod === 'recovery' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Recovery Key (Offline)
                </button>
              </div>

              {resetMethod === 'email' ? (
                /* Email reset link form */
                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@manishmehra.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl text-white transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                /* Offline Recovery Key form */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Recovery Key */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Security Recovery Key</label>
                    <input
                      type="password"
                      value={recoveryKey}
                      onChange={(e) => setRecoveryKey(e.target.value)}
                      placeholder="Enter Recovery Code"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl text-white transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading ? 'Resetting...' : 'Update Password'}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setForgotPasswordMode(false);
                  setError('');
                  setSuccess('');
                  setRecoveryKey('');
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center font-medium"
              >
                Back to Password Login
              </button>
            </div>
          ) : twoFactorRequired ? (
            /* 2FA Verification Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-brand-orange mx-auto mb-4">
                  <Shield className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold font-heading text-white mb-2 font-heading">2FA Security</h2>
                <p className="text-slate-400 text-sm">Enter the 6-digit code from Google Authenticator on your phone</p>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 block text-center">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-xl tracking-[0.6em] text-center font-mono font-bold focus:outline-none focus:border-brand-blue transition-all"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl text-white transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordMode(true);
                    setResetMethod('email');
                    setTwoFactorRequired(false);
                    setVerificationCode('');
                    setError('');
                  }}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center font-medium animate-pulse"
                >
                  Lost your Authenticator Device? Reset Security
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorRequired(false);
                    setVerificationCode('');
                    setError('');
                  }}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-pointer text-center font-medium"
                >
                  Back to Password Login
                </button>
              </form>
            </div>
          ) : (
            /* Password Login Screen */
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-heading text-white mb-2">Admin Portal</h2>
                <p className="text-slate-400 text-sm">Please log in to manage your portfolio</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="admin@manishmehra.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                  {errors.email && (
                    <span className="text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                  {errors.password && (
                    <span className="text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span />
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordMode(true);
                      setResetMethod('email');
                      setError('');
                      setSuccess('');
                      setRecoveryKey('');
                    }}
                    className="text-xs text-brand-orange hover:underline cursor-pointer font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 font-semibold rounded-xl text-white transition-all cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
