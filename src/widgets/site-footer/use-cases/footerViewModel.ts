import { getProfile, hasCvPdf, mailtoHref, type Profile } from '@/entities/profile';

export type FooterLink = { label: string; href: string; external: boolean };
export type FooterViewModel = { name: string; links: FooterLink[] };

export function buildFooterViewModel(profile: Pick<Profile, 'name' | 'email' | 'links'>, cvAvailable: boolean): FooterViewModel {
  const links: FooterLink[] = [
    { label: 'Email', href: mailtoHref(profile.email), external: false },
    { label: 'GitHub', href: profile.links.github, external: true },
    { label: 'LinkedIn', href: profile.links.linkedin, external: true },
  ];
  if (cvAvailable) links.push({ label: 'CV (PDF)', href: '/cv.pdf', external: false });
  links.push({ label: 'Back to top ↑', href: '#main', external: false });
  return { name: profile.name, links };
}

export async function loadFooterViewModel(): Promise<FooterViewModel> {
  return buildFooterViewModel(await getProfile(), await hasCvPdf());
}
