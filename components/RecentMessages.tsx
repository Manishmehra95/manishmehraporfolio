"use client";

import { useState } from 'react';
import { Mail, Calendar, Trash2 } from 'lucide-react';

interface IMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  createdAt: string;
}

interface RecentMessagesProps {
  initialMessages: IMessage[];
}

export default function RecentMessages({ initialMessages }: RecentMessagesProps) {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete message');
      setMessages(messages.filter((m) => m._id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete message');
    }
  };

  return (
    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-brand-orange" />
        <h2 className="text-xl font-bold text-white">Recent Queries</h2>
      </div>

      {messages.length === 0 ? (
        <p className="text-slate-500 text-sm">No messages received yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-5 bg-slate-900 border border-white/5 rounded-2xl flex justify-between items-start gap-4 hover:border-white/10 transition-colors">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-white">{msg.name}</h4>
                  <span className="text-xs text-slate-500 bg-slate-950 border border-white/5 px-2 py-0.5 rounded-full">
                    {msg.email}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-950 border border-white/5 px-2 py-0.5 rounded-full">
                    {msg.phone}
                  </span>
                </div>
                {msg.subject && (
                  <p className="text-xs font-semibold text-brand-blue">Subject: {msg.subject}</p>
                )}
                <p className="text-sm text-slate-350 whitespace-pre-line">{msg.message}</p>
                <div className="text-[10px] text-slate-550 flex items-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(msg._id)}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-red-500/5 focus:outline-none"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
