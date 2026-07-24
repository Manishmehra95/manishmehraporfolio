"use client";

import { motion } from 'framer-motion';
import { Download, Calendar, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { IAbout, IProfile } from '@/types';

interface AboutProps {
  about: IAbout;
  profile?: IProfile;
}

export default function About({ about }: AboutProps) {
  const details = [
    { icon: <Calendar className="w-5 h-5 text-brand-orange" />, label: 'Birthday', value: about.dob || 'January 01, 2005' },
    { icon: <Mail className="w-5 h-5 text-brand-blue" />, label: 'Email', value: about.email || 'manishmehra6299@gmail.com' },
    { icon: <Phone className="w-5 h-5 text-emerald-500" />, label: 'Phone', value: about.phone || '+91 9508229454' },
    { icon: <MapPin className="w-5 h-5 text-rose-500" />, label: 'Location', value: about.address || 'Jaipur, Rajasthan, India' },
    { icon: <Globe className="w-5 h-5 text-sky-500" />, label: 'Languages', value: about.languages?.join(', ') || 'English, Hindi' },
  ];

  return (
    <section id="about" className="py-24 bg-[#f5f7fb] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            About <span className="text-brand-orange">Me</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left card highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center sm:text-left shadow-sm">
              <span className="text-3xl font-bold text-brand-orange block mb-2">Fresher</span>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Experience</h3>
              <p className="text-sm text-slate-500">{about.experienceSummary}</p>
            </div>
            
            <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center sm:text-left shadow-sm">
              <span className="text-3xl font-bold text-brand-blue block mb-2">BCA</span>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Education</h3>
              <p className="text-sm text-slate-500">{about.educationSummary}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-slate-100 p-8 md:p-12 rounded-[35px] shadow-sm"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              I am a Passionate Frontend Developer & Programming Enthusiast
            </h3>
            <p className="text-slate-600 leading-relaxed mb-8 text-base whitespace-pre-line">
              {about.aboutText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200/60">
                    {detail.icon}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">{detail.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{detail.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/api/resume/download"
              download="Manish_Mehra_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Download Resume <Download className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
