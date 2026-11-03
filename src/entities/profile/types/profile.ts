export type ProfileExperience = {
  title: string;
  org: string;
  location: string;
  period: string;
  context: string;
  stack: string[];
  highlights: string[];
};

export type Profile = {
  name: string;
  role: string;
  location: string;
  summary: string;
  email: string;
  links: { github: string; linkedin: string; gitlab: string };
  skills: { group: string; items: string[] }[];
  experience: ProfileExperience[];
  education: { degree: string; school: string; period: string; note: string }[];
  languages: { language: string; level: string }[];
  workAuthorization: string;
  ticker: { id: string; text: string }[];
};
