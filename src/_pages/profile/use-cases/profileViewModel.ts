import { getProfile, hasCvPdf, type Profile, type ProfileExperience } from '@/entities/profile';

export type ProfileViewModel = {
  heading: string;
  intro: string[];
  facts: { label: string; value: string }[];
  cvHref: string | null;
  jobs: ProfileExperience[];
  skills: Profile['skills'];
  education: Profile['education'];
  workAuthorization: string;
};

export function buildProfileViewModel(profile: Profile, cvAvailable: boolean): ProfileViewModel {
  return {
    heading: profile.role,
    intro: [
      `${profile.yearsExperience}+ years of B2B web applications, micro-frontends and UI platforms: national platforms serving more than 2M citizens, a threat-intelligence product, a web IDE for industrial robots, and now the frontend platform at Censhare.`,
      'I have led a seven-person unit and a five-engineer squad. Architecture decisions are written down as ADRs, and accessibility is part of the Definition of Done.',
    ],
    facts: [
      { label: 'Looking for', value: 'Senior / Staff Frontend, or Senior / Staff Frontend Platform' },
      { label: 'Works', value: 'Munich-based, hybrid and remote roles in Germany' },
      { label: 'Languages', value: profile.languages.map((l) => `${l.language}: ${l.level}`).join('; ') },
    ],
    cvHref: cvAvailable ? '/cv.pdf' : null,
    jobs: profile.experience,
    skills: profile.skills,
    education: profile.education,
    workAuthorization: profile.workAuthorization,
  };
}

export async function loadProfileViewModel(): Promise<ProfileViewModel> {
  return buildProfileViewModel(await getProfile(), await hasCvPdf());
}

export async function profileMeta(): Promise<{ title: string; description: string }> {
  const profile = await getProfile();
  return {
    title: `Profile and CV — ${profile.name}`,
    description: `${profile.name}: ${profile.role}. Experience at Censhare, Agile Robots, FYEO and Outsource Global; skills, education and languages.`,
  };
}
