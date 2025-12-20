// src/utils/avatarUtils.ts
// Local avatar utility to replace external API (avatar.iran.liara.run)

const AVATAR_COUNT = 4; // Total number of local avatar files

/**
 * Get local avatar URL based on user ID or any numeric identifier.
 * Returns a consistent avatar for the same ID.
 *
 * @param id - User ID or any identifier (string or number)
 * @returns Local avatar path like "/avatars/avatar-1.webp"
 */
export function getLocalAvatarUrl(
  id?: string | number | null | undefined
): string {
  // Always return avatar-1 as default
  return "/avatars/avatar-1.webp";
}

/**
 * Default fallback avatar URL
 */
export const DEFAULT_AVATAR_URL = "/avatars/avatar-1.webp";
