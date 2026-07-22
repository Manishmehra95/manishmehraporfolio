import mongoose, { Schema } from 'mongoose';

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
