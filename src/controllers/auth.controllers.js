import crypto from "crypto"
import bcrypt from "bcryptjs"
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
    const verificationUrl = `http://localhost:8000/api/v1/auth/verify?token=${unHashedToken}`;
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

//verify email
const verifyEmail = asyncHandler(async (req, res) => {
    //fetch token
    const token = req.query.token;
    //validate token
    if (!token) {
        throw new ApiError(400, "token not available");
    }
    //hashing the token 
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //fetch user by hashed token
    const user = await User.findOne({ emailVerificationToken: hashedToken });
    //check user found or not
    if (!user) {
        throw new ApiError(400, "user not found during email verification");
    }
    //if user found then check expiry time
    if (Date.now() > user.emailVerificationExpiry) {
        throw new ApiError(
            404,
            "verification token expired , please resend again",
        );
    }
    //update user
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    user.isEmailVerified = true;

    //save user
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {
            message: "user email verified successfully",
        }),
    );
});

//login user
const loginUser = asyncHandler(async (req, res) => {
    //fetch data
    const { email, password } = req.body;

    //check user exist or not
    const user = await User.findOne({ email });
    //if user not found
    if (!user) {
        throw new ApiError(404, "user not found,register first");
    }
    //check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(401, "password does not match");
    }
    //check if user is already login

    //generate referesh token
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    
    //validate refresh token & access token
    if (!refreshToken || !accessToken) {
        throw new ApiError(500, "error in token generation");
    }
    //store refreshtoken in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    //store accesstoken in header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    //store refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                accessToken
            },
        }),
    );
});

//logout user
const logoutUser = asyncHandler(async (req, res) => {
    //fetch user data ;

    const { email } = req.user;

    const user = await User.findOne({ email });

    user.refreshToken = undefined;

    await user.save();

    res.clearCookie("refreshToken", {
        httpOnly: true,
    });
    res.status(200).json(
        new ApiResponse(200, { message: "user logged out successfully" }),
    );
});

// resendVerificationEmail
const resendVerificationEmail = asyncHandler(async(req,res)=>{
    //fetch user email from req
    const { email } = req.body;
    if(!email){
        throw new ApiError(404, "email not found , please give email");
    }
    //check user exists or not 
    const user = await User.findOne({ email });
    //if user not found
    if (!user) {
        throw new ApiError(404, "user not found,register first");
    }
    //check user is verified or not
    if(user.isEmailVerified){
        throw new ApiError(400, "user already verified,go to login");
    } 
    //create a verification token to verify email
    const { hashedToken, unHashedToken, tokenExpiry } =
        user.generateTemporaryToken();
    //check token generate or not
    if (!hashedToken || !unHashedToken || !tokenExpiry) {
        throw new ApiError(500, "error during verification token generation");
    }
    //save token in database
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    //send email for verification
    const verificationUrl = `http://localhost:8000/api/v1/auth/verify?token=${unHashedToken}`;
    //create mail body
    const mailOption = emailVerificationMailGenContent(
        user.username,
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
    //send response 
    return res
        .status(200)
        .json(new ApiResponse(200, "Verification email resent successfully"));
})
// refreshAccessToken
// forgotPasswordRequest
// changeCurrentPassword
// getCurrentUser

export { registerUser, verifyEmail, loginUser, logoutUser, resendVerificationEmail };
