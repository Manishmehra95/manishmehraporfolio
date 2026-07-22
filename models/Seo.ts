import mongoose, { Schema } from 'mongoose';

const SeoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: [String], required: true },
  openGraphImage: { type: String },
  favicon: { type: String },
}, { timestamps: true });

export default mongoose.models.Seo || mongoose.model('Seo', SeoSchema);
