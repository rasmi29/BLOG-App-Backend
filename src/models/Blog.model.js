import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

// Main Blog Schema
const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Blog title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
            minlength: [5, "Title must be at least 5 characters long"],
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },

        content: {
            type: String,
            required: [true, "Blog content is required"],
            minlength: [50, "Content must be at least 50 characters long"],
        },

        excerpt: {
            type: String,
            maxlength: [300, "Excerpt cannot exceed 300 characters"],
            trim: true,
        },

        // Author and Attribution
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required"],
            index: true,
        },

        // Categorization and Discovery
        category: {
            type: String,
            required: true,
            default: "General",
            enum: {
                values: [
                    "Technology",
                    "Lifestyle",
                    "Business",
                    "Health",
                    "Education",
                    "Entertainment",
                    "Sports",
                    "Travel",
                    "Food",
                    "Fashion",
                    "General",
                    "Other",
                ],
                message: "{VALUE} is not a valid category",
            },
            index: true,
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
                maxlength: [30, "Tag cannot exceed 30 characters"],
            },
        ],

        //photo

        images: [
            {
                url: String,
                alt: String,
                caption: String,
            },
        ],

        // Publishing and Status Management
        status: {
            type: String,
            enum: ["draft", "published", "archived", "under_review"],
            default: "draft",
            index: true,
        },

        publishedAt: {
            type: Date,
            index: true,
        },

        readTime: {
            type: Number,
            default: 0,
        },

        // Engagement Metrics
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likeCount: {
            type: Number,
            default: 0,
        },

        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bookmarkCount: {
            type: Number,
            default: 0,
        },

        views: {
            total: {
                type: Number,
                default: 0,
                index: true,
            },
            unique: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                    },
                    ip: String,
                    timestamp: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
        },

        shares: {
            type: Number,
            default: 0,
        },

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],

        // Content Analysis
        wordCount: {
            type: Number,
            default: 0,
        },

        language: {
            type: String,
            default: "en",
            maxlength: 5,
        },

        editHistory: [
            {
                editedAt: Date,
                editedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                changes: String,
            },
        ],

        // Featured and Promotion
        isFeatured: {
            type: Boolean,
            default: false,
            index: true,
        },

        featuredUntil: {
            type: Date,
        },

        isSponsored: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Pre-save middleware to generate slug
blogSchema.pre("save", function (next) {
    if (this.isModified("title") || this.isNew) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });

        // Ensure unique slug
        this.constructor
            .findOne({ slug: this.slug, _id: { $ne: this._id } })
            .then((existingBlog) => {
                if (existingBlog) {
                    this.slug = `${this.slug}-${Date.now()}`;
                }
                next();
            })
            .catch(next);
    } else {
        next();
    }
});

// Pre-save middleware to calculate read time and word count
blogSchema.pre("save", function (next) {
    if (this.isModified("content")) {
        // Calculate word count
        this.wordCount = this.content.split(/\s+/).length;

        // Calculate read time (average reading speed: 225 words per minute)
        this.readTime = Math.ceil(this.wordCount / 225);

        // Generate excerpt if not provided
        if (!this.excerpt) {
            const plainText = this.content.replace(/<[^>]*>/g, ""); // Remove HTML tags
            this.excerpt =
                plainText.substring(0, 200) +
                (plainText.length > 200 ? "..." : "");
        }
    }
    next();
});

// Pre-save middleware to set publishedAt
blogSchema.pre("save", function (next) {
    if (
        this.isModified("status") &&
        this.status === "published" &&
        !this.publishedAt
    ) {
        this.publishedAt = new Date();
    }
    next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
