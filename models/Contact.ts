import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
