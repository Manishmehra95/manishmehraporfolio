import mongoose, { Schema } from 'mongoose';

const CertificateSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credentialLink: { type: String },
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
