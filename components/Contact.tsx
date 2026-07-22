"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { IContact } from '@/types';

interface ContactProps {
  contact: IContact;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  message: z.string().min(1, 'Message cannot be empty'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact({ contact }: ContactProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to send message');

      setStatus('success');
      setStatusMessage(`Thank you, ${data.name}! Your message has been received.`);
      reset();
    } catch (err: any) {
      setStatus('error');
      setStatusMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const contactDetails = [
    { icon: <MapPin className="w-6 h-6 text-brand-orange" />, title: 'Location', value: contact.address || 'Vivekananda Global University, Jaipur' },
    { icon: <Mail className="w-6 h-6 text-brand-blue" />, title: 'Email', value: contact.email || 'manishmehra6299@gmail.com' },
    { icon: <Phone className="w-6 h-6 text-emerald-500" />, title: 'Phone', value: contact.phone || '+91 9508229454' },
  ];

  return (
    <section id="contact" className="py-24 bg-[#f5f7fb] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-black mb-4">
            Get In <span className="text-brand-orange">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Details */}
          <div className="lg:col-span-4 space-y-6">
            {contactDetails.map((detail, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200/60 shrink-0">
                  {detail.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 mb-1">{detail.title}</h4>
                  <p className="text-base font-semibold text-black break-all">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[40px] shadow-sm">
              <h3 className="text-3xl font-bold text-slate-800 text-center mb-2">✨ Register Your Query ✨</h3>
              <p className="text-slate-500 text-sm text-center mb-8">Fill the form below and I&apos;ll connect with you soon!</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="John Doe"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-brand-blue"
                    />
                    {errors.name && <span className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="johndoe@example.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-brand-blue"
                    />
                    {errors.email && <span className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</span>}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+91 9876543210"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-brand-blue"
                  />
                  {errors.phone && <span className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone.message}</span>}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Message</label>
                  <textarea
                    rows={5}
                    {...register('message')}
                    placeholder="Tell me about your project or query..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-sm focus:outline-none focus:border-brand-blue resize-none"
                  />
                  {errors.message && <span className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.message.message}</span>}
                </div>

                {/* Status messages */}
                {status === 'success' && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-brand-blue to-sky-700 hover:from-brand-orange hover:to-orange-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:from-slate-300 disabled:to-slate-300 font-bold rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-500 cursor-pointer text-base shadow-sm hover:shadow-md"
                >
                  {status === 'loading' ? (
                    <>Sending...</>
                  ) : (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
