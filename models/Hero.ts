import mongoose, { Schema } from 'mongoose';

const HeroSchema = new Schema({
  greeting: { type: String, required: true },
  name: { type: String, required: true },
  roles: { type: [String], required: true },
  description: { type: String, required: true },
  resumeButtonText: { type: String, default: 'Download Resume' },
  contactButtonText: { type: String, default: 'Contact Me' },
}, { timestamps: true });

export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
