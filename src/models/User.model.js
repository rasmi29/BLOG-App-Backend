import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, "Username is required"],
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [15, "Username cannot exceed 15 characters"],
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9_-]+$/.test(v);
                },
                message:
                    "Username can only contain letters, numbers, underscores, and hyphens",
            },
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, "Email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        role: {
            type: String,
            enum: ["author", "admin"],
            default: "author",
        },
        profile: {
            firstName: {
                type: String,
                trim: true,
                maxlength: [20, "First name cannot exceed 20 characters"],
            },
            lastName: {
                type: String,
                trim: true,
                maxlength: [20, "Last name cannot exceed 20 characters"],
            },
            bio: {
                type: String,
                maxlength: [500, "Bio cannot exceed 500 characters"],
                trim: true,
            },
            avatar: {
                url: String,
                cloudinaryId: String,
                alt: String,
            },
            dateOfBirth: Date,
            gender: {
                type: String,
                enum: ["male", "female", "other", "prefer_not_to_say"],
            },
            phone: {
                number: String,
                countryCode: String,
            },
            socialLinks: [
                {
                    platform: {
                        type: String,
                        enum: [
                            "twitter",
                            "linkedin",
                            "github",
                            "facebook",
                            "instagram",
                            "website",
                            "youtube",
                        ],
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                        validate: {
                            validator: function (v) {
                                return validator.isURL(v, {
                                    require_protocol: true,
                                });
                            },
                            message: "Invalid URL format",
                        },
                    },
                },
            ],
            addresses: {
                street: String,
                city: String,
                state: String,
                country: String,
                zipCode: String,
            },
            occupation: String,
            company: String,
            skills: [String],
            interests: [String],
        },

        // Account Status and Verification

        status: {
            type: String,
            enum: [
                "active",
                "inactive",
                "suspended",
                "banned",
                "pending_verification",
            ],
            default: "pending_verification",
        },
        // Social Features
        social: {
            followers: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    followedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            following: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    followedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            blockedUsers: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    blockedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    reason: String,
                },
            ],
            blockedBy: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    blockedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },

        lastLogin: Date,
        lastActive: Date,
        loginCount: { type: Number, default: 0 },
        deactivatedAt:Date,

        //user statistics
        stats: {
            blogsPublished: { type: Number, default: 0 },
            totalViews: { type: Number, default: 0 },
            totalLikes: { type: Number, default: 0 },
            totalComments: { type: Number, default: 0 },
            totalShares: { type: Number, default: 0 },
            followersCount: { type: Number, default: 0 },
            followingCount: { type: Number, default: 0 },
            reputation: { type: Number, default: 0 },
            engagementRate: { type: Number, default: 0 },
        },

        // Reading and Bookmarks
        reading: {
            bookmarks: [
                {
                    blog: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Blog",
                    },
                    category: {
                        type: String,
                        default: "default",
                    },
                    bookmarkedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            readingHistory: [
                {
                    blog: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Blog",
                    },
                    readAt: Date,
                    readingTime: Number, // in minutes
                    progress: Number, // percentage
                    completed: Boolean,
                },
            ],
            readingList: [
                {
                    blog: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Blog",
                    },
                    addedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    priority: {
                        type: String,
                        enum: ["low", "medium", "high"],
                        default: "medium",
                    },
                },
            ],
        },
    },
    { timestamps: true },
);

// hashing password before saving to database
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//verify password to authenticate
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
};

//generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};

// to generate any temporary token
userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + 20 * 60 * 1000;
    return { hashedToken, unHashedToken, tokenExpiry };
};

// Indexes

userSchema.index({ status: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ "profile.skills": 1 });
userSchema.index({ "profile.interests": 1 });
userSchema.index({ "social.followers.user": 1 });
userSchema.index({ "reading.bookmarks.blog": 1 });
userSchema.index({ "reading.readingHistory.blog": 1 });

// Text search index
userSchema.index({
  username: "text",
  "profile.firstName": "text",
  "profile.lastName": "text",
  "profile.bio": "text"
});



const User = mongoose.model("User", userSchema);

export default User;
