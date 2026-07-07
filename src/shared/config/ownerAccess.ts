import type { UserPlanType } from '../types/story';

// The account that always gets full pro-tier access client-side, regardless
// of what plan is stored for it (Supabase or local profile). Not enforced
// server-side - this only unlocks UI gating for this specific owner.
const OWNER_EMAIL = 'mgamed2002@gmail.com';

export const isOwnerEmail = (email?: string | null): boolean =>
  !!email && email.toLowerCase() === OWNER_EMAIL.toLowerCase();

export const resolvePlanForUser = (planType: UserPlanType, email?: string | null): UserPlanType =>
  isOwnerEmail(email) ? 'pro' : planType;
