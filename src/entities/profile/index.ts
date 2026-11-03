export type { Profile, ProfileExperience } from './types/profile';
export { getProfile, hasCvPdf } from './repository/profileRepository';
export { mailtoHref } from './services/contactLinks';
// The adapter is intentionally not exported.
