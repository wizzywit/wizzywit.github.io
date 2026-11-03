import { getProfile, hasCvPdf, mailtoHref } from '@/entities/profile';

export type ClassifiedsViewModel = {
  heading: string;
  text: string;
  writeHref: string;
  emailHref: string;
  cvHref: string | null;
};

export function buildClassifiedsViewModel(email: string, cvAvailable: boolean): ClassifiedsViewModel {
  return {
    heading: 'Situations wanted',
    text: 'Senior or Staff Frontend roles, and Senior or Staff Frontend Platform roles. Open to Munich-based, hybrid and remote roles in Germany. Leads squads of five to seven.',
    writeHref: '/contact/',
    emailHref: mailtoHref(email),
    cvHref: cvAvailable ? '/cv.pdf' : null,
  };
}

export async function loadClassifiedsViewModel(): Promise<ClassifiedsViewModel> {
  const profile = await getProfile();
  return buildClassifiedsViewModel(profile.email, await hasCvPdf());
}
