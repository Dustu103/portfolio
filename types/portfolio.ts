// Shared TypeScript interfaces for the portfolio data

export interface PersonalData {
  name: string;
  profile: string;
  designation: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  facebook?: string;
  linkedIn: string;
  twitter?: string;
  stackOverflow?: string;
  leetcode?: string;
  codeforces?: string;
  devUsername: string;
  resume: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  html_url?: string;
  demo_url?: string;
  image?: string;
  language: string | null;
  case_study?: {
    architecture: string;
    technical_challenge: string;
    solution: string;
  };
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  duration: string;
  description?: string[];
}

export interface Education {
  id: number;
  title: string;
  duration: string;
  institution: string;
}

export interface ContactsData {
  email: string;
  phone: string;
  address: string;
  github: string;
  facebook: string;
  linkedIn: string;
  twitter: string;
  stackOverflow: string;
  devUsername: string;
}

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  url: string;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  public_reactions_count: number;
  comments_count: number;
  user: {
    name: string;
    profile_image_90: string;
  };
}

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}
