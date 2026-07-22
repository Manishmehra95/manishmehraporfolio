import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  recoveryKey: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
