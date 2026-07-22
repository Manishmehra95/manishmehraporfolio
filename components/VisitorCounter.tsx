"use client";

import { useEffect } from 'react';

export default function VisitorCounter() {
  useEffect(() => {
    fetch('/api/settings', { method: 'POST' }).catch(() => {});
  }, []);

  return null;
}
