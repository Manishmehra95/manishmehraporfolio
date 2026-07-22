import mongoose, { Schema } from 'mongoose';

const EducationSchema = new Schema({
  college: { type: String, required: true },
  degree: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Education || mongoose.model('Education', EducationSchema);
