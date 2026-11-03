import { getProfile, hasCvPdf, mailtoHref, type Profile } from '@/entities/profile';

export type ContactRow = { label: string; text: string; href: string; external: boolean };
export type ContactViewModel = { intro: string; rows: ContactRow[] };

export function buildContactViewModel(profile: Pick<Profile, 'email' | 'links'>, cvAvailable: boolean): ContactViewModel {
  const rows: ContactRow[] = [
    { label: 'Email', text: profile.email, href: mailtoHref(profile.email), external: false },
    { label: 'LinkedIn', text: 'linkedin.com/in/wisdom-praise', href: profile.links.linkedin, external: true },
    { label: 'GitHub', text: 'github.com/wizzywit', href: profile.links.github, external: true },
    { label: 'GitLab', text: 'gitlab.com/wizzywit', href: profile.links.gitlab, external: true },
  ];
  if (cvAvailable) rows.push({ label: 'CV', text: 'Download PDF', href: '/cv.pdf', external: false });
  return {
    intro: 'Hiring for a Senior or Staff Frontend role, or a Senior or Staff Frontend Platform role? Or just want to talk architecture? Write to me. I am open to Munich-based, hybrid and remote roles in Germany.',
    rows,
  };
}

export async function loadContactViewModel(): Promise<ContactViewModel> {
  return buildContactViewModel(await getProfile(), await hasCvPdf());
}

export function contactMeta(): { title: string; description: string } {
  return {
    title: 'Contact — Wisdom Emmanuel Praise',
    description: 'Write to Wisdom Emmanuel Praise about Senior or Staff Frontend and Frontend Platform roles.',
  };
}
