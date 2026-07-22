export interface IHero {
  greeting: string;
  name: string;
  roles: string[];
  description: string;
  resumeButtonText: string;
  contactButtonText: string;
}

export interface IProfile {
  name: string;
  profession: string;
  greeting: string;
  profilePicture: string;
  resumeUrl: string;
  shortIntro: string;
}

export interface IAbout {
  aboutText: string;
  experienceSummary: string;
  educationSummary: string;
  dob?: string;
  email?: string;
  phone?: string;
  address?: string;
  languages?: string[];
}

export interface ISkill {
  _id: string;
  name: string;
  icon: string;
  percentage: number;
  category: string;
}

export interface IEducation {
  _id: string;
  college: string;
  degree: string;
  year: string;
  description: string;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface IProject {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubLink?: string;
  liveDemo?: string;
}

export interface ICertificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialLink?: string;
}

export interface IContact {
  email: string;
  phone: string;
  address: string;
}

export interface ISeo {
  title: string;
  description: string;
  keywords: string[];
  openGraphImage?: string;
  favicon?: string;
}

export interface ISettings {
  theme: string;
  visitorsCount: number;
}

export interface IPortfolioData {
  hero: IHero;
  profile: IProfile;
  about: IAbout;
  contact: IContact;
  seo: ISeo;
  settings: ISettings;
  skills: ISkill[];
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  certificates: ICertificate[];
}
