# 🚀 Manish Mehra - Modern Full-Stack Developer Portfolio & Admin Workspace

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Database-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A high-performance, glassmorphic personal developer portfolio and content management workspace built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **MongoDB Atlas**. Designed for maximum visual impact, bank-grade security, and full dynamic content administration.

---

## ✨ Key Features

### 🎨 Frontend & User Experience
* **Glassmorphic Aesthetic & Micro-Animations**: Smooth scroll, framer-motion micro-interactions, and a sleek dark theme.
* **Interactive Certificate Lightbox Modal**: View full-resolution certificates on-page without external redirects.
* **Responsive Navigation & Social Connect**: Direct links to GitHub, LinkedIn, and Instagram with mobile drawer navigation.
* **Dynamic Visitor Counter & Query Registration**: Real-time stats and interactive contact form with instant validation.
* **Custom AI Circuit branding**: Circular neon AI circuit board favicon icon (`icon.png`).

### 🔒 Enterprise-Grade Security
* **Google Authenticator 2FA**: Multi-Factor Authentication powered by `otplib` TOTP verification.
* **Dual Password Recovery System**:
  * **Email Reset Link**: Time-limited cryptographically signed reset tokens delivered via Nodemailer SMTP.
  * **Security Recovery Key**: Offline fallback code to reset credentials and disable lost 2FA devices.
* **Bcrypt Password Hashing & Protected Routes**: Passwords hashed with 10 salt rounds and API routes locked with `HttpOnly` JWT cookies.
* **User Enumeration Prevention**: Hardened endpoints preventing username guessing vulnerabilities.

### 💼 Content Management Dashboard (`/admin/dashboard`)
* **Hero & About Section Manager**: Update greetings, roles, bio text, and coordinates dynamically.
* **Skills, Experience & Education CRUD**: Manage technical competencies, degree timelines, and employment logs.
* **Project & Certificate Showcase**: Create, update, or remove portfolio projects and credential badges.
* **Media Uploads**: Integrated Cloudinary cloud media storage with local filesystem fallback.
* **SEO Control Center**: Custom page titles, meta descriptions, and OpenGraph social preview images.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16 (App Router / Turbopack)](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose ORM](https://mongoosejs.com/)
* **Authentication**: JWT, [otplib (2FA TOTP)](https://otplib.yeojz.dev/), & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
* **Email Service**: [Nodemailer SMTP](https://nodemailer.com/)
* **Media Storage**: [Cloudinary API](https://cloudinary.com/)
* **Icons**: [Lucide React](https://lucide.dev/) & [FontAwesome 6](https://fontawesome.com/)

---

## 📂 Project Architecture

```
manishmehraportfolio/
├── app/                      # Next.js 16 App Router Page Architecture
│   ├── admin/                # Admin Portal (Dashboard, Login, 2FA, Reset Password)
│   ├── api/                  # RESTful API Endpoints (Auth, CRUD, Uploads, Messages)
│   ├── globals.css           # Design Tokens, Utility Classes, & Glassmorphism
│   ├── icon.png              # AI Circuit Circular Favicon Logo
│   └── page.tsx              # Public Portfolio Landing Page
├── components/               # Reusable React UI Components (Hero, About, Projects...)
├── lib/                      # Helper Utilities (dbConnect, Auth Helpers, JWT)
├── models/                   # Mongoose Schemas (Admin, Profile, Project, Skill...)
├── public/                   # Static Assets & Media
├── scripts/                  # Database Seeding & Maintenance Scripts
├── types/                    # TypeScript Type Definitions
└── .env.local                # Local Environment Variables (Git-Ignored)
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js**: `v18.x` or higher
* **MongoDB**: A local MongoDB instance or a free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas)

### 1. Clone Repository
```bash
git clone https://github.com/Manishmehra95/manishmehraporfolio.git
cd manishmehraporfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and populate it with your configuration:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Authentication & Security
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@manishmehra.com
ADMIN_PASSWORD=your_admin_password
ADMIN_RECOVERY_KEY=manishmehra_recovery_2026

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email SMTP (Gmail)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your_email@gmail.com
EMAIL_SERVER_PASSWORD=your_16_digit_app_password
EMAIL_FROM=your_email@gmail.com
```

### 4. Seed Initial Portfolio Data
Populate MongoDB Atlas with initial schema defaults:
```bash
npx tsx scripts/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

This project is optimized for deployment on **Vercel** or **Netlify**:

1. Push your repository to GitHub.
2. Connect your GitHub repository to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
3. Add all environment variables listed in step 3 to your deployment settings.
4. Click **Deploy**.

---

## 👤 Author

**Manish Mehra**
* **Education**: Pursuing BCA at Vivekananda Global University, Jaipur
* **GitHub**: [@Manishmehra95](https://github.com/Manishmehra95)
* **LinkedIn**: [manish-mehra-0161043aa](https://www.linkedin.com/in/manish-mehra-0161043aa)
* **Instagram**: [@m_manish__mehra](https://www.instagram.com/m_manish__mehra)
* **Email**: [manishmehra6299@gmail.com](mailto:manishmehra6299@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
