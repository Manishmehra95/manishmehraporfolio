"use client";

import { useEffect, useState } from 'react';
import { Loader2, Shield, ShieldAlert, ShieldCheck, Copy, Check } from 'lucide-react';

export default function SecurityDashboard() {
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [setupCode, setSetupCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const fetch2FAStatus = async () => {
    try {
      const res = await fetch('/api/auth/2fa/status');
      if (!res.ok) throw new Error('Failed to load security settings');
      const data = await res.json();
      setTwoFactorEnabled(data.enabled);
    } catch (err: any) {
      setError(err.message || 'Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch2FAStatus();
  }, []);

  const handleStartSetup = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/2fa/setup');
      if (!res.ok) throw new Error('Failed to start 2FA setup');
      const data = await res.json();
      setSetupData({ qrCode: data.qrCode, secret: data.secret });
    } catch (err: any) {
      setError(err.message || 'Failed to start setup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupCode) return;

    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: setupCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify code');

      setTwoFactorEnabled(true);
      setSetupData(null);
      setSetupCode('');
      setSuccess('Google Authenticator 2FA enabled successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to enable 2FA');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableCode) return;

    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: disableCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to disable 2FA');

      setTwoFactorEnabled(false);
      setDisableCode('');
      setSuccess('Google Authenticator 2FA has been disabled.');
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-heading">Two-Factor Authentication (2FA)</h1>
        <p className="text-slate-400 text-sm">Add an extra layer of security using Google Authenticator or Microsoft Authenticator</p>
      </div>

      {/* Security Status Box */}
      <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              twoFactorEnabled 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-450' 
                : 'bg-orange-500/10 border-orange-500/20 text-brand-orange'
            }`}>
              {twoFactorEnabled ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Google Authenticator</h2>
              <p className="text-sm text-slate-400 mt-1">
                Status: <span className={twoFactorEnabled ? 'text-emerald-400 font-bold' : 'text-brand-orange font-bold'}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </p>
            </div>
          </div>

          {!twoFactorEnabled && !setupData && (
            <button
              onClick={handleStartSetup}
              disabled={actionLoading}
              className="px-6 py-3.5 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
              Enable 2FA Security
            </button>
          )}
        </div>

        {/* Global Messages */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-405 rounded-xl text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* 2FA SETUP UI */}
        {setupData && !twoFactorEnabled && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Configure Authenticator App</h3>
              <ol className="list-decimal list-inside text-sm text-slate-300 space-y-3">
                <li>Download <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong> on your phone.</li>
                <li>Open the app and choose to <strong>Scan a QR Code</strong>.</li>
                <li>Scan the barcode displayed below:</li>
              </ol>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-900 border border-white/5 rounded-2xl">
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center shrink-0">
                <img src={setupData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-4 flex-1">
                <p className="text-sm text-slate-350 leading-relaxed">
                  If you cannot scan the QR code, you can manually enter the secret key into your authenticator app:
                </p>
                <div className="flex items-center gap-2">
                  <code className="bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-brand-orange text-sm font-mono tracking-wider font-semibold block flex-1 break-all">
                    {setupData.secret}
                  </code>
                  <button
                    onClick={handleCopySecret}
                    className="p-3.5 bg-slate-950 border border-white/10 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Copy Secret Key"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleEnable2FA} className="space-y-4 p-6 bg-slate-900 border border-white/5 rounded-2xl">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block">
                  Enter 6-Digit Code from Authenticator App
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    maxLength={6}
                    value={setupCode}
                    onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-base tracking-widest text-center font-mono font-bold focus:outline-none focus:border-brand-blue w-40"
                    required
                  />
                  <button
                    type="submit"
                    disabled={actionLoading || setupCode.length !== 6}
                    className="px-6 py-3 bg-brand-orange hover:bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Verify & Enable 2FA
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* 2FA DISABLE UI */}
        {twoFactorEnabled && (
          <div className="space-y-6">
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <p className="text-sm text-slate-300 leading-relaxed">
                Your account is currently protected by Google Authenticator. You will be prompted to enter the 6-digit security token every time you log in.
              </p>
            </div>

            <form onSubmit={handleDisable2FA} className="p-6 bg-slate-900 border border-white/5 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Disable Two-Factor Authentication</h3>
              <p className="text-xs text-slate-400">
                To turn off 2FA, please verify the action by entering a 6-digit code from your authenticator app below:
              </p>
              <div className="flex gap-4">
                <input
                  type="text"
                  maxLength={6}
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-base tracking-widest text-center font-mono font-bold focus:outline-none focus:border-brand-blue w-40"
                  required
                />
                <button
                  type="submit"
                  disabled={actionLoading || disableCode.length !== 6}
                  className="px-6 py-3 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-red-500/10"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Turn Off 2FA Security
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
