"use client";

import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { IEducation, IExperience } from '@/types';

interface TimelineProps {
  education: IEducation[];
  experience: IExperience[];
}

export default function Timeline({ education, experience }: TimelineProps) {
  return (
    <section id="timeline" className="py-24 bg-white border-t border-b border-slate-200/50 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            Education & <span className="text-brand-orange">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <GraduationCap className="w-6 h-6 text-brand-orange" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 font-heading">Education</h3>
            </div>

            <div className="relative border-l border-slate-200 ml-6 space-y-8 py-2">
              {education.length === 0 ? (
                <p className="text-slate-500 text-sm ml-8">No education details recorded yet.</p>
              ) : (
                education.map((edu, idx) => (
                  <motion.div
                    key={edu._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-8 group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-orange group-hover:bg-brand-orange transition-colors duration-300" />
                    
                    <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:border-brand-orange transition-colors duration-300">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange bg-orange-500/5 px-2.5 py-1 rounded-full border border-orange-500/10 w-fit mb-3">
                        <Calendar className="w-3.5 h-3.5" /> {edu.year}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-brand-orange transition-colors">
                        {edu.degree}
                      </h4>
                      <p className="text-sm font-semibold text-slate-500 mb-2">{edu.college}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{edu.description}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Experience Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Briefcase className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 font-heading">Experience</h3>
            </div>

            <div className="relative border-l border-slate-200 ml-6 space-y-8 py-2">
              {experience.length === 0 ? (
                <p className="text-slate-500 text-sm ml-8">No experience details recorded yet.</p>
              ) : (
                experience.map((exp, idx) => (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative pl-8 group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-brand-blue group-hover:bg-brand-blue transition-colors duration-300" />
                    
                    <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:border-brand-blue transition-colors duration-300">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue bg-blue-500/5 px-2.5 py-1 rounded-full border border-blue-500/10 w-fit mb-3">
                        <Calendar className="w-3.5 h-3.5" /> {exp.duration}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                        {exp.position}
                      </h4>
                      <p className="text-sm font-semibold text-slate-500 mb-2">{exp.company}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
