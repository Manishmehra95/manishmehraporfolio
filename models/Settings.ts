import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  theme: { type: String, default: 'dark' },
  visitorsCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
