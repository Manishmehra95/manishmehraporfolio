"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { IHero, IProfile } from '@/types';

interface HeroProps {
  hero: IHero;
  profile: IProfile;
}

export default function Hero({ hero, profile }: HeroProps) {
  const [currentRole, setCurrentRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    if (!hero.roles || hero.roles.length === 0) return;

    const activeRole = hero.roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentRole(activeRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentRole(activeRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === activeRole.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % hero.roles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, hero.roles]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-brand-blue font-sans">
      {/* Background circles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[150px] -right-[120px] w-[500px] h-[500px] bg-white/5 rounded-full" />
        <div className="absolute -bottom-[100px] -left-[100px] w-[350px] h-[350px] bg-white/5 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
        {/* Left side text details */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          <span className="inline-block px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white bg-white/15 border border-white/20 mb-6 uppercase backdrop-blur-md">
            ✨ {hero.greeting}
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-heading text-white tracking-tight mb-4 leading-tight break-words">
            {hero.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-yellow-300">{hero.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          {/* Animated role typist */}
          <div className="h-10 text-xl md:text-2xl font-medium text-sky-100 mb-6 flex items-center">
            <span>{currentRole}</span>
            <span className="w-1 h-6 bg-brand-orange ml-1 animate-pulse" />
          </div>

          <p className="text-sky-50/90 text-base md:text-lg leading-relaxed max-w-xl mb-8">
            {hero.description}
          </p>

          {/* Call to actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-orange-655 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 text-sm"
            >
              {hero.contactButtonText}
            </a>
            <a
              href={profile.resumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-brand-blue transition-all duration-300 hover:-translate-y-1 text-sm"
            >
              {hero.resumeButtonText}
            </a>
          </div>

          {/* Social details & Contact info */}
          <div className="space-y-6 w-full">
            <div className="flex flex-wrap gap-6 text-white text-sm font-semibold">
              <a
                href="mailto:manishmehra6299@gmail.com"
                className="flex items-center gap-2 hover:text-orange-200 transition-colors"
              >
                <i className="fas fa-envelope text-brand-orange text-lg" />
                <span>manishmehra6299@gmail.com</span>
              </a>
              <span className="hidden md:inline text-sky-300">|</span>
              <a
                href="tel:+919508229454"
                className="flex items-center gap-2 hover:text-orange-200 transition-colors"
              >
                <i className="fas fa-phone text-brand-orange text-lg" />
                <span>+91 9508229454</span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Manishmehra95"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <i className="fab fa-github text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/manish-mehra-0161043aa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <i className="fab fa-linkedin-in text-xl" />
              </a>
              <a
                href="https://www.instagram.com/m_manish__mehra?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white text-brand-blue flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <i className="fab fa-instagram text-xl" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right side Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex justify-center z-10"
        >
          <div className="relative w-72 h-80 md:w-96 md:h-[500px] rounded-3xl overflow-hidden border-6 border-white/15 shadow-2xl group bg-white">
            <img
              src={profile.profilePicture}
              alt={profile.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
