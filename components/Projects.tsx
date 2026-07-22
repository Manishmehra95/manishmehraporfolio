"use client";

import { motion } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';
import { IProject } from '@/types';

interface ProjectsProps {
  projects: IProject[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 bg-[#f5f7fb] relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            Featured <span className="text-brand-orange">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length === 0 ? (
            <p className="text-slate-500 text-sm text-center col-span-2">No projects recorded yet.</p>
          ) : (
            projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden group flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Image box with overlay */}
                <div className="relative aspect-video overflow-hidden border-b border-slate-100 bg-slate-50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white/95 text-brand-blue flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-md"
                      >
                        <i className="fab fa-github text-xl" />
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-white/95 text-brand-blue flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-md"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Text details */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-brand-orange transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/50 px-3 py-1.5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Code <i className="fab fa-github" />
                        </a>
                      )}
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-orange-600 transition-colors ml-auto"
                        >
                          Live Demo <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
