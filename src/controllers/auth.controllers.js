import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.model.js";
import {
    emailVerificationMailGenContent,
    sendMail,
} from "../utils/email.util.js";

//register user

const registerUser = asyncHandler(async (req, res) => {
    //fetch data
    const { email, username, password } = req.body;
    //check if user exist or not
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
        throw new ApiError(400, "User already exist with this email.");
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
        throw new ApiError(
            409,
            "User already exist with this username.Try different username.",
        );
    }
    //if not exist then register
    const user = await User.create({ email, username, password });

    //check user craeted or not
    if (!user) {
        throw new ApiError(500, "error in user creation.Try again!");
    }
    //create a verification token to verify email
    const { hashedToken, unHashedToken, tokenExpiry } =
        user.generateTemporaryToken();
    //check token generate or not
    if (!hashedToken || !unHashedToken || !tokenExpiry) {
        throw new ApiError(400, "error during verification token generation");
    }
    //save token in database
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    //send email for verification
    const verificationUrl = `http://localhost:8000/api/v1/user/verify?token=${unHashedToken}`;
    //create mail body
    const mailOption = emailVerificationMailGenContent(
        username,
        verificationUrl,
    );
    //send mail
    await sendMail({
        email: email,
        subject: "Verify your Blog Posting account",
        mailGenContent: mailOption,
    });

    //save user in database
    await user.save();

    //create a user data without password to send as response
    const safeUser = user.toObject();
    delete safeUser.password;

    return res
        .status(201)
        .json(new ApiResponse(201, safeUser, "User created successfully"));
});

export { registerUser };
