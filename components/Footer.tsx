"use client";

interface FooterProps {
  name: string;
}

export default function Footer({ name }: FooterProps) {
  return (
    <footer className="py-10 bg-[#f5f7fb] text-center text-slate-500 text-[15px] font-sans border-t border-slate-200/50">
      © {new Date().getFullYear()} {name} | All Rights Reserved
    </footer>
  );
}
