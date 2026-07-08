import type { UserPlanType } from '../types/story';

// The owner plan type is now stored directly in the database profiles.
// This client function simply forwards the plan type.
export const resolvePlanForUser = (planType: UserPlanType, _email?: string | null): UserPlanType =>
  planType;
