import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Simple .env.local loader
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  }
}

import Admin from '../models/Admin';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function updateAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL or ADMIN_PASSWORD not found in .env.local');
      process.exit(1);
    }

    console.log('Updating Admin credentials in database...');
    const hashed = await bcrypt.hash(adminPassword, 10);
    
    // Find any existing admin, or update the first one
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      existingAdmin.email = adminEmail;
      existingAdmin.password = hashed;
      await existingAdmin.save();
      console.log('Admin credentials updated successfully in MongoDB!');
    } else {
      await Admin.create({
        email: adminEmail,
        password: hashed,
        name: 'Manish Mehra',
      });
      console.log('Admin user created successfully in MongoDB!');
    }

    console.log(`New Admin Email: ${adminEmail}`);
    console.log(`New Admin Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    process.exit(1);
  }
}

updateAdmin();
