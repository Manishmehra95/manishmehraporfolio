import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  githubLink: { type: String },
  liveDemo: { type: String },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
