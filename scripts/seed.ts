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
import Hero from '../models/Hero';
import Profile from '../models/Profile';
import About from '../models/About';
import Contact from '../models/Contact';
import Seo from '../models/Seo';
import Settings from '../models/Settings';
import Skill from '../models/Skill';
import Education from '../models/Education';
import Experience from '../models/Experience';
import Project from '../models/Project';
import Certificate from '../models/Certificate';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected! Dropping existing database to clear indexes...');
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
      console.log('Database dropped.');
    }

    console.log('Inserting Admin...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@manishmehra.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    const adminRecoveryKey = process.env.ADMIN_RECOVERY_KEY || 'manishmehra_recovery_2026';
    
    const hashed = await bcrypt.hash(adminPassword, 10);
    const hashedRecovery = await bcrypt.hash(adminRecoveryKey, 10);
    
    await Admin.create({
      email: adminEmail,
      password: hashed,
      name: 'Manish Mehra',
      recoveryKey: hashedRecovery,
    });

    console.log('Inserting Hero...');
    await Hero.create({
      greeting: 'AVAILABLE FOR FREELANCE',
      name: 'Manish Mehra',
      roles: ['Frontend Developer', 'Java Programmer', 'DSA Enthusiast', 'Web Designer'],
      description: 'BCA student passionate about frontend development, Java programming and DSA problem solving. I enjoy building modern websites with smooth UI, animations and responsive layouts.',
      resumeButtonText: 'Download Resume',
      contactButtonText: 'Contact Me',
    });

    console.log('Inserting Profile...');
    await Profile.create({
      name: 'Manish Mehra',
      profession: 'Frontend Developer',
      greeting: 'AVAILABLE FOR FREELANCE',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=687',
      resumeUrl: 'https://example.com/Manish_resume.pdf',
      shortIntro: 'BCA student passionate about frontend development, Java programming and DSA problem solving.',
    });

    console.log('Inserting About...');
    await About.create({
      aboutText: "Hello, I'm Manish Mehra — a passionate frontend developer and programming enthusiast. I started learning programming with curiosity and gradually developed strong interest in frontend development and software projects. Currently, I am pursuing BCA from VGU (Vivekananda Global University), where I am improving my technical and development skills. I enjoy creating responsive websites, exploring Java concepts and solving DSA problems.",
      experienceSummary: 'Freelancer / Fresher',
      educationSummary: 'Pursuing BCA at VGU, Jaipur',
      dob: '2005-01-01',
      email: 'manishmehra6299@gmail.com',
      phone: '+91 9508229454',
      address: 'Jaipur, Rajasthan, India',
      languages: ['English', 'Hindi'],
    });

    console.log('Inserting Contact...');
    await Contact.create({
      email: 'manishmehra6299@gmail.com',
      phone: '+91 9508229454',
      address: 'Vivekananda Global University, Jaipur',
    });

    console.log('Inserting SEO...');
    await Seo.create({
      title: 'Manish Mehra | Portfolio',
      description: 'BCA student passionate about frontend development, Java programming and DSA problem solving.',
      keywords: ['Manish Mehra', 'Portfolio', 'Frontend Developer', 'Java Programmer', 'DSA'],
      openGraphImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      favicon: '/favicon.ico',
    });

    console.log('Inserting Settings...');
    await Settings.create({
      theme: 'dark',
      visitorsCount: 120,
    });

    console.log('Inserting Skills...');
    await Skill.create([
      { name: 'HTML', icon: 'fab fa-html5', percentage: 95, category: 'Frontend' },
      { name: 'CSS', icon: 'fab fa-css3-alt', percentage: 90, category: 'Frontend' },
      { name: 'JavaScript', icon: 'fab fa-js', percentage: 85, category: 'Frontend' },
      { name: 'Java', icon: 'fab fa-java', percentage: 80, category: 'Programming' },
      { name: 'DSA in C', icon: 'fas fa-code', percentage: 75, category: 'Programming' },
      { name: 'Frontend Design', icon: 'fas fa-laptop-code', percentage: 85, category: 'Frontend' },
    ]);

    console.log('Inserting Education...');
    await Education.create([
      {
        college: 'Vivekananda Global University',
        degree: 'Bachelor of Computer Applications (BCA)',
        year: '2023 - 2026',
        description: 'Focusing on core computer science subjects, software development methodologies, database systems, and object-oriented programming.',
      },
      {
        college: 'High Secondary School',
        degree: 'Science & Mathematics',
        year: '2021 - 2023',
        description: 'Completed schooling with a focus on physics, chemistry, mathematics, and computer science.',
      },
    ]);

    console.log('Inserting Experience...');
    await Experience.create([
      {
        company: 'Self-employed / Freelancing',
        position: 'Frontend Developer',
        duration: '2024 - Present',
        description: 'Developing high-fidelity custom responsive landing pages and interfaces using HTML/CSS, Tailwind, and React. Collaborating with local businesses.',
      },
    ]);

    console.log('Inserting Projects...');
    await Project.create([
      {
        title: 'Personal Portfolio Website',
        description: 'A beautiful glassmorphism dark theme website showcasing my skills, certificates, projects, and contact info, powered by a dynamic admin panel.',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
        githubLink: 'https://github.com/Manishmehra95',
        liveDemo: 'https://manishmehraportfolio.netlify.app/',
      },
      {
        title: 'Java OOP Concepts Explorer',
        description: 'A desktop educational utility highlighting OOP models, inheritance patterns, and standard collection frame behaviors in Java.',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
        technologies: ['Java', 'JavaFX', 'OOPs'],
        githubLink: 'https://github.com/Manishmehra95',
        liveDemo: '',
      },
    ]);

    console.log('Inserting Certificates...');
    await Certificate.create([
      {
        title: 'Java Programming',
        issuer: 'IBM Academic',
        date: '2024',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
        credentialLink: '',
      },
      {
        title: 'Google Cloud Fundamental Practitioner',
        issuer: 'Google Cloud',
        date: '2025',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        credentialLink: '',
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
