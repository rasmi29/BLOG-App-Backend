import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";

// 1. getMyProfile

const getMyProfile = asyncHandler(async (req, res) => {
    //fetch user data ;
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken")
        .lean();
    if (!user) {
        throw new ApiError(404, "user not found , register again");
    }
    res.status(200).json(
        new ApiResponse(200, user, "User profile fetched successfully"),
    );
});

// 2. getUserByUsername (public route)
const getUserByUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username || username.trim() === "") {
        throw new ApiError(400, "Username is required");
    }

    // Fetch only public fields (exclude sensitive ones)
    const user = await User.findOne({ username: username.toLowerCase() })
        .select("username bio avatar createdAt")
        .lean();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
});


// 3. changePassword

const changePassword = asyncHandler(async (req, res) => {
    //fetch user
    const userId = req.user._id; 
    //get new and old password
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Both current and new password are required");
    }

    // find user
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // validate current password
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // update password
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password updated successfully"));
});




// 4. deactivateAccount

const deactivateAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id; 

  // fetch user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If already deactivated
  if (user.status === "inactive") {
    throw new ApiError(400, "Account is already deactivated");
  }

  // Mark account inactive (soft delete)
  user.status = "inactive";
  user.lastActive = new Date();
  user.deactivatedAt = new Date();

  //remove tokens
  user.refreshToken = undefined
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deactivated successfully"));
});


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

export { getMyProfile, changePassword ,getUserByUsername, deactivateAccount };
