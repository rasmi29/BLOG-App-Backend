/**
 * 1. getProfile / getMyProfile
 * - Retrieves current authenticated user's profile
 * - Returns complete profile information
 * - Excludes sensitive data (password, tokens)
 */

/**
 * 2. getUserByUsername
 * - Gets user profile by username (public route)
 * - SEO-friendly user profile URLs
 * - Public information only
 */

/**
 * 3. changePassword
 * - Changes user password (when logged in)
 * - Validates current password
 * - Password strength validation
 */


/**
 * 4. deactivateAccount
 * - Soft delete user account
 * - Maintains data integrity
 * - Sets account as inactive
 */


/**
 * 5. getFollowers
 * - Gets list of user's followers
 * - Pagination and sorting support
 * - Privacy controls applied
 */

/**
 * 6. getFollowing
 * - Gets list of users being followed
 * - Mutual following detection
 * - Category-based following
 */

/**
 * 7. followUser
 * - Follow another user
 * - Notification triggering
 * - Prevents self-following
 */

/**
 * 8. unfollowUser
 * - Unfollow a user
 * - Relationship cleanup
 * - Analytics tracking
 */

/**
 * 9. blockUser
 * - Block another user
 * - Prevents interactions
 * - Privacy protection
 */

/**
 * 10. unblockUser
 * - Unblock a previously blocked user
 * - Restores interaction capability
 * - Audit trail maintenance
 */

/**
 * 11. getBlockedUsers
 * - Lists all blocked users
 * - Management interface support
 * - Privacy controls
 */
