
import Blog from "../models/Blog.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/asyncHandler.js";


//1. create blog

const createBlog = asyncHandler(async (req, res) => {
    //fetch data from body
    const { title, content, category, summary, tags, coverImage, status } =
        req.body;
    // 1. Validate required fields
    if (!title || !content || !category) {
        throw new ApiError(400, "Title, category and content are required");
    }
    //create a blog
    const blog = await Blog.create({
        title,
        content,
        author: req.user._id,
        category: category || "Other",
        tags: tags || [],
        coverImage: coverImage || {},
        status: status || "draft",
        summary: summary || undefined,
    });

    //check blog created or not
    if (!blog) {
        throw new ApiError(500, "problem in creating blog instances");
    }

    //send response
    res.status(201).json(
        new ApiResponse(201, blog, "New blog created successfully"),
    );

});

/**
 * 2. getAllBlogs
 * - Retrieves paginated list of published blogs
 * - Supports filtering by category, tags, author
 * - Includes sorting options (newest, oldest, most liked, trending)
 */

const getAllBlogs = asyncHandler(async (req, res) => {
    // fetch query params
    const {
        page = 1,
        limit = 10,
        category,
        tags,
        author,
        sort = "newest", 
    } = req.query;

    // build filter
    let filter = { status: "published" };

    if (category) filter.category = category;
    if (author) filter.author = author;
    if (tags) {
        // tags can be comma-separated: ?tags=js,node,webdev
        filter.tags = { $in: tags.split(",") };
    }

    // build sort
    let sortOption = { publishedAt: -1 }; // default newest
    if (sort === "oldest") sortOption = { publishedAt: 1 };
    if (sort === "most_liked") sortOption = { likeCount: -1 };
    if (sort === "trending") sortOption = { "views.total": -1 };

    // pagination
    const skip = (Number(page) - 1) * Number(limit);

    // fetch blogs
    const blogs = await Blog.find(filter)
        .populate("author", "username email") // fetch author details
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean();

    //count no of files after filteration
    const total = await Blog.countDocuments(filter);

    // response
    res.status(200).json(
        new ApiResponse(200, {
            blogs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        }, "Blogs fetched successfully")
    );
});


/**
 * 3. getBlogById
 * - Fetches single blog by ID with full details
 * - Increments view count
 * - Populates author and comment details
 */

/**
 * 4. getBlogBySlug
 * - SEO-friendly route to get blog by slug
 * - More user-friendly URLs
 * - Same functionality as getBlogById
 */

/**
 * 5. updateBlog
 * - Updates existing blog post
 * - Only author or admin can update
 * - Regenerates slug if title changes
 */

/**
 * 6. deleteBlog
 * - Soft delete or hard delete blog post
 * - Only author or admin can delete
 * - Handles cascade deletion of comments
 */

/**
 * 7. publishBlog
 * - Changes blog status from draft to published
 * - Updates publishedAt timestamp
 * - Validates content before publishing
 */

/**
 * 8. unpublishBlog
 * - Changes blog status from published to draft
 * - Only author or admin can unpublish
 */

/**
 * 14. likeBlog
 * - Toggles like on a blog post
 * - Prevents duplicate likes from same user
 * - Updates like count efficiently
 */

/**
 * 15. bookmarkBlog
 * - Adds/removes blog from user's bookmarks
 * - Personal reading list feature
 */

/**
 * 16. shareBlog
 * - Tracks blog shares
 * - Generates shareable links
 * - Updates share count
 */

/**
 * 17. viewBlog
 * - Increments view count
 * - Tracks unique views per user
 * - Analytics data collection
 */

/**
 * 18. searchBlogs
 * - Full-text search across title, content, tags
 * - Advanced search with filters
 * - Relevance-based sorting
 */

/**
 * 19. getBlogsByCategory
 * - Retrieves blogs filtered by category
 * - Pagination and sorting support
 */

/**
 * 20. getBlogsByTag
 * - Retrieves blogs filtered by specific tag(s)
 * - Supports multiple tag filtering (AND/OR logic)
 */

/**
 * 21. getBlogsByAuthor
 * - Retrieves all blogs by specific author
 * - Public author profile page support
 */

/**
 * 22. getTrendingBlogs
 * - Retrieves trending blogs based on engagement
 * - Calculates trending score (likes + comments + views)
 * - Time-based trending (daily, weekly, monthly)
 */

/**
 * 23. getRelatedBlogs
 * - Suggests related blogs based on tags/category
 * - Machine learning recommendations (optional)
 */

export { createBlog, getAllBlogs };
