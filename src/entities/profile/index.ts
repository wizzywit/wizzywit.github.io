export type { Portrait, Profile, ProfileExperience } from './types/profile';
export { getPortrait, getProfile, hasCvPdf } from './repository/profileRepository';
export { mailtoHref } from './services/contactLinks';
export { buildPersonJsonLd, buildProfilePageJsonLd, buildWebSiteJsonLd } from './services/personStructuredData';
// The adapter is intentionally not exported.
