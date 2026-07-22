import mongoose, { Schema } from 'mongoose';

const SocialLinkSchema = new Schema({
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
