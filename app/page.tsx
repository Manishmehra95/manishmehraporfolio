import dbConnect from '@/lib/db';
import HeroModel from '@/models/Hero';
import ProfileModel from '@/models/Profile';
import AboutModel from '@/models/About';
import ContactModel from '@/models/Contact';
import SeoModel from '@/models/Seo';
import SettingsModel from '@/models/Settings';
import SkillModel from '@/models/Skill';
import EducationModel from '@/models/Education';
import ExperienceModel from '@/models/Experience';
import ProjectModel from '@/models/Project';
import CertificateModel from '@/models/Certificate';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Timeline from '@/components/Timeline';
import Projects from '@/components/Projects';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import VisitorCounter from '@/components/VisitorCounter';
import { IPortfolioData } from '@/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    await dbConnect();
    const seo = await SeoModel.findOne().lean();
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
      };
    }
  } catch (e) {
    console.error('Error generating metadata:', e);
  }
  return {
    title: 'Manish Mehra | Portfolio',
    description: 'Personal portfolio website of Manish Mehra',
  };
}

async function getPortfolioData(): Promise<IPortfolioData | null> {
  try {
    await dbConnect();

    const [
      hero,
      profile,
      about,
      contact,
      seo,
      settings,
      skills,
      education,
      experience,
      projects,
      certificates,
    ] = await Promise.all([
      HeroModel.findOne().lean(),
      ProfileModel.findOne().lean(),
      AboutModel.findOne().lean(),
      ContactModel.findOne().lean(),
      SeoModel.findOne().lean(),
      SettingsModel.findOne().lean(),
      SkillModel.find().sort({ percentage: -1 }).lean(),
      EducationModel.find().sort({ year: -1 }).lean(),
      ExperienceModel.find().sort({ duration: -1 }).lean(),
      ProjectModel.find().sort({ createdAt: -1 }).lean(),
      CertificateModel.find().sort({ createdAt: -1 }).lean(),
    ]);

    if (!hero || !profile) return null;

    return {
      hero: JSON.parse(JSON.stringify(hero)),
      profile: JSON.parse(JSON.stringify(profile)),
      about: JSON.parse(JSON.stringify(about)),
      contact: JSON.parse(JSON.stringify(contact)),
      seo: JSON.parse(JSON.stringify(seo)),
      settings: JSON.parse(JSON.stringify(settings || { theme: 'dark', visitorsCount: 0 })),
      skills: JSON.parse(JSON.stringify(skills)),
      education: JSON.parse(JSON.stringify(education)),
      experience: JSON.parse(JSON.stringify(experience)),
      projects: JSON.parse(JSON.stringify(projects)),
      certificates: JSON.parse(JSON.stringify(certificates)),
    };
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    return null;
  }
}

export default async function Home() {
  const data = await getPortfolioData();

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Under Construction</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Please run the database seed script using <code className="bg-slate-900 px-2 py-1 rounded">npx tsx scripts/seed.ts</code> to configure the initial portfolio setup.
        </p>
      </div>
    );
  }

  return (
    <>
      <VisitorCounter />
      <Navbar name={data.profile.name} />
      <main className="flex-1">
        <Hero hero={data.hero} profile={data.profile} />
        <About about={data.about} profile={data.profile} />
        <Skills skills={data.skills} />
        <Timeline education={data.education} experience={data.experience} />
        <Projects projects={data.projects} />
        <Certificates certificates={data.certificates} />
        <Contact contact={data.contact} />
      </main>
      <Footer name={data.profile.name} />
    </>
  );
}
