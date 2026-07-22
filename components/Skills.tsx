"use client";

import { motion } from 'framer-motion';
import { ISkill } from '@/types';
import { useState } from 'react';

interface SkillsProps {
  skills: ISkill[];
}

export default function Skills({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  } as const;

  return (
    <section id="skills" className="py-24 bg-[#f5f7fb] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            My <span className="text-brand-orange">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full mb-8" />
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === category
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200/60 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill._id}
              variants={itemVariants}
              className="bg-white border-t-[5px] border-brand-blue p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-2 hover:bg-brand-blue hover:text-white shadow-sm cursor-default"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200/60 group-hover:bg-white/10 group-hover:border-white/15 transition-all duration-300">
                  <i className={`${skill.icon} text-3xl text-brand-orange group-hover:text-white transition-colors duration-300`} />
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60 group-hover:bg-white/10 group-hover:border-white/15 group-hover:text-sky-100 transition-all duration-300">
                  {skill.category}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-white transition-colors duration-300">{skill.name}</h3>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-semibold group-hover:text-sky-100 transition-colors duration-300">Proficiency</span>
                    <span className="text-brand-orange font-bold group-hover:text-white transition-colors duration-300">{skill.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden group-hover:bg-white/10 transition-colors duration-300">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-brand-blue to-brand-orange rounded-full group-hover:from-white group-hover:to-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
