import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  profession: { type: String, required: true },
  greeting: { type: String, required: true },
  profilePicture: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  shortIntro: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
