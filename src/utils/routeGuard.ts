
import { calculateProfileComplete } from "./helper";
import type { UserProfile } from "../rtk/endpoints/userApi";

/**
 * Centralized routing logic to determine the next step for a user
 * based on their profile completion and service status.
 * 
 * Rules:
 * 1. Completion < 50% (Incomplete Profile) -> Redirect to /my-profile
 * 2. Completion < 100% (Profile Done, No Services) -> Redirect to /services-offered
 * 3. Completion = 100% (All Done) -> Redirect to /dashboard
 * 
 * @param profile - The user's profile object
 * @param hasServices - Boolean indicating if the user has created at least one service
 * @returns The absolute path string for the next route
 */
export const getNextRoute = (
    profile: Partial<UserProfile> | null,
    hasServices: boolean
): string => {
    const completion = calculateProfileComplete(profile, hasServices);


    if (completion < 50) {
        return "/my-profile"
    };
    if (completion < 100) {
        return "/services-offered"
    };
    return "/dashboard";

};
