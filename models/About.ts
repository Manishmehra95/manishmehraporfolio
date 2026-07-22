import mongoose, { Schema } from 'mongoose';

const AboutSchema = new Schema({
  aboutText: { type: String, required: true },
  experienceSummary: { type: String, required: true },
  educationSummary: { type: String, required: true },
  dob: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  languages: { type: [String] },
}, { timestamps: true });

export default mongoose.models.About || mongoose.model('About', AboutSchema);
