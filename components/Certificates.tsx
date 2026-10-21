"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, X } from 'lucide-react';
import { ICertificate } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image';

interface CertificatesProps {
  certificates: ICertificate[];
}

export default function Certificates({ certificates }: CertificatesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="certificates" className="py-24 bg-white border-t border-b border-slate-200/50 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 mb-4">
            My <span className="text-brand-orange">Certificates</span>
          </h2>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length === 0 ? (
            <p className="text-slate-500 text-sm text-center col-span-3">No certificates recorded yet.</p>
          ) : (
            certificates.map((cert, idx) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 p-4 rounded-[28px] group flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div>
                  <div
                    onClick={() => setSelectedImage(cert.image)}
                    className="block relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-50 border border-slate-200/60 cursor-zoom-in group/img"
                  >
                    <img
                      src={getOptimizedImageUrl(cert.image, 600)}
                      alt={`Certificate for ${cert.title}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <i className="fas fa-search-plus text-white text-2xl" />
                    </div>
                  </div>

                  <div className="px-2">
                    <span className="flex items-center gap-1 text-xs text-brand-orange bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 rounded-full w-fit mb-3 font-semibold">
                      <Award className="w-3.5 h-3.5" /> {cert.issuer}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-brand-orange transition-colors">
                      {cert.title}
                    </h3>
                    <span className="text-xs text-slate-400 block mb-4 font-semibold">{cert.date}</span>
                  </div>
                </div>

                {cert.credentialLink && (
                  <div className="px-2 pb-2">
                    <a
                      href={cert.credentialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-800 border border-slate-200/80 rounded-xl text-sm font-semibold transition-all"
                    >
                      Verify Credential <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img 
              src={getOptimizedImageUrl(selectedImage, 1600)} 
              alt="Certificate Full View" 
              decoding="async"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border-4 border-white/10 shadow-2xl bg-white"
            />
            {selectedImage.toLowerCase().includes('.pdf') && (
              <a
                href={selectedImage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" /> Open Original PDF Document
              </a>
            )}
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close certificate image modal"
              className="absolute -top-12 right-0 text-white hover:text-brand-orange transition-colors flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
            >
              Close <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
