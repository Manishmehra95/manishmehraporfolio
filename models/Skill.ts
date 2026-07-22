import mongoose, { Schema } from 'mongoose';

const SkillSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true }, // e.g. "fab fa-html5" or "Html5"
  percentage: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, required: true }, // e.g. "Frontend", "Backend", "Programming"
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
