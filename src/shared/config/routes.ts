export type NavKey = 'front' | 'work' | 'decisions' | 'profile' | 'contact';

export const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: 'front', label: 'Front page', href: '/' },
  { key: 'work', label: 'Work', href: '/work/' },
  { key: 'decisions', label: 'Decisions', href: '/decisions/' },
  { key: 'profile', label: 'Profile', href: '/profile/' },
  { key: 'contact', label: 'Contact', href: '/contact/' },
];
