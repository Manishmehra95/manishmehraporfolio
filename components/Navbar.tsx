"use client";

import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-brand-blue py-5 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <a
          href="#"
          className="text-2xl md:text-3xl font-bold tracking-widest font-heading text-white hover:text-orange-200 transition-colors"
        >
          {name.toUpperCase()}
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[15px] font-medium text-white hover:text-orange-200 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/admin/login"
            className="text-[15px] font-semibold text-white/95 hover:text-orange-200 transition-colors flex items-center gap-1.5"
          >
            Admin <i className="fas fa-lock text-[10px]" />
          </Link>
          <a
            href="#contact"
            className="flex items-center gap-1.5 px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white text-sm font-semibold rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Contact Me <ArrowUpRight className="w-4 h-4" />
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden text-white hover:text-orange-200 transition-colors focus:outline-none cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {isOpen && (
        <nav className="md:hidden bg-brand-blue border-t border-white/10 py-6 px-6 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-white hover:text-orange-200 transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="text-lg font-semibold text-white/95 hover:text-orange-200 transition-colors py-1 flex items-center gap-1.5"
          >
            Admin <i className="fas fa-lock text-sm" />
          </Link>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 bg-brand-orange hover:bg-orange-600 text-white text-base font-semibold rounded-full shadow-lg transition-colors mt-2"
          >
            Contact Me
          </a>
        </nav>
      )}
    </header>
  );
}
